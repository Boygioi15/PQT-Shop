import { useState } from "react";
import { FaTachometerAlt, FaBox, FaMoneyBillWave } from "react-icons/fa";
import { AiOutlineOrderedList, AiOutlineDown } from "react-icons/ai"; // Import biểu tượng mũi tên từ react-icons
import { Link } from "react-router-dom"; // Import useRouteMatch từ React Router

const Sidebar = () => {
  // State để theo dõi mục nào đang được chọn
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [openProduct, setOpenProduct] = useState(false); // State để mở/đóng dropdown "Product"

  // Danh sách các mục trong sidebar
  const items = [
    { icon: FaTachometerAlt, text: "Dashboard", path: "/admin/dashboard" },
    {
      icon: FaBox,
      text: "Product",
      path: "/admin/products",
      hasDropdown: true,
      subItems: [
        { text: "iPhone", path: "/admin/products/iphone" },
        { text: "iPad", path: "/admin/products/ipad" },
        { text: "MacBook", path: "/admin/products/macbook" },
        { text: "Apple Watch", path: "/admin/products/applewatch" },
        { text: "Headphones", path: "/admin/products/headphones" },
        { text: "Accessories", path: "/admin/products/accessories" },
      ],
    },
    { icon: AiOutlineOrderedList, text: "Order List", path: "/admin/order" },
    { icon: FaMoneyBillWave, text: "Product Stock", path: "/admin/stock" },
  ];

  return (
    <div className="bg-white shadow-xl h-screen top-0 left-0 min-w-[250px] py-6 overflow-auto">
      <div className="relative flex flex-col h-full">
        <a
          href="/admin/dashboard"
          className="font-bold text-3xl text-black text-center"
        >
          AppleHouse
        </a>

        <ul className="space-y-3 my-8 flex-1">
          {items.map((item) => (
            <li key={item.text}>
              {item.hasDropdown ? (
                // Nếu mục có dropdown
                <div>
                  <button
                    onClick={() => setOpenProduct(!openProduct)} // Toggle dropdown
                    className={`text-sm flex items-center px-8 py-4 w-full transition-all ease-in-out duration-300 ${
                      activeItem === item.text
                        ? "text-[#007bff] border-r-[5px] border-[#077bff] bg-gray-100"
                        : "text-black hover:text-[#007bff] hover:border-r-[5px] border-[#077bff] hover:bg-gray-100"
                    }`}
                  >
                    <item.icon className="w-[18px] h-[18px] mr-4" />
                    <span>{item.text}</span>
                    <AiOutlineDown
                      className={`ml-auto w-4 h-4 transform transition-transform duration-300 ${
                        openProduct ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown với hiệu ứng slide fade */}
                  <div
                    className={`pl-8 space-y-2 mt-2 transition-all duration-500 ease-in-out transform ${
                      openProduct
                        ? "opacity-100 max-h-[500px] overflow-visible"
                        : "opacity-0 max-h-0 overflow-hidden"
                    }`}
                  >
                    {item.subItems.map((subItem) => (
                      <li key={subItem.text}>
                        <Link
                          to={subItem.path}
                          onClick={() => setActiveItem(subItem.text)}
                          className={`text-sm flex items-center px-8 py-4 transition-all ease-in-out duration-300 ${
                            activeItem === subItem.text
                              ? "text-[#007bff] border-r-[5px] border-[#077bff] bg-gray-100"
                              : "text-black hover:text-[#007bff] hover:border-r-[5px] border-[#077bff] hover:bg-gray-100"
                          }`}
                        >
                          <span>{subItem.text}</span>
                        </Link>
                      </li>
                    ))}
                  </div>
                </div>
              ) : (
                // Mục không có dropdown
                <Link
                  to={item.path}
                  onClick={() => setActiveItem(item.text)}
                  className={`text-sm flex items-center px-8 py-4 transition-all ease-in-out duration-300 ${
                    activeItem === item.text
                      ? "text-[#007bff] border-r-[5px] border-[#077bff] bg-gray-100"
                      : "text-black hover:text-[#007bff] hover:border-r-[5px] border-[#077bff] hover:bg-gray-100"
                  }`}
                >
                  <item.icon className="w-[18px] h-[18px] mr-4" />
                  <span>{item.text}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
