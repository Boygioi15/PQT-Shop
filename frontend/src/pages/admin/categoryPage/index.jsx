import React, { useState, useEffect } from "react";
import { AiOutlineDown, AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import Loading from "../../../component/Loading";
import { deleteCategory, getAllCategory } from "../../../config/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  console.log("🚀 ~ CategoryPage ~ categories:", categories)
  const [activeCollapse, setActiveCollapse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    categoryId: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await getAllCategory();
      setCategories(response?.metadata || []);
    } catch (error) {
      toast.error("Error fetching categories.");
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCollapse = (categoryId) => {
    setActiveCollapse((prev) => (prev === categoryId ? null : categoryId));
  };

  const handleEdit = (categoryId) => {
    navigate(`/admin/category-edit/${categoryId}`);
  };

  const handleDelete = async (categoryId) => {
    setDeleteModal({ isOpen: true, categoryId });
  };

  const confirmDelete = async () => {
    try {
      await deleteCategory(deleteModal.categoryId);
      fetchCategories(); // Reload categories after deletion
      toast.success("Category deleted successfully!");
    } catch (error) {
      toast.error("Error deleting category.");
      console.error("Error deleting category:", error);
    } finally {
      setDeleteModal({ isOpen: false, categoryId: null });
    }
  };

  const handleCreate = () => {
    navigate("/admin/category-create");
  };

  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <div className="flex justify-between bg-white px-6 py-8 rounded-lg items-center mb-6">
        <h1 className="text-5xl font-bold text-gray-700">
          Category Management
        </h1>
        <button
          onClick={handleCreate}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 shadow-md"
        >
          + Create Category
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <Loading />
        </div>
      ) : (
        <div>
          {categories.map((category) => (
            <div
              key={category._id}
              className="bg-white shadow rounded-lg mb-4 p-6 overflow-hidden transition-all duration-500 ease-in-out"
              style={{
                maxHeight: activeCollapse === category._id ? "1000px" : "200px",
              }}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-6">
                  {category.category_img ? (
                    <img
                      src={category.category_img}
                      alt={category.category_name || "Category Image"}
                      className="h-20 w-20 rounded object-cover"
                    />
                  ) : (
                    <div className="h-20 w-20 bg-gray-200 rounded"></div>
                  )}
                  <div>
                    <p className="font-bold text-2xl text-gray-700">
                      {category.category_name || "Unnamed Category"}
                    </p>
                    {category.category_description && (
                      <p className="text-lg text-gray-500">
                        {category.category_description}
                      </p>
                    )}
                  </div>
                </div>
                <AiOutlineDown
                  className={`text-gray-500 cursor-pointer transition-transform duration-500 ease-in-out ${
                    activeCollapse === category._id ? "rotate-180" : ""
                  }`}
                  onClick={() => toggleCollapse(category._id)}
                />
              </div>

              {activeCollapse === category._id && (
                <div className="mt-4 p-4 rounded-lg ">
                  <table className="w-full bg-white table-auto shadow-md rounded-lg overflow-x-auto">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-5 text-left rounded-tl-lg">Image</th>
                        <th className="p-5 text-left">Category Name</th>
                        <th className="p-5 text-left">Description</th>
                        <th className="p-5 text-center rounded-tr-lg">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {category.children.map((sub) => (
                        <tr key={sub._id} className="hover:bg-gray-50">
                          <td className="p-5 border-b">
                            {sub.category_img ? (
                              <img
                                src={sub.category_img}
                                alt={sub.category_name || "Subcategory Image"}
                                className="h-16 w-16 rounded object-cover"
                              />
                            ) : (
                              <div className="h-16 w-16 bg-gray-200 rounded"></div>
                            )}
                          </td>
                          <td className="p-5 border-b text-mainColor font-semibold text-lg">
                            {sub.category_name || "Unnamed Subcategory"}
                          </td>
                          <td className="p-5 border-b text-gray-700 text-lg">
                            {sub.category_description || "No Description"}
                          </td>
                          <td className="p-5 border-b text-center">
                            <div className="flex justify-center items-center gap-x-4">
                              <AiOutlineEdit
                                className="text-blue-500 cursor-pointer hover:text-blue-700"
                                onClick={() => handleEdit(sub._id)}
                              />
                              <AiOutlineDelete
                                className="text-red-500 cursor-pointer hover:text-red-700"
                                onClick={() => handleDelete(sub._id)}
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-1/3 shadow-lg">
            <h3 className="text-xl font-semibold">Confirm Deletion</h3>
            <p className="mt-4">
              Are you sure you want to delete this category?
            </p>
            <div className="flex justify-end mt-6">
              <button
                onClick={() =>
                  setDeleteModal({ isOpen: false, categoryId: null })
                }
                className="mr-4 text-gray-600 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
