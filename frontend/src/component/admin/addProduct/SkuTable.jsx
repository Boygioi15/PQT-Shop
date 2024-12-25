import React from "react";
import { formatNumber, parseNumber } from "../../../utils/format";

const SkuTable = ({
  skuList,
  variationsList,
  onPriceChange,
  onStockChange,
}) => {
  console.log("🚀 ~ skuList:", skuList)
  return (
    <table className="table-auto w-full mt-6 border">
      <thead>
        <tr>
          {variationsList.map((_, index) => (
            <th key={index} className="border px-4 py-2">
              {variationsList[index]?.name || `Phân loại ${index + 1}`}
            </th>
          ))}
          <th className="border px-4 py-2">Giá</th>
          <th className="border px-4 py-2">Kho hàng</th>
        </tr>
      </thead>
      <tbody>
        {skuList.map((sku, skuIndexId) => (
          <tr key={skuIndexId}>
            {sku.sku_index.map((index, idx) => (
              <td key={idx} className="border px-4 py-2">
                {variationsList[idx].options[index]}
              </td>
            ))}
            <td className="border px-4 py-2">
              <input
                type="text"
                value={formatNumber(sku.sku_price || "")}
                onChange={(e) => {
                  const rawValue = parseNumber(e.target.value);
                  onPriceChange(skuIndexId, rawValue);
                }}
                className="w-full p-2 border rounded"
              />
            </td>
            <td className="border px-4 py-2">
              <input
                type="number"
                value={sku.sku_stock || ""}
                onChange={(e) => onStockChange(skuIndexId, e.target.value)}
                className="w-full p-2 border rounded"
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SkuTable;
