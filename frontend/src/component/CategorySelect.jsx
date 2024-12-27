import { useState, useRef, useEffect } from "react";
import { MdArrowDropDown } from "react-icons/md";
import { IoPhonePortraitOutline } from "react-icons/io5";
import { RiMacbookLine } from "react-icons/ri";
import { CgAppleWatch } from "react-icons/cg";
import { TbDeviceIpad } from "react-icons/tb";
import { RiBattery2ChargeLine } from "react-icons/ri";
import { getAllCategory } from "../config/api";

const CategorySelect = ({ setFilterCategory }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Danh mục");
  const dropdownRef = useRef(null);

  const handleMouseEnter = () => {
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setDropdownOpen(false);
  };

  const handleMouseLeaveSubmenu = () => {
    setSelectedItem(null);
  };

  const getMenuHeight = () => {
    return categoryList.length * 40;
  };

  const iconMapping = {
    phone: <IoPhonePortraitOutline className="mr-2" />,
    mac: <RiMacbookLine className="mr-2" />,
    watch: <CgAppleWatch className="mr-2" />,
    ipad: <TbDeviceIpad className="mr-2" />,
    accessorie: <RiBattery2ChargeLine className="mr-2" />,
  };

  const getIconForCategory = (categoryName) => {
    for (const keyword in iconMapping) {
      if (categoryName.toLowerCase().includes(keyword)) {
        return iconMapping[keyword];
      }
    }
    return <RiBattery2ChargeLine className="mr-2" />;
  };

  useEffect(() => {
    getCategory();
  }, []);

  const getCategory = async () => {
    try {
      const response = await getAllCategory();
      console.log("🚀 ~ getCategory ~ response:", response)
      console.log(response.metadata);

      if (response.status === 200 && response.metadata) {
        const categories = response.metadata.map((category) => ({
          id: category._id,
          name: category.category_name,
          subItems: category.children || [],
        }));

        setCategoryList(categories);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh mục:", error);
    }
  };

  const handleCategoryClick = (item) => {
    console.log("🚀 ~ handleCategoryClick ~ item:", item)
    const isSubItem = !item.id;
    const categoryName = isSubItem ? item.category_name : item.name;
    const categoryId = isSubItem ? item._id : item.id;

    console.log("🚀 ~ handleCategoryClick ~ categoryName:", categoryName);
    console.log("🚀 ~ handleCategoryClick ~ categoryId:", categoryId);

    setSelectedCategory(categoryName); // Hiển thị tên danh mục đã chọn
    setFilterCategory(categoryId); // Trả về id cho filter
    setDropdownOpen(false); // Đóng dropdown
  };

  return (
    <div>
      <div
        className="relative py-1"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        ref={dropdownRef}
      >
        <button className="flex items-center text-sm text-gray-700 font-medium px-4 py-2 h-full bg-white border border-gray-300 rounded-md hover:border-gray-400 w-full">
          {selectedCategory}
          <MdArrowDropDown className="text-2xl" />
        </button>

        {dropdownOpen && (
          <div
            className="bg-white font-bold z-[45] list-none rounded-l-lg custom-shadow-left w-44 absolute right-0 mt-1 border-r-2 border-gray-300"
            style={{
              height: getMenuHeight(),
            }}
          >
            <ul className="py-1">
              {categoryList.map((category) => (
                <li
                  key={category.id}
                  onMouseEnter={() => setSelectedItem(category.id)}
                  className="relative"
                >
                  <button
                    onClick={() => handleCategoryClick(category)}
                    className="text-sm hover:bg-gray-100 text-gray-700 px-4 py-2 flex items-center w-full text-left"
                  >
                    {getIconForCategory(category.name)}
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>

            {selectedItem && (
              <div
                onMouseEnter={() => setSelectedItem(selectedItem)}
                onMouseLeave={handleMouseLeaveSubmenu}
                className="bg-white rounded-r-lg custom-shadow-right absolute top-0 left-full w-max border-l-2 border-gray-300"
                style={{
                  height: getMenuHeight(),
                  transform: selectedItem
                    ? "translateX(0)"
                    : "translateX(-20px)",
                  opacity: selectedItem ? 1 : 0,
                  transition: "transform 0.3s ease, opacity 0.3s ease",
                }}
              >
                <ul className="py-1 grid grid-cols-4 gap-2">
                  {categoryList
                    .find((category) => category.id === selectedItem)
                    ?.subItems?.map((subItem) => (
                      <li key={subItem._id}>
                        <button
                          onClick={() => handleCategoryClick(subItem)}
                          className="text-sm hover:bg-gray-100 text-gray-700 px-4 py-2 flex items-center w-full text-left"
                        >
                          {subItem.category_name}
                        </button>
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategorySelect;
