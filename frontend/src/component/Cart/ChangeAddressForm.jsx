import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getListUserAddress } from "../../config/api";
import { Home, X } from "lucide-react";

const ChangeAddressForm = ({ isOpen, setIsOpen, setAddress }) => {
  const userId = useSelector((state) => state.account?.user?._id);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null); // State for selected address

  const fetchListAddress = async () => {
    const response = await getListUserAddress({ id: userId });
    if (response.status === 200) {
      setAddresses(response.metadata);
    }
  };

  useEffect(() => {
    if (!userId) return;
    fetchListAddress();
  }, [userId]);

  const handleSubmit = () => {
    if (selectedAddress) {
      setAddress(selectedAddress); // Pass the selected address to the parent component
      setIsOpen(false); // Close the form after selecting the address
    }
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address); // Update the selected address
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 z-50 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsOpen(false)}
      ></div>

      <div
        className={`fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-lg transform transition-transform duration-300 ease-out z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full "
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-semibold">Chọn địa chỉ</h2>
            <button onClick={() => setIsOpen(false)} className="p-2">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
            <div className="space-y-4">
              {addresses.map((address, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-lg shadow p-4 flex items-start gap-4 cursor-pointer ${
                    selectedAddress === address
                      ? "border-2 border-blue-500" // Highlight selected address
                      : ""
                  }`}
                  onClick={() => handleAddressSelect(address)} // Select the address
                >
                  <div className="bg-gray-100 p-2 rounded-lg">
                    <Home className="w-6 h-6 text-gray-600" />
                  </div>

                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{address.fullName}</h3>
                        <p className="text-gray-600">{address.phone}</p>
                        <p className="text-gray-600 mt-1">
                          {address.fullAddress}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 border-t">
            <button
              className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600"
              onClick={handleSubmit}
              disabled={!selectedAddress} // Disable button if no address is selected
            >
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangeAddressForm;
