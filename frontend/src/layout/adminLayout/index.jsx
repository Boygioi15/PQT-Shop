import { memo } from "react";
import Header from "../../component/admin/header";
import Sidebar from "../../component/admin/sideBar";
import { Outlet } from "react-router-dom";

const AdminLayout = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* ===== Sidebar Start ===== */}
      <div className="w-64 bg-gray-800 text-white h-screen z-10">
        <Sidebar />
      </div>
      {/* ===== Sidebar End ===== */}

      {/* ===== Content Area Start ===== */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* ===== Header Start ===== */}
        <div className="sticky top-0 z-20 bg-white shadow-md">
          <Header />
        </div>
        {/* ===== Header End ===== */}

        {/* ===== Main Content Start ===== */}
        <main className="p-4 md:p-6 2xl:p-10">
          <Outlet />
        </main>
        {/* ===== Main Content End ===== */}
      </div>
      {/* ===== Content Area End ===== */}
    </div>
  );
};

export default memo(AdminLayout);
