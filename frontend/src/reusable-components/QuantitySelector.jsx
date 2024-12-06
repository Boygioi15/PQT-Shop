import { useState } from "react";

const QuantitySelector = ({ initialQuantity = 1, onChange }) => {
  const [quantity, setQuantity] = useState(initialQuantity);

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
      onChange(quantity - 1);
    }
  };

  const handleIncrement = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
    onChange(quantity + 1);
  };
  const handleInputChange = (event) => {
    const newQuantity = parseInt(event.target.value, 10);
    if (!isNaN(newQuantity) && newQuantity >= 1) {
      setQuantity(newQuantity);
      onChange(newQuantity);
    }
  };
  return (
    <div className="grid grid-cols-3 items-center justify-center border border-1 border-black w-[112px] h-[40px]">
      <button
        type="button"
        className=" hover:bg-gray-300 h-full"
        onClick={handleDecrement}
      >
        -
      </button>
      <input
        className="w-full min-h-[35px] text-center "
        onChange={handleInputChange}
        value={quantity}
      ></input>
      <button
        type="button"
        className=" hover:bg-gray-300 h-full"
        onClick={handleIncrement}
      >
        +
      </button>
    </div>
  );
};

export default QuantitySelector;
