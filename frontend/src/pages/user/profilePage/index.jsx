import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../../component/Profile/SideBar";
import RecommendSectionForProfile from "../../../component/RecommendSection/RecommendSectionInProfile";

const ProfilePage = () => {
  return (
    <div>
      <div className="block md:hidden">
        <Sidebar />
      </div>

      <div className="flex overflow-hidden mt-6">
        <div className="hidden md:block w-64 text-white h-fit z-1 sticky top-0">
          <Sidebar />
        </div>

        <div className="flex-1 flex flex-col overflow-y-auto">
          <main className="px-0 md:px-6 2xl:px-10 h-full">
            <Outlet />
          </main>
        </div>
      </div>
      <div className="py-10">
        <RecommendSectionForProfile />
      </div>
    </div>
  );
};

export default ProfilePage;
