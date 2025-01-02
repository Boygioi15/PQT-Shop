import { useRef, useState, useEffect } from "react";
import { callLogout, getListRole } from "../../config/api";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineUser } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { setLogoutAction } from "../../redux/slice/accountSlice";
import { toast } from "react-toastify";
import { resetCart } from "../../redux/slice/cartSlice";
import { clearRoleData } from "../../redux/slice/rbacSlice";

const ProfileNavBar = ({ userAvatar, userName }) => {
  const { isAuthenticated } = useSelector((state) => state.account);
  const roleId = useSelector((state) => state.account.user?.role); // Giả sử account slice lưu thông tin user
  const [roles, setRoles] = useState([]); // Lưu trữ danh sách role
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const roleName = useSelector((state) => state?.rbac?.userRole?.name); // Giả sử account slice lưu thông tin user
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await getListRole(); // Lấy danh sách role từ API
        console.log("🚀 ~ fetchRoles ~ response:", response);
        if (response && response.metadata) {
          setRoles(response.metadata); // Lưu danh sách roles vào state
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
        toast.error("Failed to fetch roles.");
      }
    };

    if (isAuthenticated) {
      fetchRoles(); // Lấy danh sách role khi người dùng đã đăng nhập
    }
  }, [isAuthenticated]);

  const handleMouseEnter = () => {
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setDropdownOpen(false);
  };

  const handleLogOut = async () => {
    try {
      const response = await callLogout();
      if (response.status === 200 && response.metadata) {
        dispatch(setLogoutAction());
        dispatch(clearRoleData());
        dispatch(resetCart());
        navigate("/");
        toast.success("Logged out successfully!");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out. Please try again.");
    }
  };

  return (
    <div className="relative">
      {isAuthenticated ? (
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="relative"
        >
          {/* Profile Display */}
          <button
            ref={dropdownRef}
            className="flex items-center space-x-2 focus:outline-none"
            aria-label="User menu"
            aria-haspopup="true"
          >
            <img
              className="h-10 w-10 rounded-full object-cover border-2 border-gray-300"
              src={userAvatar}
              alt="User Avatar"
            />
            <span className="text-sm font-semibold text-gray-700">
              {userName || "User"}
            </span>
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div
              className="absolute right-0 w-56 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50"
              style={{ animation: "fadeIn 0.2s ease-in-out" }}
            >
              <div className="py-2">
                {/* Show Profile link only for regular users */}
                {
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-500 transition duration-150"
                  >
                    Trang cá nhân
                  </Link>
                }

                {/* Show Admin Page link only for admin or staff */}
                {roleId !== "6704099fb8583f3dc7342d12" && (
                  <Link
                    to="/admin/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-500 transition duration-150"
                  >
                    Trang quản trị
                  </Link>
                )}

                {/* Log out button */}
                <button
                  onClick={handleLogOut}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-500 transition duration-150 w-full text-left"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Link
          to={"/login"}
          className="font-extrabold text-3xl my-7 lg:my-0 relative"
        >
          <AiOutlineUser />
        </Link>
      )}
    </div>
  );
};

export default ProfileNavBar;
