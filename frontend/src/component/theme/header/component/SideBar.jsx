import { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import { AiOutlineHeart } from "react-icons/ai";
import { IoCartOutline } from "react-icons/io5";
import { AiOutlineUser } from "react-icons/ai";
import "../../../../style/sideBar.css";
import { getAllCategory } from "../../../../config/api";
import ProfileNavBar from "../../../ProfileNav";
import { useSelector } from "react-redux";

const SideBar = ({ isOpen, setIsOpen }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [categoryList, setCategoryList] = useState([]);
  const userName = useSelector((state) => state.account.user.name);
  const userAvatar = useSelector((state) => state.account.user.avatar);
  const handleItemClick = (category) => {
    setSelectedItem(category); // Set the entire category object
  };

  useEffect(() => {
    getCategory();
  }, []);

  const getCategory = async () => {
    try {
      const response = await getAllCategory();
      if (response.status === 200 && response.metadata) {
        const categories = response.metadata.map((category) => ({
          id: category._id,
          name: category.category_name,
          link: `/${category.category_slug}`,
          subItems: category.children || [],
        }));
        setCategoryList(categories);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh mục:", error);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`overlay ${isOpen ? "overlay-visible" : "overlay-hidden"}`}
        onClick={() => {
          setIsOpen(false);
          setSelectedItem(null);
        }}
      />

      {/* Main Sidebar */}
      <div
        className={`sidebar w-[300px] ${
          isOpen ? "sidebar-open" : "sidebar-close"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sidebar-header">
          <IoCloseOutline
            onClick={() => {
              setIsOpen(false);
              setSelectedItem(null);
            }}
            className="close-icon"
          />
        </div>

        <div className="p-8">
          <div className="flex flex-col gap-8 mt-8">
            {categoryList.map((category) => (
              <div
                key={category.id}
                onClick={() => handleItemClick(category)}
                className="flex items-center justify-between font-bold cursor-pointer hover:bg-gray-200 p-2 rounded transition-colors duration-300"
              >
                <span>{category.name}</span>
                <FaAngleRight className="text-gray-500" />
              </div>
            ))}
          </div>

          {/* Additional Actions */}
          <div className="grid grid-cols-3 gap-4 mt-4 border-t">
            <a
              href="/favorites"
              className="flex items-center justify-center gap-2 font-bold hover:bg-gray-200 p-2 rounded transition-colors duration-300"
            >
              <AiOutlineHeart className="text-2xl" />
            </a>
            <a
              href="/cart"
              className="flex items-center justify-center gap-2 font-bold hover:bg-gray-200 p-2 rounded transition-colors duration-300"
            >
              <IoCartOutline className="text-2xl" />
            </a>

            <ProfileNavBar userAvatar={userAvatar} userName={userName} />
          </div>
          <div className="flex items-center justify-center px-20 gap-10 mt-4">
            <a
              className="font-bold transition-colors duration-300 hover:text-blue-500"
              href="/"
            >
              About
            </a>
            <a
              className="font-bold transition-colors duration-300 hover:text-blue-500"
              href="/login"
            >
              Contact
            </a>
          </div>
        </div>
      </div>

      {/* Subcategory Sidebar */}
      <div
        className={`sidebar w-[300px] ${
          selectedItem ? "sidebar-open" : "sidebar-close"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sidebar-header">
          <FaAngleLeft
            onClick={() => setSelectedItem(null)}
            className="close-icon"
          />
        </div>
        {selectedItem && (
          <div className="p-8">
            <h2 className="sidebar-title">{selectedItem.name}</h2>
            <div className="flex flex-col gap-4">
              {selectedItem.subItems.length > 0 ? (
                selectedItem.subItems.map((subItem, subIndex) => (
                  <a
                    key={subItem._id}
                    href={`/${subItem.category_slug}`} // Adjust based on your API response
                    className="text-gray-700 hover:text-blue-500 transition-colors duration-300"
                  >
                    {subItem.category_name}
                  </a>
                ))
              ) : (
                <p className="text-gray-500 text-sm">Không có danh mục con</p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SideBar;
