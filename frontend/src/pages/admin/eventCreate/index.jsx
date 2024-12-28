import React, { useEffect, useState } from "react";
import ProductSelectionModal from "../../../component/admin/flashSale/ProductSeletionModal";
import { formatVND } from "../../../utils/format";
import {
  creatNewFlashSale,
  EditFlashSale,
  getAdminAllProduct,
  getFlashSale,
  getProduct,
} from "../../../config/api";
import { FaTrash } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import EventInfo from "../../../component/admin/event/EventInfo";

const EventCreate = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productList, setProductList] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  console.log("🚀 ~ FlashSaleCreate ~ isEdit:", isEdit);
  const [bulkDiscount, setBulkDiscount] = useState("");
  const [bulkLimit, setBulkLimit] = useState("");
  const [bulkQuantityLimit, setBulkQuantityLimit] = useState("");
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [flashSaleData, setFlashSaleData] = useState({
    prom_name: "",
    prom_banner: "",
    appliedProduct: [],
    eventType: "Custom",
    startTime: "",
    endTime: "",
    status: "",
    disable: "",
  });
  const navigate = useNavigate();
  const [displayProducts, setDisplayProducts] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        // Lấy dữ liệu sự kiện
        const flashSale = await handleGetFlashSale();

        // Lấy danh sách SPUs từ flashSale
        const spuIds = flashSale?.appliedProduct.map(
          (product) => product.spuId
        );

        setSelectedProducts(spuIds);

        if (spuIds?.length > 0) {
          await handleGetAllSpu(spuIds);
        }

        setIsEdit(true);
      }
    };
    fetchData();
  }, [id]);

  const handleGetFlashSale = async () => {
    try {
      const response = await getFlashSale(id);
      const data = response.metadata || {};

      setFlashSaleData((prev) => ({
        ...prev,
        prom_name: data.prom_name || "",
        prom_banner: data.prom_banner || "",
        appliedProduct: data.appliedProduct || [],
        eventType: data.eventType || "sự kiện",
        startTime: data.startTime || "",
        endTime: data.endTime || "",
        status: data.status || "",
        disable: data.disable || "",
      }));

      return data;
    } catch (error) {
      console.error("Error fetching sự kiện data:", error);
    }
  };

  const handleGetAllSpu = async (spuIds) => {
    try {
      const spuPromises = await getAdminAllProduct(spuIds);
      const spuResponses = spuPromises.metadata;

      const formattedProducts = spuResponses.map((product) => {
        const flashSaleProduct = flashSaleData.appliedProduct.find(
          (p) => p.spuId === product.spu_info._id
        );

        return {
          spuId: product.spu_info._id,
          productName: product.spu_info.product_name,
          productThumb: product.spu_info.product_thumb,
          sku_list: product.sku_list.map((sku) => {
            const flashSaleSku = flashSaleProduct?.sku_list.find(
              (fsSku) => fsSku.skuId === sku._id
            );

            return {
              skuId: sku._id,
              skuName: sku.sku_name,
              skuPrice: sku.sku_price,
              skuStock: sku.sku_stock,
              discountValue: flashSaleSku?.discountValue || "",
              maxDiscountValue: flashSaleSku?.maxDiscountValue || "",
              quantityLimit: flashSaleSku?.quantityLimit || "",
            };
          }),
        };
      });

      // Kết hợp dữ liệu cũ và dữ liệu mới
      setDisplayProducts((prev) => [...prev, ...formattedProducts]);
    } catch (error) {
      console.error("Error fetching SPUs:", error);
    }
  };

  const handleEdit = async () => {
    try {
      const response = await EditFlashSale(flashSaleData, id);
      console.log("🚀 ~ handleEdit ~ response:", response);
      toast.success("Cập nhật sự kiện thành công");
    } catch {}
  };

  const validateTimeRange = (startTime, endTime) => {
    // Nếu không có thời gian bắt đầu hoặc kết thúc -> Mặc định là hợp lệ
    if (!startTime || !endTime) return true;

    // Chuyển đổi thời gian sang đối tượng Date
    const start = new Date(startTime);
    const end = new Date(endTime);

    // Kiểm tra thứ tự thời gian: Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc
    if (start >= end) {
      return false;
    }

    // Nếu vượt qua kiểm tra, thời gian là hợp lệ
    return true;
  };

  const handleGetSKU = async (selectedProducts) => {
    try {
      const existingSpuIds = new Set(
        displayProducts.map((product) => product.spuId)
      );
      const newProducts = selectedProducts.filter(
        (product) => !existingSpuIds.has(product)
      );

      if (newProducts.length === 0) {
        console.log("No new products to fetch.");
        return;
      }

      const response = await getAdminAllProduct(newProducts);

      const newDisplayData = response.metadata.map((value) => ({
        spuId: value.spu_info._id,
        productName: value.spu_info.product_name,
        productThumb: value.spu_info.product_thumb,
        sku_list: value.sku_list.map((skuItem) => ({
          skuId: skuItem._id,
          skuName: skuItem.sku_name,
          skuPrice: skuItem.sku_price,
          skuStock: skuItem.sku_stock,
          discountValue: "",
          maxDiscountValue: "",
          discountType: "PERCENTAGE",
        })),
      }));

      const newFlashSaleData = response.metadata.map((value) => ({
        spuId: value.spu_info._id,
        sku_list: value.sku_list.map((skuItem) => ({
          skuId: skuItem._id,
          discountValue: "",
          maxDiscountValue: "",
          discountType: "PERCENTAGE",
        })),
      }));

      // Kết hợp dữ liệu cũ và dữ liệu mới
      setDisplayProducts((prev) => [...prev, ...newDisplayData]);
      setFlashSaleData((prev) => ({
        ...prev,
        appliedProduct: [...prev.appliedProduct, ...newFlashSaleData],
      }));
    } catch (error) {
      console.error("Error fetching SKUs:", error);
    }
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleConfirmProducts = (products) => {
    setIsModalOpen(false);

    // Synchronize displayProducts with selectedProducts
    setDisplayProducts((prev) =>
      prev.filter((product) => products.includes(product.spuId))
    );

    // Synchronize flashSaleData with selectedProducts
    setFlashSaleData((prev) => ({
      ...prev,
      appliedProduct: prev.appliedProduct.filter((product) =>
        products.includes(product.spuId)
      ),
    }));

    // Fetch data for new products
    handleGetSKU(products);
  };

  const handleDeleteSKU = (spuId, skuId) => {
    setDisplayProducts((prev) =>
      prev
        .map((product) => {
          if (product.spuId === spuId) {
            return {
              ...product,
              sku_list: product.sku_list.filter((sku) => sku.skuId !== skuId),
            };
          }
          return product;
        })
        .filter((product) => product.sku_list.length > 0)
    );

    setFlashSaleData((prev) => ({
      ...prev,
      appliedProduct: prev.appliedProduct
        .map((product) => {
          if (product.spuId === spuId) {
            return {
              ...product,
              sku_list: product.sku_list.filter((sku) => sku.skuId !== skuId),
            };
          }
          return product;
        })
        .filter((product) => product.sku_list.length > 0),
    }));
  };
  const handleDeleteSPU = (spuId) => {
    // Remove SPU from displayProducts
    setDisplayProducts((prev) =>
      prev.filter((product) => product.spuId !== spuId)
    );

    // Remove SPU from flashSaleData
    setFlashSaleData((prev) => ({
      ...prev,
      appliedProduct: prev.appliedProduct.filter(
        (product) => product.spuId !== spuId
      ),
    }));

    // Remove SPU from selectedProducts
    setSelectedProducts((prev) => prev.filter((product) => product !== spuId));
  };

  const handleBulkUpdate = () => {
    setDisplayProducts((prev) =>
      prev.map((product) => ({
        ...product,
        sku_list: product.sku_list.map((sku) => ({
          ...sku,
          discountValue: bulkDiscount || sku.discountValue,
          maxDiscountValue: bulkLimit || sku.maxDiscountValue,
          quantityLimit: bulkQuantityLimit || sku.quantityLimit,
        })),
      }))
    );

    setFlashSaleData((prev) => ({
      ...prev,
      appliedProduct: prev.appliedProduct.map((product) => ({
        ...product,
        sku_list: product.sku_list.map((sku) => ({
          ...sku,
          discountValue: bulkDiscount || sku.discountValue,
          maxDiscountValue: bulkLimit || sku.maxDiscountValue,
          quantityLimit: bulkQuantityLimit || sku.quantityLimit,
        })),
      })),
    }));
  };

  const handleUpdateDiscountValue = (spuId, skuId, updatedValue) => {
    setDisplayProducts((prev) =>
      prev.map((product) => {
        if (product.spuId === spuId) {
          return {
            ...product,
            sku_list: product.sku_list.map((item) => {
              if (item.skuId === skuId) {
                const maxDiscountAmount = item.maxDiscountValue || 0; // Số tiền giảm tối đa
                const price = item.skuPrice; // Giá gốc
                const maxDiscountPercent = (maxDiscountAmount / price) * 100; // % giảm tối đa
                const newDiscountValue =
                  updatedValue > maxDiscountPercent
                    ? maxDiscountPercent
                    : updatedValue; // Điều chỉnh % giảm về mức tối đa nếu vượt giới hạn
                return { ...item, discountValue: newDiscountValue };
              }
              return item;
            }),
          };
        }
        return product;
      })
    );

    setFlashSaleData((prev) => ({
      ...prev,
      appliedProduct: prev.appliedProduct.map((product) => {
        if (product.spuId === spuId) {
          return {
            ...product,
            sku_list: product.sku_list.map((item) => {
              if (item.skuId === skuId) {
                const maxDiscountAmount = item.maxDiscountValue || 0;
                const price = item.skuPrice;
                const maxDiscountPercent = (maxDiscountAmount / price) * 100;
                const newDiscountValue =
                  updatedValue > maxDiscountPercent
                    ? maxDiscountPercent
                    : updatedValue;
                return { ...item, discountValue: newDiscountValue };
              }
              return item;
            }),
          };
        }
        return product;
      }),
    }));
  };

  const handleUpdateMaxDiscountValue = (spuId, skuId, updatedValue) => {
    setDisplayProducts((prev) =>
      prev.map((product) => {
        if (product.spuId === spuId) {
          return {
            ...product,
            sku_list: product.sku_list.map((item) =>
              item.skuId === skuId
                ? { ...item, maxDiscountValue: updatedValue }
                : item
            ),
          };
        }
        return product;
      })
    );

    setFlashSaleData((prev) => ({
      ...prev,
      appliedProduct: prev.appliedProduct.map((product) => {
        if (product.spuId === spuId) {
          return {
            ...product,
            sku_list: product.sku_list.map((item) =>
              item.skuId === skuId
                ? { ...item, maxDiscountValue: updatedValue }
                : item
            ),
          };
        }
        return product;
      }),
    }));
  };
  const handleUpdateQuantityLimit = (spuId, skuId, updatedValue) => {
    setDisplayProducts((prev) =>
      prev.map((product) => {
        if (product.spuId === spuId) {
          return {
            ...product,
            sku_list: product.sku_list.map((sku) =>
              sku.skuId === skuId
                ? { ...sku, quantityLimit: updatedValue }
                : sku
            ),
          };
        }
        return product;
      })
    );

    setFlashSaleData((prev) => ({
      ...prev,
      appliedProduct: prev.appliedProduct.map((product) => {
        if (product.spuId === spuId) {
          return {
            ...product,
            sku_list: product.sku_list.map((sku) =>
              sku.skuId === skuId
                ? { ...sku, quantityLimit: updatedValue }
                : sku
            ),
          };
        }
        return product;
      }),
    }));
  };
  const handleConfirmDialog = () => {
    setIsConfirmDialogOpen(true);
  };

  const handleCancelDialog = () => {
    setIsCancelDialogOpen(true);
  };
  const handleConfirmAction = async () => {
    // Đóng dialog xác nhận
    setIsConfirmDialogOpen(false);

    // Validate thời gian
    const { startTime, endTime } = flashSaleData || {};
    if (!startTime || !endTime || !validateTimeRange(startTime, endTime)) {
      alert("Ngày không hợp lệ! Vui lòng kiểm tra lại khung thời gian.");
      return;
    }

    if (!isEdit) {
      try {
        // Gọi API tạo sự kiện
        const response = await creatNewFlashSale(flashSaleData);
        if (response.status === 200) {
          toast.success("Tạo sự kiện thành công");
        } else {
          toast.error("Lỗi khi tạo");
        }
        navigate("/admin/event"); // Quay về trang danh sách Flash Sale
      } catch (error) {}
    } else {
      handleEdit();
      toast.success("Cập nhật Flash Sale thành công");
      navigate("/admin/event"); // Quay về trang danh sách Flash Sale sau khi cập nhật
    }
  };

  const handleCancelAction = () => {
    setIsCancelDialogOpen(false);
    navigate("/admin/event");
  };
  const isAddProductEnabled =
    !!flashSaleData.startTime && !!flashSaleData.endTime;
  return (
    <div className="flex flex-col w-full p-10 bg-gray-100 min-h-screen">
      {/* Sử dụng component FlashSaleInfo */}
      <EventInfo
        flashSaleData={flashSaleData}
        setFlashSaleData={setFlashSaleData}
      />

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-bold mb-4">
          Sản phẩm tham gia sự kiện của Shop
        </h2>
        <div className="flex justify-end items-center mb-4">
          <div className="flex gap-4">
            <input
              type="number"
              placeholder="Khuyến mãi (%)"
              className="border border-gray-300 rounded-md px-2 py-1 text-sm"
              onChange={(e) => setBulkDiscount(e.target.value)}
            />
            <input
              type="number"
              placeholder="Giới hạn giảm giá"
              className="border border-gray-300 rounded-md px-2 py-1 text-sm"
              onChange={(e) => setBulkLimit(e.target.value)}
            />
            <input
              type="number"
              placeholder="Giới hạn số lượng"
              className="border border-gray-300 rounded-md px-2 py-1 text-sm"
              onChange={(e) => setBulkQuantityLimit(e.target.value)}
            />
            <button
              className="bg-mainColor hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
              onClick={handleBulkUpdate}
            >
              Áp dụng tất cả
            </button>
          </div>
        </div>
        <div>
          {displayProducts.map((product) => {
            // Tìm thông tin sản phẩm tương ứng trong flashSaleData
            const flashSaleProduct = flashSaleData.appliedProduct.find(
              (fsProduct) => fsProduct.spuId === product.spuId
            );

            // Nếu sản phẩm không tồn tại trong flashSaleData, bỏ qua sản phẩm này
            if (!flashSaleProduct) return null;

            return (
              <div key={product.spuId} className="mb-8">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={product.productThumb}
                      alt={product.productName}
                      className="w-12 h-12 rounded-md object-cover shadow-md"
                    />
                    <span className="font-semibold text-lg text-gray-900 tracking-wide leading-6 hover:text-mainColor transition-all duration-200">
                      {product.productName}
                    </span>
                  </div>
                  <button
                    className="text-red-500 hover:text-red-700 flex items-center gap-1 p-2 bg-gray-50 hover:bg-red-50 rounded-md shadow-sm transition-all duration-200"
                    onClick={() => handleDeleteSPU(product.spuId)}
                  >
                    <FaTrash />
                  </button>
                </div>
                <table className="w-full border border-gray-300 rounded-md">
                  <thead>
                    <tr className="bg-gray-100 text-sm text-center">
                      <th className="px-4 py-3 border-b">Phân loại hàng</th>
                      <th className="px-4 py-3 border-b">Giá gốc</th>
                      <th className="px-4 py-3 border-b">Số lượng trong kho</th>
                      <th className="px-4 py-3 border-b">Khuyến mãi (%)</th>
                      <th className="px-4 py-3 border-b">Giá sau khi giảm</th>
                      <th className="px-4 py-3 border-b">Giới hạn giảm giá</th>
                      <th className="px-4 py-3 border-b">Giới hạn số lượng</th>
                      <th className="px-4 py-3 border-b">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Lọc chỉ những SKU có trong flashSaleProduct */}
                    {flashSaleProduct.sku_list.map((flashSaleSku) => {
                      // Tìm thông tin SKU tương ứng trong displayProducts
                      const displaySku = product.sku_list.find(
                        (sku) => sku.skuId === flashSaleSku.skuId
                      );

                      // Nếu SKU không tồn tại trong displayProducts, bỏ qua SKU này
                      if (!displaySku) return null;

                      return (
                        <tr
                          key={flashSaleSku.skuId}
                          className="text-sm text-center"
                        >
                          <td className="px-4 py-3 border-b">
                            {displaySku.skuName}
                          </td>
                          <td className="px-4 py-3 border-b">
                            {formatVND(displaySku.skuPrice)}
                          </td>
                          <td className="px-4 py-3 border-b">
                            {displaySku.skuStock || "-"}
                          </td>
                          <td className="px-4 py-3 border-b">
                            <input
                              type="number"
                              value={flashSaleSku?.discountValue || ""}
                              className="w-20 border border-gray-300 rounded-md px-2 py-1 text-sm text-center"
                              onChange={(e) =>
                                handleUpdateDiscountValue(
                                  product.spuId,
                                  flashSaleSku.skuId,
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td className="px-4 py-3 border-b">
                            {flashSaleSku?.discountValue
                              ? formatVND(
                                  displaySku.skuPrice *
                                    (1 - flashSaleSku.discountValue / 100)
                                )
                              : formatVND(displaySku.skuPrice)}
                          </td>
                          <td className="px-4 py-3 border-b">
                            <input
                              type="number"
                              value={flashSaleSku?.maxDiscountValue || ""}
                              className="w-20 border border-gray-300 rounded-md px-2 py-1 text-sm text-center"
                              onChange={(e) =>
                                handleUpdateMaxDiscountValue(
                                  product.spuId,
                                  flashSaleSku.skuId,
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td className="px-4 py-3 border-b">
                            <input
                              type="number"
                              value={flashSaleSku?.quantityLimit || ""}
                              className="w-20 border border-gray-300 rounded-md px-2 py-1 text-sm text-center"
                              onChange={(e) =>
                                handleUpdateQuantityLimit(
                                  product.spuId,
                                  flashSaleSku.skuId,
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td className="px-4 py-3 border-b text-center">
                            <button
                              className="text-red-500 hover:text-red-700"
                              onClick={() =>
                                handleDeleteSKU(
                                  product.spuId,
                                  flashSaleSku.skuId
                                )
                              }
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>

        <button
          onClick={handleModalOpen}
          className={`w-full py-2 rounded-md text-center font-medium ${
            isAddProductEnabled
              ? "border border-mainColor text-mainColor hover:bg-blue-50"
              : "border border-gray-300 text-gray-400 cursor-not-allowed"
          }`}
          disabled={!isAddProductEnabled}
        >
          + Thêm sản phẩm
        </button>
      </div>
      <div className="flex flex-row justify-end gap-6 mt-5">
        {/* Nút xác nhận */}
        <button
          onClick={handleConfirmDialog}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md font-bold text-lg"
        >
          Xác nhận
        </button>
        {/* Nút hủy */}
        <button
          onClick={handleCancelDialog}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md font-bold text-lg"
        >
          Hủy
        </button>
      </div>

      {/* Dialog xác nhận */}
      {isConfirmDialogOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-md p-6 w-96">
            <h3 className="text-lg font-bold mb-4">Xác nhận sự kiện?</h3>
            <p>Bạn có chắc chắn muốn xác nhận thông tin này không?</p>
            <div className="flex justify-end gap-4 mt-4">
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
                onClick={handleConfirmAction}
              >
                OK
              </button>
              <button
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-md"
                onClick={() => setIsConfirmDialogOpen(false)}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dialog hủy */}
      {isCancelDialogOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-md p-6 w-96">
            <h3 className="text-lg font-bold mb-4">Hủy sự kiện?</h3>
            <p>Bạn có chắc chắn muốn hủy và quay về không?</p>
            <div className="flex justify-end gap-4 mt-4">
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                onClick={handleCancelAction}
              >
                OK
              </button>
              <button
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-md"
                onClick={() => setIsCancelDialogOpen(false)}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
      <ProductSelectionModal
        flashSaleData={flashSaleData}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onConfirm={handleConfirmProducts}
        productList={productList}
        setProductList={setProductList}
        selectedProducts={selectedProducts}
        setSelectedProducts={setSelectedProducts}
      />
    </div>
  );
};

export default EventCreate;
