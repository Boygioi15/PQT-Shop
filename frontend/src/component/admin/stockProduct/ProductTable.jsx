import React, { useState } from "react";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { formatVND } from "../../../utils/format";
import { deleteProduct } from "../../../config/api";
import { toast } from "react-toastify";
const ProductTable = ({
  products,
  selectedProducts,
  setSelectedProducts,
  handleEditProduct,
  fetchTabCounts,
  fetchTabData,
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const handleOpenDeleteModal = (id) => {
    setProductToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      await handleDeleteOneById(productToDelete);
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB").format(date);
  };

  const DeleteModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg p-6 w-1/3 shadow-lg">
          <h3 className="text-xl font-semibold">Confirm Deletion</h3>
          <p className="mt-4">
            Are you sure you want to delete the selected products?
          </p>
          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="mr-4 text-gray-600 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm()}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleDeleteOneById = async (id) => {
    try {
      const response = await deleteProduct(id);
      if (response.status === 200) {
        await fetchTabData();
        await fetchTabCounts();
        toast.success("Product deleted successfully!");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(response.message);
    }
  };

  const areAllPageProductsSelected = products.every((product) =>
    selectedProducts.includes(product._id)
  );

  const handleSelectAllOnPage = () => {
    if (areAllPageProductsSelected) {
      const updatedSelectedProducts = selectedProducts.filter(
        (id) => !products.some((product) => product._id === id)
      );
      setSelectedProducts(updatedSelectedProducts);
    } else {
      const updatedSelectedProducts = [
        ...selectedProducts,
        ...products
          .filter((product) => !selectedProducts.includes(product._id))
          .map((product) => product._id),
      ];
      setSelectedProducts(updatedSelectedProducts);
    }
  };

  const handleSelectProduct = (productId) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts((prev) => prev.filter((id) => id !== productId));
    } else {
      setSelectedProducts((prev) => [...prev, productId]);
    }
  };

  return (
    <div className="hidden md:block">
      {products.length === 0 ? (
        <div className="text-center p-5">
          <p className="text-gray-500 font-semibold">Không có sản phẩm</p>
        </div>
      ) : (
        <table className="w-full bg-white table-auto shadow-md rounded-lg">
          <thead className="rounded-t-lg">
            <tr className="bg-white">
              <th className="p-5 text-left rounded-tl-lg">
                <input
                  type="checkbox"
                  className="h-5 w-5"
                  checked={areAllPageProductsSelected}
                  onChange={handleSelectAllOnPage}
                />
              </th>
              <th className="p-5 text-left">Image</th>
              <th className="p-5 text-left w-[30%]">Product Name</th>
              <th className="p-5 text-left">Stock</th>
              <th className="p-5 text-left">Price</th>
              <th className="p-5 text-left">Category</th>
              <th className="p-5 text-left hidden lg:table-cell">Tags</th>
              <th className="p-5 text-left hidden lg:table-cell">Review</th>
              <th className="p-5 text-left">Date</th>
              <th className="p-5 text-left">Published</th>
              <th className="p-5 text-center rounded-tr-lg">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product._id}
                className={`hover:bg-gray-50 ${
                  selectedProducts.includes(product._id) ? "bg-blue-50" : ""
                }`}
              >
                <td className="p-5 border-b">
                  <input
                    type="checkbox"
                    className="h-5 w-5"
                    checked={selectedProducts.includes(product._id)}
                    onChange={() => handleSelectProduct(product._id)}
                  />
                </td>
                <td className="p-5 border-b">
                  <img
                    src={
                      product.product_thumb || "https://via.placeholder.com/50"
                    }
                    className="h-10 w-10 rounded"
                    alt={product.product_name}
                  />
                </td>
                <td className="p-5 border-b text-mainColor font-semibold w-[20%]">
                  {product.product_name}
                </td>
                <td
                  className={`p-5 border-b ${
                    product.product_quantity > 10
                      ? "text-green-500"
                      : product.product_quantity > 0
                      ? "text-yellow-500"
                      : "text-red-500"
                  }`}
                >
                  {product.product_stockStatus} ({product.product_quantity})
                </td>
                <td className="p-5 border-b">
                  {formatVND(product.product_price)}
                </td>
                <td className="p-5 border-b text-mainColor">
                  {product.product_category
                    .map((category) => category.category_name)
                    .join(", ")}
                </td>

                <td className="p-5 border-b text-mainColor hidden lg:table-cell">
                  {Array.isArray(product.product_tags)
                    ? product.product_tags.join(", ")
                    : "-"}
                </td>
                <td className="p-5 border-b hidden lg:table-cell">
                  {product.product_ratingAverage !== null &&
                  product.product_ratingAverage !== undefined
                    ? product.product_ratingAverage
                    : "-"}{" "}
                  &#9733;
                </td>

                <td className="p-5 border-b text-gray-700 font-semibold">
                  {formatDate(product.createdAt)}
                </td>
                <td className="p-5 border-b text-center font-semibold">
                  {product.isPublished ? (
                    <span className="text-green-500">Yes</span>
                  ) : (
                    <span className="text-red-500">No</span>
                  )}
                </td>
                <td className="p-5 border-b text-center">
                  <div className="flex justify-center items-center gap-x-2">
                    <AiOutlineEdit
                      className="text-blue-500 cursor-pointer hover:text-blue-700"
                      onClick={() => handleEditProduct(product._id)}
                    />
                    <AiOutlineDelete
                      onClick={() => handleOpenDeleteModal(product._id)}
                      className="text-red-500 cursor-pointer hover:text-red-700"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default ProductTable;
