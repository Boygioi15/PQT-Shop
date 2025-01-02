import React from "react";
import { AiOutlineDown } from "react-icons/ai";
import { TiArrowSortedDown } from "react-icons/ti";
import CategorySelect from "../addProduct/CategorySelect";
import CategorySelectForFilter from "./CategorySelectForFilter";

const ProductFilter = ({
  filters,
  setFilters,
  selectedCategoryName,
  setSelectedCategoryName,
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 mb-6">
      <div className="relative">
        <select
          value={filters.stockStatus}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, stockStatus: e.target.value }))
          }
          className="flex items-center text-sm text-gray-700 font-medium px-4 py-2 h-full bg-white border border-gray-300 rounded-md hover:border-gray-400 w-full"
        >
          <option value="">All status</option>
          <option value="IN_STOCK">In Stock</option>
          <option value="LOW_INVENTORY">Low Stock</option>
          <option value="OUT_OF_STOCK">Out of Stock</option>
        </select>
      </div>

      <div className="relative">
        <CategorySelectForFilter
          filters={filters}
          setFilters={setFilters}
          selectedCategoryName={selectedCategoryName}
          setSelectedCategoryName={setSelectedCategoryName}
        />
      </div>
    </div>
  );
};

export default ProductFilter;
