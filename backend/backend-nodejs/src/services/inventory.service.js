import {
    BadRequestError,
    NotFoundError
} from '../core/error.response.js';
import inventoryModel from '../models/inventory.model.js';
import {
    getProductById
} from '../models/repositories/product.repo.js';

class InventoryService {
    /**
     * Add stock to inventory
     * @param {Object} param0 - stock, productId, location
     * @returns {Object} Updated inventory document
     */
    static async addStockToInventory({
        stock,
        productId,
        location = 'QB'
    }) {
        const product = await getProductById(productId);
        if (!product) {
            throw new BadRequestError('The product does not exist');
        }

        const query = {
                inven_productId: productId
            },
            updateSet = {
                $inc: {
                    inven_stock: stock
                },
                $set: {
                    inven_location: location
                },
            },
            options = {
                upsert: true,
                new: true
            };

        return await inventoryModel.findOneAndUpdate(query, updateSet, options);
    }

    /**
     * Update inventory stock or location
     * @param {Object} param0 - inventoryId, stock, location
     * @returns {Object} Updated inventory document
     */
    static async updateInventory({
        inventoryId,
        stock,
        location
    }) {
        const query = {
                _id: inventoryId
            },
            updateSet = {
                ...(stock && {
                    $set: {
                        inven_stock: stock
                    }
                }),
                ...(location && {
                    $set: {
                        inven_location: location
                    }
                }),
            },
            options = {
                new: true
            };

        const updatedInventory = await inventoryModel.findOneAndUpdate(
            query,
            updateSet,
            options
        );

        if (!updatedInventory) {
            throw new NotFoundError('Inventory not found');
        }

        return updatedInventory;
    }

    /**
     * Delete inventory item by ID
     * @param {String} inventoryId - The ID of the inventory document to delete
     * @returns {Object} Deleted inventory document
     */
    static async deleteInventory(inventoryId) {
        const deletedInventory = await inventoryModel.findByIdAndDelete(inventoryId);

        if (!deletedInventory) {
            throw new NotFoundError('Inventory not found');
        }

        return deletedInventory;
    }

    /**
     * Get inventory by product ID
     * @param {String} productId - The ID of the product
     * @returns {Object} Inventory document
     */
    static async getInventoryByProductId(productId) {
        const inventory = await inventoryModel.findOne({
            inven_productId: productId
        });

        if (!inventory) {
            throw new NotFoundError('Inventory not found for this product');
        }

        return inventory;
    }

    /**
     * Get all inventory items
     * @returns {Array} List of inventory documents
     */
    static async getAllInventory() {
        return await inventoryModel.find();
    }
}

export default InventoryService;