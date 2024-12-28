import { memo, useState } from "react";
import { IoIosMenu, IoIosSearch } from "react-icons/io";
import { PiBellSimpleRinging } from "react-icons/pi";
import { FaHome } from "react-icons/fa"; // Import icon Home
import NotificationMenu from "../../Notification/notificationMenu";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import Search from "../../SearchBox";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate for navigation

const Header = ({ setIsSidebarOpen }) => {
  const mockNotifications = [
    { message: "Your order has been shipped.", time: "2 minutes ago" },
    { message: "New message from customer support.", time: "1 hour ago" },
    { message: "Product back in stock: iPhone 13", time: "3 hours ago" },
    { message: "Flash Sale starting soon!", time: "1 day ago" },
  ];

  const [notifyIsOpen, setNotifyIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const userAvatar = useSelector((state) => state.account.user.avatar);
  const navigate = useNavigate(); // For navigation

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  };

  const dialogVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
    exit: { y: 50, opacity: 0, transition: { duration: 0.2 } },
  };

  return (
    <div className="w-full top-0 left-0 z-[40]">
      {/* Header Container */}
      <div className="lg:px-10 py-4 px-7 flex justify-between items-center bg-white shadow-md relative">
        {/* Sidebar Toggle Button */}
        <div className="flex items-center">
          <button
            onClick={() => setIsSidebarOpen((prevState) => !prevState)}
            className="text-4xl text-mainColor"
          >
            <IoIosMenu />
          </button>
        </div>

        {/* Desktop Search */}
        <div className="hidden lg:flex lg:ml-10 flex-1">
          <Search />
        </div>

        {/* Notification, Home, and Profile Section */}
        <div className="flex items-center space-x-8">
          {/* Home Button */}

          {/* Mobile Search Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="lg:hidden text-3xl text-mainColor"
          >
            <IoIosSearch />
          </button>

          {/* Notification Section */}
          {/* <div
            onMouseEnter={() => setNotifyIsOpen(true)}
            onMouseLeave={() => setNotifyIsOpen(false)}
            className="relative text-3xl font-extrabold"
          >
            <PiBellSimpleRinging />
            <span className="absolute top-0 right-0 text-[0.6rem] bg-red-500 text-white rounded-full w-3.5 h-3.5 flex items-center justify-center">
              {mockNotifications.length}
            </span>
            {notifyIsOpen && (
              <NotificationMenu notifications={mockNotifications} />
            )}
          </div> */}

          {/* User Avatar */}
          <Link to="/admin/profile" className="relative">
            <img
              className="h-12 w-12 rounded-full object-cover cursor-pointer"
              src={userAvatar}
              alt="User Avatar"
            />
          </Link>
          <FaHome
            onClick={() => navigate("/")}
            className="text-2xl cursor-pointer"
          />
        </div>
      </div>

      {/* Search Dialog */}
      {isSearchOpen && (
        <motion.div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex justify-center items-center"
          onClick={() => setIsSearchOpen(false)}
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={overlayVariants}
        >
          <motion.div
            className="bg-white p-4 w-80 rounded-md"
            onClick={(e) => e.stopPropagation()}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={dialogVariants}
          >
            <Search className="w-full" />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default memo(Header);
