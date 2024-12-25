import CheckOutService from './checkout.service.js';
import {
    acquireLock,
    acquireLockV2,
    releaseLock
} from './redis.service.js';
import {
    BadRequestError,
    NotFoundError
} from '../core/error.response.js'; // Custom error handling
import orderModel from '../models/order.model.js';

export class OrderService {
    // Place an order by user
    static async orderByUser({
        cartId,
        userId,
        shop_discount,
        products_order,
        user_payment = {},
        user_address = {}
    }) {
        const {
            checkOut_order
        } = await CheckOutService.checkOutRevew({
            cartId,
            userId,
            shop_discount,
            products_order,
        });

        const acquireProduct = [];
        // Verify inventory for each product
        for (let i = 0; i < products_order.length; i++) {
            const {
                productId,
                quantity
            } = products_order[i];
            const keyLock = await acquireLockV2({
                productId,
                quantity,
            });
            acquireProduct.push(keyLock ? true : false);

            if (keyLock) {
                await releaseLock(keyLock);
            }
        }

        // Check if any products are out of stock
        if (acquireProduct.includes(false)) {
            throw new BadRequestError('Một số sản phẩm đã được cập nhật vui lòng quay lại');
        }

        // Create a new order
        const newOrder = await orderModel.create({
            order_userId: userId,
            order_checkout: checkOut_order,
            order_shipping: user_address,
            order_payment: user_payment,
            order_products: products_order,
        });

        // If order creation is successful, remove items from the cart
        if (newOrder) {
            for (let i = 0; i < products_order.length; i++) {
                await CartService.deleteUserCart({
                    userId,
                    productId: products_order[i].productId,
                });
            }
        }

        return newOrder;
    }

    // Get a specific order by user
    static async getOneOrderByUser({
        userId,
        orderId
    }) {
        const order = await orderModel.findOne({
            _id: orderId,
            order_userId: userId
        });
        if (!order) {
            throw new NotFoundError('Đơn hàng không tồn tại');
        }
        return order;
    }

    // Cancel an order by user
    static async cancelOrderByUserd({
        userId,
        orderId
    }) {
        const order = await orderModel.findOne({
            _id: orderId,
            order_userId: userId
        });

        if (!order) {
            throw new NotFoundError('Đơn hàng không tồn tại');
        }

        if (order.order_status !== 'pending') {
            throw new BadRequestError('Chỉ đơn hàng chờ xác nhận mới có thể huỷ');
        }

        order.order_status = 'cancelled';
        await order.save();

        return order;
    }

    // Update order status by admin
    static async updateOrderStatusByAdmind({
        orderId,
        status
    }) {
        const validStatuses = ['pending', 'confirmed', 'shipped', 'cancelled', 'delivered'];
        if (!validStatuses.includes(status)) {
            throw new BadRequestError('Trạng thái đơn hàng không hợp lệ');
        }

        const order = await orderModel.findById(orderId);
        if (!order) {
            throw new NotFoundError('Đơn hàng không tồn tại');
        }

        order.order_status = status;
        await order.save();

        return order;
    }


