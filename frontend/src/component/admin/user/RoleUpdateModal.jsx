import React, { useState, useEffect } from "react";
import ConfirmationModal from "./ConfirmationModal";
import { getAllRole } from "../../../config/api"; 

const RoleUpdateModal = ({ user, onClose, onSave }) => {
  console.log("🚀 ~ RoleUpdateModal ~ user:", user)
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(user.usr_role._id);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await getAllRole();
        if (response.status === 200) {
          setRoles(response.metadata);
        }
      } catch (error) {
        console.error("Failed to fetch roles:", error);
      }
    };

    fetchRoles();
  }, []);

  const handleSave = () => {
    setShowConfirmation(true);
  };

  const handleConfirmSave = () => {
    setShowConfirmation(false);
    onSave(user._id, selectedRole);
  };
    console.log("🚀 ~ handleConfirmSave ~ user._id:", user._id)

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-md w-96">
          <h3 className="text-lg font-bold mb-4">Update Role for {user.usr_name}</h3>
          <div className="space-y-4">
            <label className="block text-gray-700 font-medium">Select Role:</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full border rounded-md p-2"
            >
              {roles.map((role) => (
                <option key={role._id} value={role._id}>
                  {role.rol_name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 ml-2"
            >
              Save
            </button>
          </div>
        </div>
      </div>

      {showConfirmation && (
        <ConfirmationModal
          message="Cảnh báo: Việc này có thể gây nguy hiểm đến bảo mật và thông tin của cửa hàng. Bạn có chắc chắn muốn cập nhật vai trò cho người dùng này không?"
          onConfirm={handleConfirmSave}
          onCancel={() => setShowConfirmation(false)}
        />
      )}
    </>
  );
};

export default RoleUpdateModal;
