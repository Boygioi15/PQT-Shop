import React, { useEffect, useState } from "react";
import { BiPlus } from "react-icons/bi";
import {
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineDown,
  AiOutlineLeft,
  AiOutlineRight,
} from "react-icons/ai";
import {
  getAllProduct,
  getPublishedProduct,
  getDraftProduct,
  publishProcduct,
  unPublishProcduct,
  deleteProduct,
} from "../../../config/api";
import ProductFilter from "../../../component/admin/stockProduct/ProductFilter";
import ProductTable from "../../../component/admin/stockProduct/ProductTable";
import { formatVND } from "../../../utils/format";
import Loading from "../../../component/Loading";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { formatDate } from "../../../utils";

const ITEMS_PER_PAGE = 8;

const StockPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    stockStatus: "",
    category: "",
    seller: "",
    productType: "",
  });
  const [activeTab, setActiveTab] = useState("all");
  const [activeCollapse, setActiveCollapse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [allCount, setAllCount] = useState(0);
  const [publishedCount, setPublishedCount] = useState(0);
  const [draftCount, setDraftCount] = useState(0);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteProductIds, setDeleteProductIds] = useState([]); // Sản phẩm sẽ được xóa

  useEffect(() => {
    fetchTabCounts();
    fetchTabData();
  }, [activeTab]);

  useEffect(() => {
    handleFilterProducts();
  }, [filters, products]);

  const fetchTabCounts = async () => {
    setIsLoading(true);
    try {
      const allResponse = await getAllProduct();
      setAllCount(allResponse?.metadata?.length || 0);

      const publishedResponse = await getPublishedProduct();
      setPublishedCount(publishedResponse?.metadata?.length || 0);

      const draftResponse = await getDraftProduct();
      setDraftCount(draftResponse?.metadata?.length || 0);
    } catch (error) {
      console.error("Error fetching counts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTabData = async () => {
    setIsLoading(true);
    try {
      let response;
      if (activeTab === "all") response = await getAllProduct();
      if (activeTab === "published") response = await getPublishedProduct();
      if (activeTab === "draft") response = await getDraftProduct();

      if (response && response.metadata) {
        setProducts(response.metadata);
        setFilteredProducts(response.metadata);
        setCurrentPage(1);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublishSelected = async () => {
    if (selectedProducts.length === 0) {
      toast.error("Please select at least one product to publish.");
      return;
    }

    // Kiểm tra trạng thái của sản phẩm trước khi publish
    const productsToPublish = products.filter(
      (product) =>
        selectedProducts.includes(product._id) && !product.isPublished
    );

    if (productsToPublish.length === 0) {
      toast.error("All selected products are already published.");
      return;
    }

    try {
      setIsLoading(true);
      await Promise.all(
        productsToPublish.map(async (id) => await ublishProcduct(id))
      );
      toast.success("Selected products published successfully!");
      await fetchTabData(); // Ensure data is refreshed
      await fetchTabCounts(); // Ensure counts are updated
      setSelectedProducts([]);
    } catch (error) {
      toast.error("Error publishing products. Please try again.");
      console.error("Error publishing products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnpublishSelected = async () => {
    if (selectedProducts.length === 0) {
      toast.error("Please select at least one product to unpublish.");
      return;
    }

    // Kiểm tra trạng thái của sản phẩm trước khi unpublish
    const productsToUnpublish = products.filter(
      (product) => selectedProducts.includes(product._id) && product.isPublished
    );

    if (productsToUnpublish.length === 0) {
      toast.error("All selected products are already unpublished.");
      return;
    }

    try {
      setIsLoading(true);
      await Promise.all(
        productsToUnpublish.map(async (id) => await unPublishProcduct(id))
      );
      toast.success("Selected products unpublished successfully!");
      await fetchTabData(); // Ensure data is refreshed
      await fetchTabCounts(); // Ensure counts are updated
      setSelectedProducts([]);
    } catch (error) {
      toast.error("Error unpublishing products. Please try again.");
      console.error("Error unpublishing products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Show confirmation modal for deletion
  const handleDeleteSelected = () => {
    if (selectedProducts.length === 0) {
      toast.error("Please select at least one product to delete.");
      return;
    }

    setDeleteProductIds(selectedProducts); // Store selected product ids to delete
    setIsDeleteModalOpen(true); // Open delete modal
  };

  // Confirm delete action
  const confirmDelete = async () => {
    try {
      setIsLoading(true);
      await Promise.all(deleteProductIds.map((id) => deleteProduct(id))); // Call API to delete products
      toast.success("Selected products deleted successfully!");
      await fetchTabData(); // Refresh data
      await fetchTabCounts(); // Update counts
      setSelectedProducts([]); // Clear selected products
    } catch (error) {
      toast.error("Error deleting products. Please try again.");
      console.error("Error deleting products:", error);
    } finally {
      setIsLoading(false);
      setIsDeleteModalOpen(false); // Close the delete modal
    }
  };

  const handleFilterProducts = () => {
    let filtered = [...products];
    if (filters.stockStatus) {
      filtered = filtered.filter(
        (product) => product.product_stockStatus === filters.stockStatus
      );
    }
    if (filters.category) {
      filtered = filtered.filter(
        (product) => product.category === filters.category
      );
    }
    if (filters.seller) {
      filtered = filtered.filter(
        (product) => product.seller === filters.seller
      );
    }
    if (filters.productType) {
      filtered = filtered.filter(
        (product) => product.product_type === filters.productType
      );
    }
    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const handleSelectProduct = (productId) => {
    let updatedSelection = [...selectedProducts];
    if (selectedProducts.includes(productId)) {
      updatedSelection = updatedSelection.filter((id) => id !== productId);
    } else {
      updatedSelection.push(productId);
    }
    setSelectedProducts(updatedSelection);
  };

  const handleSelectAll = () => {
    const isAllSelected = paginatedProducts().every((product) =>
      selectedProducts.includes(product._id)
    );
    let updatedSelection = [...selectedProducts];
    if (isAllSelected) {
      updatedSelection = updatedSelection.filter(
        (id) => !paginatedProducts().some((product) => product._id === id)
      );
    } else {
      paginatedProducts().forEach((product) => {
        if (!updatedSelection.includes(product._id)) {
          updatedSelection.push(product._id);
        }
      });
    }
    setSelectedProducts(updatedSelection);
  };

  const paginatedProducts = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const toggleCollapse = (id) => {
    setActiveCollapse((prev) => (prev === id ? null : id));
  };

  const navigate = useNavigate();

  const handleEditProduct = (id) => {
    navigate(`/admin/products/edit/${id}`);
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
  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <div className="flex justify-between bg-white px-6 py-8 rounded-lg items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-700">Product Management</h1>
        <div className="flex gap-4">
          {/* Create Category Button */}
          <Link
            to="/admin/category-create"
            className="flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 shadow-md"
          >
            <BiPlus className="mr-2 text-xl" /> Create Category
          </Link>

          {/* Add Product Button */}
          <Link
            to="/admin/products/add"
            className="flex items-center bg-mainColor text-white px-4 py-2 rounded hover:bg-blue-700 shadow-md"
          >
            <BiPlus className="mr-2 text-xl" /> Add Product
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <Loading />
        </div>
      ) : (
        <>
          {/* Tabs */}
          <div className="flex gap-4 mb-4 border-b pb-2">
            {[
              { label: "All", value: "all", count: allCount },
              { label: "Published", value: "published", count: publishedCount },
              { label: "Draft", value: "draft", count: draftCount },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`font-semibold px-4 py-2 rounded-t ${
                  activeTab === tab.value
                    ? "text-blue-500 border-b-2 border-blue-500"
                    : "text-gray-500 hover:text-blue-500"
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="mb-4 flex justify-between items-center">
            <div className="flex gap-4">
              <ProductFilter filters={filters} setFilters={setFilters} />
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleUnpublishSelected}
                className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 shadow-md"
              >
                Unpublish
              </button>
              <button
                onClick={handlePublishSelected}
                className="flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 shadow-md"
              >
                Publish
              </button>
              <button
                onClick={handleDeleteSelected}
                className="flex items-center bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 shadow-md"
              >
                Delete
              </button>
            </div>
          </div>

          {/* Product Table */}
          <div className="hidden md:block">
            <ProductTable
              products={paginatedProducts()}
              selectedProducts={selectedProducts}
              setSelectedProducts={setSelectedProducts}
              handleEditProduct={handleEditProduct}
            />
          </div>

          {/* Collapse View for Small Screens */}
          <div className="md:hidden">
            <div className="flex items-center justify-between p-4 bg-white shadow-md mb-4 rounded-lg">
              <input
                type="checkbox"
                checked={paginatedProducts().every((product) =>
                  selectedProducts.includes(product._id)
                )}
                onChange={handleSelectAll}
              />
              <label>Select All</label>
            </div>
            {paginatedProducts().map((product) => (
              <div
                key={product._id}
                className="bg-white shadow rounded-lg mb-4 p-4"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product._id)}
                      onChange={() => handleSelectProduct(product._id)}
                    />
                    <img
                      src={
                        product.product_thumb ||
                        "https://via.placeholder.com/50"
                      }
                      className="h-12 w-12 rounded"
                      alt={product.product_name}
                    />
                    <div>
                      <p className="font-semibold text-gray-700">
                        {product.product_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatVND(product.product_price)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <AiOutlineEdit
                      onClick={() => handleEditProduct(product._id)}
                      className="text-blue-500 cursor-pointer"
                    />
                    <AiOutlineDelete className="text-red-500 cursor-pointer" />
                    <AiOutlineDown
                      className={`text-gray-500 ${
                        activeCollapse === product._id ? "rotate-180" : ""
                      } transition-transform cursor-pointer`}
                      onClick={() => toggleCollapse(product._id)}
                    />
                  </div>
                </div>

                {/* Collapse content */}
                {activeCollapse === product._id && (
                  <div className="mt-4 bg-gray-50 p-4 rounded-lg shadow-inner">
                    <p>Stock: {product.product_quantity}</p>
                    <p>Price: {formatVND(product.product_price)}</p>
                    <p>
                      Category:{" "}
                      {product.product_category
                        .map((c) => c.category_name)
                        .join(", ")}
                    </p>
                    <p>Tags: {product.product_tags.join(", ")}</p>
                    <p>Review: {product.product_ratingAverage} &#9733;</p>
                    <p>Date Created: {formatDate(product.createdAt)}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Pagination */}
      <ul className="flex space-x-5 justify-center mt-6">
        {/* Previous Button */}
        <li
          className={`flex items-center justify-center bg-gray-100 w-9 h-9 rounded-md cursor-pointer ${
            currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
        >
          <AiOutlineLeft className="text-gray-500" />
        </li>

        {/* Page Numbers */}
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (page) => (
            <li
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`flex items-center justify-center w-9 h-9 rounded-md cursor-pointer ${
                currentPage === page
                  ? "bg-blue-500 text-white"
                  : "text-gray-800 hover:bg-gray-200"
              }`}
            >
              {page}
            </li>
          )
        )}

        {/* Next Button */}
        <li
          className={`flex items-center justify-center bg-gray-100 w-9 h-9 rounded-md cursor-pointer ${
            currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() =>
            currentPage < totalPages && setCurrentPage(currentPage + 1)
          }
        >
          <AiOutlineRight className="text-gray-500" />
        </li>
      </ul>
      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default StockPage;
