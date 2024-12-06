import { FaCheck } from "react-icons/fa6";

const ColorCard = ({ options, selectedIndex, onSelectOption }) => {
  return (
    <div className="flex mt-4 gap-4">
      {options.map((option, index) => (
        <a
          key={index}
          className={`flex justify-center items-center relative cursor-pointer ${
            selectedIndex === index ? "border-maincolor" : "border-gray-300"
          }`}
          onClick={() => onSelectOption(index)}
        >
          {option.src && (
            <div className="w-20 h-20">
              <img
                src={option.src}
                alt={option.label || "Option Image"}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          {selectedIndex === index && (
            <span
              className="absolute top-0 right-0 w-7 h-7 bg-maincolor flex items-center justify-center"
              style={{
                clipPath: "polygon(100% 0, 0% 0, 100% 100%)",
                transform: "translate(0px, 0px)",
              }}
            >
              <FaCheck
                className="text-black text-xs"
                style={{ transform: "translate(5px, -5px)" }}
              />
            </span>
          )}
        </a>
      ))}
    </div>
  );
};

export default ColorCard;