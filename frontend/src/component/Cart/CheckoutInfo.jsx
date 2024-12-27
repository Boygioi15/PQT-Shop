import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUserDefaultAddress } from "../../config/api";
import ChangeAddressForm from "./ChangeAddressForm";

const CheckoutInfo = ({
  onSubmit,
  setOrderAddress,
  orderNote,
  setOrderNote,
}) => {
  const userId = useSelector((state) => state.account?.user?._id);
  const [address, setAddress] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // Gửi dữ liệu form lên cho cha
  };

  useEffect(() => {
    if (!userId) return;
    const fetchAdress = async () => {
      const response = await getUserDefaultAddress({ id: userId });
      if (response.status === 200) {
        setAddress(response.metadata);
      }
    };
    fetchAdress();
  }, [userId]);

  useEffect(() => {
    setOrderAddress(address);
  }, [address]);

  const handleOnChangeAddress = async () => {
    setIsOpen(true);
  };

  return (
    <div className="p-4 bg-white rounded-md">
      <h2 className="text-lg font-bold mb-4">Thông tin nhận hàng</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="p-4 bg-white border border-gray-200 rounded-md shadow-sm flex justify-between items-center">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-1">
                Giao tới
              </h3>
              <p className="text-base font-medium text-gray-800">
                {address?.fullAddress}
              </p>
            </div>
            <button
              className="text-sm font-medium text-blue-600 hover:underline"
              onClick={handleOnChangeAddress}
            >
              Thay đổi
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Ghi Chú
          </label>
          <textarea
            name="note"
            value={orderNote}
            style={{
              resize: "none",
            }}
            onChange={(e) => setOrderNote(e.target.value)}
            placeholder="Ví dụ: Hãy liên lạc chô tôi 30p trước khi giao tới"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 hover:border-blue-500 transition-all"
          />
        </div>
      </form>

      {isOpen && (
        <ChangeAddressForm
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          setAddress={setAddress}
        />
      )}
    </div>
  );
};

export default CheckoutInfo;
