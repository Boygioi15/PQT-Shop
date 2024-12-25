import { Types } from 'mongoose';
import { BadRequestError, NotFoundError } from '../core/error.response.js';
import cartModel from '../models/cart.model.js';
import {
    addNewProductToCart,
    checkExistProduct,
    createUserCart,
    getProductInforForCart,
    replaceItemsInCart,
    updateUserCartQuantity,
} from '../models/repositories/cart.repo.js';
import { findSkuById } from '../models/repositories/sku.repo.js';

export class CartService {
    static async showCart({ userId }) {
        if (!userId) {
            throw new BadRequestError('You have signed out');
        }
        const cart = await cartModel
            .findOne({
                cart_userId: userId,
            })
            .lean();

        if (!cart || !cart.cart_products || cart.cart_products.length === 0) {
            return {
                message: 'Giỏ hàng trống',
                cartItems: [],
            };
        }

        const items = await Promise.all(
            cart.cart_products.map(async (item) => {
                const { skuId, quantity } = item;

                let data = await getProductInforForCart(skuId);

                return {
                    ...data,
                    quantity,
                };
            }),
        );

        return items;
    }
}
