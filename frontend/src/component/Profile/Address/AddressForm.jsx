import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import axios from "axios";
import { addNewUserAddress, updateUserAddress } from "../../../config/api";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const AddressForm = ({
  isOpen,
  setIsOpen,
  fetchListAddress,
  selectedAddress,
  setSelectedAddress,
}) => {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [specificAddress, setSpecificAddress] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const userId = useSelector((state) => state.account?.user?._id);
  const resetForm = () => {
    setFullName("");
    setPhone("");
    setCity("");
    setDistrict("");
    setWard("");
    setSpecificAddress("");
    setIsDefault(false);
    setSelectedAddress(null);
  };
  const handleClose = () => {
    setIsOpen(false);
    resetForm();
  };
  useEffect(() => {
    if (!selectedAddress) return;
    setFullName(selectedAddress.fullName);
    setPhone(selectedAddress.phone);
    setCity(selectedAddress.city);
    setDistrict(selectedAddress.district);
    setWard(selectedAddress.ward);
    setSpecificAddress(selectedAddress.specificAddress);
    setIsDefault(selectedAddress.isDefault);
  }, [selectedAddress]);
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(
          "https://provinces.open-api.vn/api/?depth=1"
        );
        setCities(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy tỉnh/thành phố:", error);
      }
    };
    fetchCities();
  }, []);

  useEffect(() => {
    if (!selectedAddress) return;
    const fetchLocationData = async () => {
      try {
        setFullName(selectedAddress.fullName);
        setPhone(selectedAddress.phone);
        setCity(selectedAddress.city);
        setSpecificAddress(selectedAddress.specificAddress);
        setIsDefault(selectedAddress.isDefault);
        // Find city code
        const cityCode = cities.find(
          (c) => c.name === selectedAddress.city
        )?.code;
        if (cityCode) {
          // Fetch districts for selected city
          const districtResponse = await axios.get(
            `https://provinces.open-api.vn/api/p/${cityCode}?depth=2`
          );
          setDistricts(districtResponse.data.districts);
          setDistrict(selectedAddress.district);
          // Find district code
          const districtCode = districtResponse.data.districts.find(
            (d) => d.name === selectedAddress.district
          )?.code;
          if (districtCode) {
            // Fetch wards for selected district
            const wardResponse = await axios.get(
              `https://provinces.open-api.vn/api/d/${districtCode}?depth=2`
            );
            setWards(wardResponse.data.wards);
            setWard(selectedAddress.ward);
          }
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu địa chỉ:", error);
      }
    };
    // Only fetch if we have cities loaded
    if (cities.length > 0) {
      fetchLocationData();
    }
  }, [selectedAddress, cities]);
  // Fetch wards when district changes
  useEffect(() => {
    if (city && !selectedAddress) {
      const fetchDistricts = async () => {
        const cityCode = cities.find((c) => c.name === city)?.code;
        if (cityCode) {
          try {
            const response = await axios.get(
              `https://provinces.open-api.vn/api/p/${cityCode}?depth=2`
            );
            setDistricts(response.data.districts);
            setWards([]);
            setWard("");
          } catch (error) {
            console.error("Lỗi khi lấy quận/huyện:", error);
          }
        }
      };
      fetchDistricts();
    }
  }, [city, selectedAddress, cities]);

  useEffect(() => {
    if (district && !selectedAddress) {
      const fetchWards = async () => {
        const districtCode = districts.find((d) => d.name === district)?.code;
        if (districtCode) {
          try {
            const response = await axios.get(
              `https://provinces.open-api.vn/api/d/${districtCode}?depth=2`
            );
            setWards(response.data.wards);
          } catch (error) {
            console.error("Lỗi khi lấy phường/xã:", error);
          }
        }
      };
      fetchWards();
    }
  }, [district, selectedAddress, districts]);

  const handleSubmit = async () => {
    try {
      const formData = {
        fullName,
        phone,
        city,
        district,
        ward,
        specificAddress,
        isDefault,
      };

      let response;
      if (selectedAddress) {
        response = await updateUserAddress({
          addressId: selectedAddress._id,
          updatedAddress: formData,
        });
        toast.success("Cập nhật địa chỉ thành công");
      } else {
        response = await addNewUserAddress({
          id: userId,
          address: formData,
        });
        toast.success("Thêm địa chỉ mới thành công");
      }

      if (response.status === 200) {
        fetchListAddress();
        handleClose();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại");
      console.error("Error submitting address:", error);
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 z-50 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={handleClose}
      ></div>

      <div
        className={`fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-lg transform transition-transform duration-300 ease-out z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-semibold">
              {selectedAddress ? "Cập nhật địa chỉ" : "Thêm mới địa chỉ"}
            </h2>
            <button onClick={handleClose} className="p-2">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
            <div className="space-y-6">
              <div>
                <h3 className="text-gray-500 mb-4">Thông tin người nhận</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1">Họ và tên</label>
                    <input
                      type="text"
                      placeholder="Nhập họ và tên"
                      className="w-full p-3 rounded-lg border bg-white"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Số điện thoại</label>
                    <input
                      type="tel"
                      placeholder="Nhập số điện thoại"
                      className="w-full p-3 rounded-lg border bg-white"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-gray-500 mb-4">Địa chỉ nhận hàng</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1">Tỉnh/Thành phố</label>
                    <select
                      className="w-full p-3 rounded-lg border bg-white text-gray-500"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    >
                      <option value="">Chọn Tỉnh/Thành phố</option>
                      {cities.map((c) => (
                        <option key={c.code} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1">Quận/Huyện</label>
                    <select
                      className="w-full p-3 rounded-lg border bg-white text-gray-500"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      disabled={!city}
                    >
                      <option value="">Chọn Quận/Huyện</option>
                      {districts.map((d) => (
                        <option key={d.code} value={d.name}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1">Phường/Xã</label>
                    <select
                      className="w-full p-3 rounded-lg border bg-white text-gray-500"
                      value={ward}
                      onChange={(e) => setWard(e.target.value)}
                      disabled={!district}
                    >
                      <option value="">Chọn Phường/Xã</option>
                      {wards.map((w) => (
                        <option key={w.code} value={w.name}>
                          {w.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1">Địa chỉ cụ thể</label>
                    <input
                      type="text"
                      placeholder="Nhập địa chỉ cụ thể"
                      className="w-full p-3 rounded-lg border bg-white"
                      value={specificAddress}
                      onChange={(e) => setSpecificAddress(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label>
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={isDefault}
                      onChange={(e) => setIsDefault(e.target.checked)}
                    />
                    Đặt làm địa chỉ mặc định
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border-t">
            <button
              className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600"
              onClick={handleSubmit}
            >
              {selectedAddress ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddressForm;
