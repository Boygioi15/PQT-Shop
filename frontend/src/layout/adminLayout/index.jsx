import { memo, useState } from "react";
import Header from "../../component/admin/header";
import Sidebar from "../../component/admin/sideBar";
import { Outlet } from "react-router-dom";

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to manage sidebar visibility

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="sticky top-0 z-20 bg-white shadow-md">
          <Header setIsSidebarOpen={setIsSidebarOpen} />{" "}
        </div>
        <main className="p-4 md:p-8 2xl:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default memo(AdminLayout);
