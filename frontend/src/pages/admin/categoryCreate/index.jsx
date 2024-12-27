import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  createCategory,
  getAllCategory,
  getCategoryById,
  updateCategory,
} from "../../../config/api";
import CustomSelect from "../../../component/CustomSelect";
import ThumbnailUpload from "../../../component/admin/addProduct/ThumbnailUpload";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import Loading from "../../../component/Loading";

const CategoryCreate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [description, setDescription] = useState("");
  const [allCategory, setAllCategory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  console.log("🚀 ~ CategoryCreate ~ allCategory:", allCategory);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    parentId: "",
    thumb: "",
  });
  console.log("🚀 ~ CategoryCreate ~ newCategory:", newCategory);

  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["bold", "italic", "underline"],
      ["link"],
      [{ align: [] }],
      [{ color: [] }, { background: [] }],
      ["image"],
    ],
  };

  useEffect(() => {
    handleGetCategory();
    if (id) {
      handleGetCategoryById();
    }
  }, [id]);

  const handleGetCategory = async () => {
    setIsLoading(true);
    try {
      const response = await getAllCategory();
      if (response && response.metadata) {
        setAllCategory(response.metadata);
      } else {
        toast.error("Failed to fetch categories!");
        console.error("Failed to fetch categories: Invalid response.");
      }
    } catch (error) {
      toast.error("Error fetching categories!");
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetCategoryById = async () => {
    setIsLoading(true);
    try {
      const response = await getCategoryById(id);
      console.log("🚀 ~ handleGetCategoryById ~ response:", response);
      if (response && response.metadata) {
        const category = response.metadata;
        setNewCategory({
          name: category.category_name || "",
          description: category.category_description || "",
          parentId: category.category_parentId || "",
          thumb: category.category_img || "",
        });
        setDescription(category.category_description || "");
      } else {
        toast.error("Failed to fetch category details!");
        console.error("Failed to fetch category details: Invalid response.");
      }
    } catch (error) {
      toast.error("Error fetching category details!");
      console.error("Error fetching category details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = (field, value) => {
    setNewCategory((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let response;
      if (id) {
        const updatedCategory = {
          name: newCategory.name,
          description: newCategory.description,
          thumb: newCategory.thumb,
        };
        response = await updateCategory(id, updatedCategory);
      } else {
        response = await createCategory(newCategory);
      }

      if (response && response.status === 200) {
        toast.success(
          id
            ? "Category updated successfully!"
            : "Category created successfully!"
        );
        navigate("/admin/category");
      } else {
        toast.error(
          id ? "Failed to update category!" : "Failed to create category!"
        );
      }
    } catch (error) {
      toast.error(id ? "Error updating category!" : "Error creating category!");
      console.error(
        id ? "Error updating category:" : "Error creating category:",
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col w-full mx-auto bg-white rounded-lg shadow-md p-8">
      <h1 className="text-3xl font-bold text-gray-700 text-center mb-6">
        {id ? "Update Category" : "Create New Category"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category Name Input */}
        <div>
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="categoryName"
          >
            Category Name
          </label>
          <input
            id="categoryName"
            type="text"
            placeholder="Enter category name"
            value={newCategory.name}
            onChange={(e) => handleCategoryChange("name", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Parent Category Select */}
        <div>
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="parentCategory"
          >
            Parent Category
          </label>
          <CustomSelect
            options={[
              { value: "", label: "None" },
              ...allCategory.map((category) => ({
                value: category._id,
                label: category.category_name,
              })),
            ]}
            value={newCategory.parentId}
            onChange={(value) => handleCategoryChange("parentId", value)}
            placeholder="Select Parent Category"
          />
        </div>

        {/* Thumbnail Upload */}
        <div>
          <ThumbnailUpload
            productData={{ thumb: newCategory.thumb }}
            setProductData={(data) => handleCategoryChange("thumb", data.thumb)}
          />
        </div>

        {/* Description Input */}
        <div>
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="categoryDescription"
          >
            Description
          </label>
          <ReactQuill
            id="categoryDescription"
            value={description}
            onChange={(value) => {
              setDescription(value);
              handleCategoryChange("description", value);
            }}
            modules={modules}
            className="w-full max-h-screen overflow-y-auto border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            placeholder="Enter category description"
          />
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-between mt-4">
          <button
            type="button"
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          >
            {id ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryCreate;
