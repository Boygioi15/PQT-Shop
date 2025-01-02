import { useEffect, useState, useRef } from "react";
import { IoCloseOutline } from "react-icons/io5";
import "../../style/sideBar.css";

const ProductSideBar = ({ productAttributes, isOpen, setIsOpen }) => {
  const [activeGroup, setActiveGroup] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const refs = useRef([]);
  const groupListRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  const scrollToGroup = (index) => {
    if (refs.current[index]) {
      const contentContainer = contentRef.current;
      const targetElement = refs.current[index];
      const containerTop = contentContainer.offsetTop;
      const elementTop = targetElement.offsetTop;

      contentContainer.scrollTo({
        top: elementTop - containerTop,
        behavior: "smooth",
      });

      setActiveGroup(index);
    }
  };

  const handleScroll = () => {
    if (!contentRef.current) return;

    const container = contentRef.current;
    const scrollPosition = container.scrollTop + container.offsetTop;

    let closestGroup = 0;
    let minDistance = Infinity;

    refs.current.forEach((ref, index) => {
      if (ref) {
        const distance = Math.abs(ref.offsetTop - scrollPosition);
        if (distance < minDistance) {
          minDistance = distance;
          closestGroup = index;
        }
      }
    });

    setActiveGroup(closestGroup);
  };

  useEffect(() => {
    const container = contentRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const startDrag = (e) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setScrollLeft(groupListRef.current.scrollLeft);
  };

  const onDrag = (e) => {
    if (!isDragging) return;
    const distance = e.clientX - startX;
    groupListRef.current.scrollLeft = scrollLeft - distance;
  };

  const stopDrag = () => {
    setIsDragging(false);
  };

  return (
    <>
      <div
        className={`overlay ${isOpen ? "overlay-visible" : "overlay-hidden"}`}
        onClick={() => setIsOpen(false)}
      />

      <div
        className={`sidebar ${isOpen ? "sidebar-open" : "sidebar-close"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sidebar-header">
          <h3 className="sidebar-title">Thông số kĩ thuật</h3>
          <IoCloseOutline
            onClick={() => setIsOpen(false)}
            className="close-icon"
          />
        </div>
        <hr />
        <div
          ref={groupListRef}
          className="group-list flex flex-row gap-4 m-5 mb-3 overflow-x-auto"
          onMouseDown={startDrag}
          onMouseMove={onDrag}
          onMouseUp={stopDrag}
          onMouseLeave={stopDrag}
        >
          {productAttributes.map((group, index) => (
            <button
              key={index}
              onClick={() => scrollToGroup(index)}
              className={`text-lg font-bold mb-2 relative whitespace-nowrap ${
                activeGroup === index ? "text-red-500" : "text-gray-500"
              }`}
            >
              <span className="relative z-10">{group.groupName}</span>
              <div
                className={`absolute left-0 right-0 bottom-0 h-[2px] transition-colors duration-200 ${
                  activeGroup === index
                    ? "bg-red-500"
                    : "bg-transparent hover:bg-red-500"
                }`}
              ></div>
              <div
                className={`absolute left-0 right-0 top-0 h-[2px] transition-colors duration-200 ${
                  activeGroup === index
                    ? "bg-red-500"
                    : "bg-transparent hover:bg-red-500"
                }`}
              ></div>
            </button>
          ))}
        </div>
        <hr />
        <div
          ref={contentRef}
          className="mr-5 ml-5 sidebar-content overflow-y-auto"
          style={{ height: "calc(100vh - 180px)" }}
        >
          {productAttributes.map((group, index) => (
            <div
              key={index}
              className="mt-6"
              ref={(el) => (refs.current[index] = el)}
            >
              <h4 className="text-lg font-bold text-gray-800">
                {group.groupName}
              </h4>
              <table className="w-full table-auto mt-4">
                <tbody className="divide-y divide-gray-300">
                  {group.attributes.map((attribute, attrIndex) => (
                    <tr key={attrIndex}>
                      <td
                        style={{ width: "60%" }}
                        className="p-2 text-xl text-slate-500"
                      >
                        {attribute.displayName}
                      </td>
                      <td
                        style={{ width: "40%" }}
                        className="p-2 text-xl text-gray"
                      >
                        {attribute.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProductSideBar;
