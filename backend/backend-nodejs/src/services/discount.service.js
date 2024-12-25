import { SEND_NOTIFICATION_TYPE, TYPE_NOTIFICATION } from '../constant/index.js';
import { BadRequestError, NotFoundError } from '../core/error.response.js';
import discountModel from '../models/discount.model.js';
import { checkDiscountExists, findAllDiscountCodeUnSelect } from '../models/repositories/discount.repo.js';
import { findAllProducts } from '../models/repositories/product.repo.js';
import { sendNotifitoQueue } from './rabbitmq.service.js';

export default class DiscountService {
    static async createDisCountCode(payload) {
        const {
            code,
            start_date,
            end_date,
            is_active,
            min_order_value,
            product_ids,
            applies_to,
            name,
            description,
            type,
            value,
            max_value,
            max_uses,
            uses_count,
            max_uses_per_user,
            isPublic,
        } = payload;

        const foundDiscount = await discountModel.findOne({
            discount_code: code,
        });

        if (foundDiscount && foundDiscount.discount_is_active) {
            throw new BadRequestError('Discount exists');
        }
        tModel.findByIdAndUpdate(foundDiscount._id, {
            $pull: {
                discount_user_used: userId,
            },
            $inc: {
                discount_max_uses: 1,
                discount_uses_count: -1,
            },
        });

        return result;
    }

    static async findAll() {
        return await discountModel
            .find({
                discount_is_active: true,
            })
            .lean();
    }

    static async validateDiscount({
        selectedProducts, //{spuId,skuId,price,quantity}
        discountId,
        checkOutInfo,
    }) {
        const discount = await discountModel.findById(discountId);

        if (discount.discount_applies_to === 'specific') {
            const productIds = discount.discount_product_ids;

            // Extract productIds from selectedProduct
            const spuIds = selectedProducts.map((selectedProduct) => selectedProduct.spuId);

            // Check if all productIds from selectedProduct match those in the discount
            const isMatch = spuIds.every((spuId) => productIds.includes(spuId));

            if (!isMatch) return false;
        }
    }

    static async getDiscountAmountV2({
        userId,
        discountId,
        products, // [{spuId, skuId, price, quantity}]
    }) {
        const discount = await discountModel.findById(discountId);
        if (!discount) throw new BadRequestError('Not found discount');

        const now = new Date();
        const currentDate = new Date(now.getTime() + 7 * 60 * 60 * 1000);

        if (currentDate < discount.discount_start || currentDate > discount.discount_end) {
            throw new BadRequestError('Voucher này đã hết hạn');
        }

        // 3. Kiểm tra số lượng sử dụng tối đa
        if (discount.discount_max_uses !== null && discount.discount_uses_count >= discount.discount_max_uses) {
            throw new BadRequestError('Voucher này đã hế lượt dụng');
        }

        // 4. Kiểm tra số lần sử dụng của user
        if (discount.discount_max_uses_per_user && userId) {
            const userUsedCount = discount.discount_user_used.filter(
                (used) => used.userId.toString() === userId.toString(),
            ).length;

            if (userUsedCount >= discount.discount_max_uses_per_user) {
                throw new BadRequestError('You have used it all');
            }
        }

        // Tính tổng giá trị đơn hàng
        const totalOrderValue = products.reduce((acc, product) => {
            return acc + product.quantity * product.price;
        }, 0);

        // Kiểm tra giá trị đơn hàng tối thiểu
        if (discount.discount_min_order_value && totalOrderValue < discount.discount_min_order_value) {
            throw new BadRequestError(`Order value must be at least ${discount.discount_min_order_value}`);
        }

        let discountAmount = 0;

        // Tính giảm giá cho toàn bộ đơn hàng
        if (discount.discount_applies_to === 'all') {
            if (discount.discount_type === 'fixed_amount') {
                discountAmount = discount.discount_value * products.length;
            } else {
                discountAmount = totalOrderValue * (discount.discount_value / 100) * products.length;
            }
        } else {
            // Tính giảm giá cho sản phẩm cụ thể
            if (discount.discount_type === 'fixed_amount') {
                // Đếm số sản phẩm hợp lệ
                const eligibleProducts = products.filter((product) =>
                    discount.discount_product_ids.includes(product.spuId),
                );
                discountAmount = discount.discount_value * eligibleProducts.length;
            } else if (discount.discount_type === 'percentage') {
                // Tính tổng giá trị của các sản phẩm hợp lệ
                const eligibleAmount = products.reduce((total, product) => {
                    if (discount.discount_product_ids.includes(product.spuId)) {
                        return total + product.price * product.quantity;
                    }
                    return total;
                }, 0);
                discountAmount = (eligibleAmount * discount.discount_value) / 100;
            }
        }

        // Kiểm tra giá trị giảm tối đa nếu có
        if (discount.discount_max_value && discountAmount > discount.discount_max_value) {
            discountAmount = discount.discount_max_value;
        }

        return {
            totalOrder: totalOrderValue,
            discount: discountAmount,
            totalPrice: totalOrderValue - discountAmount,
        };
    }