    static async orderByUserVd({
        cartId,
        userId,
        shop_discount,
        products_order,
        user_payment,
        user_address,
        payment_method = 'COD'
    }) {
        // Bước 1: Tạo session để tracking transaction
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Bước 2: Checkout review vẫn giữ nguyên
            const {
                checkOut_order
            } = await CheckOutService.checkOutRevew({
                cartId,
                userId,
                shop_discount,
                products_order,
            });

            // Bước 3: Lock inventory
            const acquireProduct = await Promise.all(
                products_order.map(async ({
                    spuId,
                    skuId,
                    quantity
                }) => {
                    const keyLock = await acquireLockV2({
                        skuId,
                        quantity
                    });
                    if (!keyLock) return false;

                    // Lưu keyLock để release sau này nếu fail
                    return {
                        success: true,
                        keyLock,
                        skuId
                    };
                })
            );

            if (acquireProduct.some(result => !result.success)) {
                throw new BadRequestError('Một số sản phẩm đã được cập nhật, vui lòng quay lại');
            }

            // Bước 4: Xử lý payment dựa trên payment_method
            let paymentIntent;
            if (payment_method === 'STRIPE') {
                paymentIntent = await stripe.paymentIntents.create({
                    amount: checkOut_order.totalCheckOut,
                    currency: 'vnd',
                    payment_method_types: ['card'],
                    metadata: {
                        userId,
                        order_products: JSON.stringify(products_order.map(p => p.productId))
                    }
                });
            }

            // Bước 5: Tạo order với trạng thái pending
            const newOrder = await orderModel.create({
                order_userId: userId,
                order_checkout: checkOut_order,
                order_shipping: user_address,
                order_payment: {
                    ...user_payment,
                    status: payment_method === 'STRIPE' ? 'pending' : 'succeeded',
                    payment_method,
                    payment_intent_id: paymentIntent?.id
                },
                order_products: products_order,
                order_status: payment_method === 'STRIPE' ? 'pending' : 'confirmed'
            }, {
                session
            });

            // Bước 6: Cập nhật inventory và xóa cart
            await Promise.all([
                ...products_order.map(({
                        productId,
                        quantity
                    }) =>
                    ProductService.reduceInventory(productId, quantity, session)
                ),
                ...products_order.map(({
                        productId
                    }) =>
                    CartService.deleteUserCart({
                        userId,
                        productId
                    }, session)
                )
            ]);

            // Bước 7: Commit transaction
            await session.commitTransaction();

            // Bước 8: Release locks
            await Promise.all(
                acquireProduct.map(({
                    keyLock
                }) => releaseLock(keyLock))
            );

            // Trả về kết quả khác nhau tùy payment method
            return payment_method === 'STRIPE' ? {
                order: newOrder,
                clientSecret: paymentIntent.client_secret
            } : {
                order: newOrder
            };

        } catch (error) {
            // Rollback nếu có lỗi
            await session.abortTransaction();
            // Release tất cả locks đã acquire
            if (acquireProduct?.length) {
                await Promise.all(
                    acquireProduct
                    .filter(result => result.keyLock)
                    .map(({
                        keyLock
                    }) => releaseLock(keyLock))
                );
            }
            throw error;
        } finally {
            session.endSession();
        }
    }

    static async cancelOrderByUser({
        userId,
        orderId
    }) {
        const order = await orderModel.findOne({
            _id: orderId,
            order_userId: userId
        });

        if (!order) {
            throw new NotFoundError('Đơn hàng không tồn tại');
        }

        if (order.order_status !== 'pending') {
            throw new BadRequestError('Chỉ đơn hàng chờ xác nhận mới có thể huỷ');
        }

        order.order_status = 'cancelled';
        await order.save();

        return order;
    }

    // Update order status by admin
    static async updateOrderStatusByAdmin({
        orderId,
        status
    }) {
        const validStatuses = ['pending', 'confirmed', 'shipped', 'cancelled', 'delivered'];
        if (!validStatuses.includes(status)) {
            throw new BadRequestError('Trạng thái đơn hàng không hợp lệ');
        }

        const order = await orderModel.findById(orderId);
        if (!order) {
            throw new NotFoundError('Đơn hàng không tồn tại');
        }

        order.order_status = status;
        await order.save();

        return order;
    }


    static async orderByUserV2({
        cartId,
        userId,
        shop_discount,
        products_order,
        user_payment,
        user_address,
        payment_method = 'COD'
    }) {
        // Bước 1: Tạo session để tracking transaction
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Bước 2: Checkout review vẫn giữ nguyên
            const {
                checkOut_order
            } = await CheckOutService.checkOutRevew({
                cartId,
                userId,
                shop_discount,
                products_order,
            });

            // Bước 3: Lock inventory
            const acquireProduct = await Promise.all(
                products_order.map(async ({
                    spuId,
                    skuId,
                    quantity
                }) => {
                    const keyLock = await acquireLockV2({
                        skuId,
                        quantity
                    });
                    if (!keyLock) return false;

                    // Lưu keyLock để release sau này nếu fail
                    return {
                        success: true,
                        keyLock,
                        skuId
                    };
                })
            );

            if (acquireProduct.some(result => !result.success)) {
                throw new BadRequestError('Một số sản phẩm đã được cập nhật, vui lòng quay lại');
            }

            // Bước 4: Xử lý payment dựa trên payment_method
            let paymentIntent;
            if (payment_method === 'STRIPE') {
                paymentIntent = await stripe.paymentIntents.create({
                    amount: checkOut_order.totalCheckOut,
                    currency: 'vnd',
                    payment_method_types: ['card'],
                    metadata: {
                        userId,
                        order_products: JSON.stringify(products_order.map(p => p.productId))
                    }
                });
            }

            // Bước 5: Tạo order với trạng thái pending
            const newOrder = await orderModel.create({
                order_userId: userId,
                order_checkout: checkOut_order,
                order_shipping: user_address,
                order_payment: {
                    ...user_payment,
                    status: payment_method === 'STRIPE' ? 'pending' : 'succeeded',
                    payment_method,
                    payment_intent_id: paymentIntent?.id
                },
                order_products: products_order,
                order_status: payment_method === 'STRIPE' ? 'pending' : 'confirmed'
            }, {
                session
            });

            // Bước 6: Cập nhật inventory và xóa cart
            await Promise.all([
                ...products_order.map(({
                        productId,
                        quantity
                    }) =>
                    ProductService.reduceInventory(productId, quantity, session)
                ),
                ...products_order.map(({
                        productId
                    }) =>
                    CartService.deleteUserCart({
                        userId,
                        productId
                    }, session)
                )
            ]);

            // Bước 7: Commit transaction
            await session.commitTransaction();

            // Bước 8: Release locks
            await Promise.all(
                acquireProduct.map(({
                    keyLock
                }) => releaseLock(keyLock))
            );

            // Trả về kết quả khác nhau tùy payment method
            return payment_method === 'STRIPE' ? {
                order: newOrder,
                clientSecret: paymentIntent.client_secret
            } : {
                order: newOrder
            };

        } catch (error) {
            // Rollback nếu có lỗi
            await session.abortTransaction();
            // Release tất cả locks đã acquire
            if (acquireProduct?.length) {
                await Promise.all(
                    acquireProduct
                    .filter(result => result.keyLock)
                    .map(({
                        keyLock
                    }) => releaseLock(keyLock))
                );
            }
            throw error;
        } finally {
            session.endSession();
        }
    }
}