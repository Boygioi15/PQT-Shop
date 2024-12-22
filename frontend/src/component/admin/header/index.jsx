import { memo } from "react";
import Search from "../../SearchBox";
import { IoIosArrowDropdown } from "react-icons/io";

const Header = () => {
  return (
    <>
      <div className="w-full top-0 left-0 z-[40]">
        <div className="lg:px-10 py-4 px-7 lg:flex justify-between items-center bg-white shadow-md relative">
          {/* Mobile Search */}
          <div className="mt-4 lg:hidden">
            <Search />
          </div>

          {/* Desktop Search */}
          <Search className="hidden lg:flex lg:ml-10" />

          {/* Profile Section */}
        </div>
      </div>
    </>
  );
};

export default memo(Header);