    static async findAvailableDiscounts({
        userId,
        products, // [{spuId, skuId, price, quantity}]
    }) {
        // 1. Lấy tất cả discount đang active
        const allDiscounts = await discountModel.find({
            discount_is_active: true,
            discount_isPublic: true,
        });

        const availableDiscounts = [];
        const now = new Date();
        const currentDate = new Date(now.getTime() + 7 * 60 * 60 * 1000);
        console.log('🚀 ~ DiscountService ~ currentDate:', currentDate);

        for (const discount of allDiscounts) {
            // 2. Kiểm tra thời gian hiệu lực
            if (currentDate < discount.discount_start || currentDate > discount.discount_end) {
                console.log('From 1');
                continue;
            }

            // 3. Kiểm tra số lượng sử dụng tối đa
            if (discount.discount_max_uses !== null && discount.discount_uses_count >= discount.discount_max_uses) {
                console.log('From 2');
                continue;
            }

            // 4. Kiểm tra số lần sử dụng của user
            if (discount.discount_max_uses_per_user && userId) {
                const userUsedCount = discount.discount_user_used.filter(
                    (used) => used.userId.toString() === userId.toString(),
                ).length;

                if (userUsedCount >= discount.discount_max_uses_per_user) {
                    continue;
                }
            }

            // 5. Kiểm tra giá trị đơn hàng tối thiểu
            const orderValue = products.reduce((total, product) => {
                return total + product.price * product.quantity;
            }, 0);

            if (discount.discount_min_order_value && orderValue < discount.discount_min_order_value) {
                continue;
            }

            // 6. Kiểm tra sản phẩm áp dụng
            if (discount.discount_applies_to === 'specific') {
                const productIds = products.map((p) => p.spuId);
                const isValidProduct = productIds.some((id) => discount.discount_product_ids.includes(id));

                console.log('🚀 ~ DiscountService ~ isValidProduct:', isValidProduct);
                if (!isValidProduct) continue;
            }

            // 7. Tính toán số tiền được giảm
            let discountAmount = 0;
            if (discount.discount_type === 'fixed_amount') {
                // Đếm số sản phẩm hợp lệ
                const eligibleProducts = products.filter((product) =>
                    discount.discount_product_ids.includes(product.spuId),
                );
                discountAmount = discount.discount_value * eligibleProducts.length;
            } else if (discount.discount_type === 'percentage') {
                // Tính tổng giá trị của các sản phẩm hợp lệ
                const eligibleAmount = products.reduce((total, product) => {
                    if (discount.discount_product_ids.includes(product.spuId)) {
                        return total + product.price * product.quantity;
                    }
                    return total;
                }, 0);
                discountAmount = (eligibleAmount * discount.discount_value) / 100;
            }

            // 8. Thêm vào danh sách discount khả dụng
            availableDiscounts.push({
                ...discount.toObject(),
                discountAmount,
                numberOfEligibleProducts: products.filter((product) =>
                    discount.discount_product_ids.includes(product.spuId),
                ).length,
            });
        }

        // 9. Sắp xếp theo giá trị giảm giá từ cao đến thấp
        return availableDiscounts.sort((a, b) => b.discountAmount - a.discountAmount);
    }

    static async filterAllDiscountForClient({
        userId,
        products, // [{spuId, skuId, price, quantity}]
    }) {
        const allDiscounts = await discountModel.find({
            discount_is_active: true,
            discount_isPublic: true,
        });

        const availableDiscounts = await this.findAvailableDiscounts({
            userId,
            products,
        });

        const availableDiscountIds = new Set(availableDiscounts.map((d) => d._id.toString()));

        const unAvailableDiscounts = allDiscounts.filter(
            (discount) => !availableDiscountIds.has(discount._id.toString()),
        );

        return {
            availableDiscounts,
            unAvailableDiscounts,
        };
    }

    static async findPrivateDiscount({ code }) {
        return await discountModel.find({
            discount_code: code,
            discount_isPublic: false,
        });
    }
}
