import { useParams } from "react-router-dom";
import { getStatisticPromotion } from "../../../config/api";
import { useEffect, useState } from "react";
import { formatVND } from "../../../utils";
import { BarChart2, DollarSign, Package, ShoppingCart } from "lucide-react";

const StatictisPage = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [overview, setOverview] = useState({
    totalRevenue: 0,
    totalSoldQuantity: 0,
    totalProducts: 0,
    averageOrderValue: 0,
  });
  const [loading, setLoading] = useState(true); // Thêm trạng thái loading

  const handleFetchData = async () => {
    setLoading(true); // Bắt đầu tải
    try {
      const response = await getStatisticPromotion(id);
      if (response.status === 200) {
        setProducts(response.metadata.productDetails);

        // Tính toán tổng quan
        const totalRevenue = response.metadata.productDetails.reduce(
          (acc, product) => {
            return (
              acc +
              product.skus.reduce(
                (skuAcc, sku) =>
                  skuAcc + sku.appliedQuantity * sku.discountedPrice,
                0
              )
            );
          },
          0
        );

        const totalSoldQuantity = response.metadata.productDetails.reduce(
          (acc, product) => {
            return (
              acc +
              product.skus.reduce(
                (skuAcc, sku) => skuAcc + sku.appliedQuantity,
                0
              )
            );
          },
          0
        );

        const totalProducts = response.metadata.productDetails.length;

        setOverview({
          totalRevenue,
          totalSoldQuantity,
          totalProducts,
          averageOrderValue: totalSoldQuantity
            ? totalRevenue / totalSoldQuantity
            : 0,
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Dừng tải
    }
  };

  useEffect(() => {
    handleFetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-xl font-semibold text-gray-500">
          Đang tải dữ liệu...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Overview Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Tổng doanh thu
              </p>
              <h3 className="text-xl font-semibold text-gray-900">
                {formatVND(overview.totalRevenue)}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Tổng số lượng bán
              </p>
              <h3 className="text-xl font-semibold text-gray-900">
                {overview.totalSoldQuantity}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Tổng sản phẩm</p>
              <h3 className="text-xl font-semibold text-gray-900">
                {overview.totalProducts}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <BarChart2 className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Giá trị trung bình
              </p>
              <h3 className="text-xl font-semibold text-gray-900">
                {formatVND(overview.averageOrderValue)}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Product Tables */}
      {products.map((product, index) => (
        <div key={index} className="mb-8">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <img
                src={product.spuThumb}
                alt={product.spuName}
                className="w-12 h-12 rounded-md object-cover shadow-md"
              />
              <span className="font-semibold text-lg text-gray-900 tracking-wide leading-6 hover:text-mainColor transition-all duration-200">
                {product.spuName}
              </span>
            </div>
          </div>
          <table className="w-full border border-gray-300 rounded-md">
            <thead>
              <tr className="bg-gray-100 text-sm text-center">
                <th className="px-4 py-3 border-b">Phân loại hàng</th>
                <th className="px-4 py-3 border-b">Giá gốc</th>
                <th className="px-4 py-3 border-b">Số lượng khuyến mãi</th>
                <th className="px-4 py-3 border-b">Giá khuyến mãi</th>
                <th className="px-4 py-3 border-b">Số lượng đã bán</th>
                <th className="px-4 py-3 border-b">Doanh số</th>
              </tr>
            </thead>
            <tbody>
              {product.skus.map((sku) => (
                <tr
                  key={sku.skuId}
                  className="text-sm text-center hover:bg-gray-50"
                >
                  <td className="px-4 py-3 border-b">{sku.skuName}</td>
                  <td className="px-4 py-3 border-b">{formatVND(sku.price)}</td>
                  <td className="px-4 py-3 border-b">
                    {sku.quantityLimit || "-"}
                  </td>
                  <td className="px-4 py-3 border-b">
                    {formatVND(sku.discountedPrice) || "-"}
                  </td>
                  <td className="px-4 py-3 border-b">{sku.appliedQuantity}</td>
                  <td className="px-4 py-3 border-b">
                    {formatVND(sku.appliedQuantity * sku.discountedPrice)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default StatictisPage;
