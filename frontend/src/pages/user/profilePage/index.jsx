import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../../component/Profile/SideBar";

const ProfilePage = () => {
  return (
    <div>
      {/* Sidebar trên màn hình nhỏ */}
      <div className="block md:hidden">
        <Sidebar />
      </div>

      <div className="flex overflow-hidden mt-6">
        {/* Sidebar trên màn hình lớn */}
        <div className="hidden md:block w-64 text-white h-fit z-10 sticky top-0">
          <Sidebar />
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Main Content */}
          <main className="px-0 md:px-6 2xl:px-10">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
