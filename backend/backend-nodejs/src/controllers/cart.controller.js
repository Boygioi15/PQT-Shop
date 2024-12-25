import { SuccessResponse } from '../core/success.response.js';
import { CartService } from '../services/cart.service.js';
import multer from 'multer';
import cors from 'cors';

class CartController {
    // Add an item to the cart

    //Reorganize the cart feature, update cart
    async addToCart(req, res, next) {
        try {
            const result = await CartService.addToCart(req.body);
            new SuccessResponse({
                message: 'Item added to cart successfully',
                metadata: result,
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    // Update an item in the cart
    async updateCart(req, res, next) {
        try {
            const result = await CartService.updateCart(req.body);
            new SuccessResponse({
                message: 'Cart updated successfully',
                metadata: result,
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    // Remove an item from the cart
    async deleteFromCart(req, res, next) {
        try {
            const result = await CartService.deleteUserCart(req.body);
            new SuccessResponse({
                message: 'Item removed from cart successfully',
                metadata: result,
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    // Show the cart contents
    async showCart(req, res, next) {
        try {
            const result = await CartService.showCart(req.query);
            new SuccessResponse({
                message: 'Cart retrieved successfully',
                metadata: result,
            }).send(res);
        } catch (error) {
            next(error);
        }
    }
}

export default new CartController();
