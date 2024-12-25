import { CategoryService } from '../services/category.service.js';
import { SuccessResponse } from '../core/success.response.js';

import multer from 'multer';
import cloudinary from 'cloudinary';

class CategoryController {
    static async createCategory(req, res, next) {
        try {
            const { name, description, parentId } = req.body;

            const result = await CategoryService.createCategory({
                name,
                description,
                parentId,
            });

            new SuccessResponse({
                message: 'Category created successfully',
                metadata: result,
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    static async updateCategory(req, res, next) {
        try {
            const { id } = req.params;
            const { name, description } = req.body;

            const result = await CategoryService.updateCategory({
                categoryId: id,
                name,
                description,
            });

            new SuccessResponse({
                message: 'Category updated successfully',
                metadata: result,
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    static async deleteCategory(req, res, next) {
        try {
            const { id } = req.params;

            const result = await CategoryService.deleteCategory({
                categoryId: id,
            });

            new SuccessResponse({
                message: 'Category deleted successfully',
                metadata: result,
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    static async getAllCategory(req, res, next) {
        try {
            const result = await CategoryService.getCategories();

            new SuccessResponse({
                message: 'Categories retrieved successfully',
                metadata: result,
            }).send(res);
        } catch (error) {
            next(error);
        }
    }
}

export default CategoryController;
