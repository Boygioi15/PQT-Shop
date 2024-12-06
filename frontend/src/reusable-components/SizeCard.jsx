import { FaCheck } from "react-icons/fa6";

const SizeCard = ({ options, selectedIndex, onSelectOption }) => {
  return (
    <div className="flex flex-wrap gap-4 mt-4">
      {options.map((option, index) => (
        <a
          key={index}
          className={`flex justify-center items-center relative border border-black rounded-[5px] cursor-pointer w-[80px] h-[45px] ${
            selectedIndex === index ? "border-maincolor" : "border-gray-300"
          }`}
          onClick={() => onSelectOption(index)}
        >
          <span className="text-base font-semibold text-gray-800 p-2">
            {option.label}
          </span>
          {selectedIndex === index && (
            <span
              className="absolute top-0 right-0 w-7 h-7 bg-maincolor flex items-center justify-center rounded-tr-[5px]"
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

export default SizeCard;