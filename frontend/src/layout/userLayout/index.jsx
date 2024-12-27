import { memo } from "react";
import Header from "../../component/theme/header";
import Footer from "../../component/theme/footer";
import { Outlet } from "react-router-dom";

const MasterLayout = ({ ...props }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="w-full fixed top-0 left-0 right-0 z-50 bg-white">
        <Header />
      </div>

      <main className="flex-grow w-full mt-[100px]">
        {" "}
        <div className="mx-4 sm:mx-6 md:mx-12 lg:mx-28" {...props}>
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default memo(MasterLayout);
