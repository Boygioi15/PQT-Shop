import React, { useEffect, useState } from "react";
import { Home, Plus, Building2, X } from "lucide-react";
import AddressForm from "./AddressForm";
import { getListUserAddress } from "../../../config/api";
import { useSelector } from "react-redux";

const Address = () => {
  const [isOpen, setIsOpen] = useState(false);
  const userId = useSelector((state) => state.account?.user?._id);
  const [addresses, setAddresses] = useState([]);
  const fetchListAddress = async () => {
    const response = await getListUserAddress({ id: userId });
    console.log("🚀 ~ fetchListAddress ~ response:", response);
    if (response.status === 200) {
      setAddresses(response.metadata);
    }
  };

  useEffect(() => {
    if (!userId) return;

    fetchListAddress();
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    fetchListAddress();
  }, []);

  return (
    <div className=" max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Sổ địa chỉ nhận hàng</h1>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>Thêm địa chỉ mới</span>
        </button>
      </div>
      <div className="space-y-4">
        {addresses?.map((address, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow p-4 flex items-start gap-4"
          >
            <div className="bg-gray-100 p-2 rounded-lg">
              <Home className="w-6 h-6 text-gray-600" />
            </div>

            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{address.fullName}</h3>
                  <p className="text-gray-600">{address.phone}</p>
                  <p className="text-gray-600 mt-1">{address.fullAddress}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <AddressForm
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        fetchListAddress={fetchListAddress}
      />
    </div>
  );
};

export default Address;
