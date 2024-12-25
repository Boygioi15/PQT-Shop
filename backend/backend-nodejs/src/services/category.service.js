import categoryModel from '../models/category.model.js';
import { BadRequestError } from '../core/error.response.js';
export class CategoryService {
    static async getSubCategories(parentId) {
        const subCategories = await categoryModel
            .find({
                category_parentId: parentId,
            })
            .select('category_name category_description category_slug');

        return Promise.all(
            subCategories.map(async (subCategory) => {
                const children = await this.getSubCategories(subCategory._id); // Gọi đệ quy để lấy danh mục con
                return {
                    ...subCategory.toObject(),
                    children, // Thêm danh mục con vào danh mục cha
                };
            }),
        );
    }

    static async getCategories() {
        // Tìm tất cả danh mục (bao gồm cả cha và con) với category_parentId là null hoặc khác null
        const categories = await categoryModel.aggregate([
            {
                $lookup: {
                    from: 'Categories', // Tên collection cho các danh mục
                    localField: '_id', // Trường liên kết với bảng con (category_parentId trong bảng con)
                    foreignField: 'category_parentId', // Trường tham chiếu tới _id của danh mục cha
                    as: 'children', // Gán kết quả truy vấn vào mảng children
                },
            },
            {
                $match: {
                    category_parentId: null, // Chỉ lấy danh mục cha
                },
            },
            {
                $project: {
                    category_name: 1,
                    category_description: 1,
                    category_slug: 1,
                    category_img: 1,
                    children: {
                        category_name: 1,
                        category_description: 1,
                        category_slug: 1,
                        category_img: 1,
                        children: [], // Tránh hiển thị children cho các danh mục con ở đây
                    },
                },
            },
        ]);

        return categories;
    }
}
