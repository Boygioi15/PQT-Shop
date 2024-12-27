import React from "react";
import { AiOutlineWarning } from "react-icons/ai";

const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <div className="flex items-center mb-4">
          <AiOutlineWarning className="text-yellow-500 text-2xl mr-2" />
          <h3 className="text-lg font-bold">Confirmation</h3>
        </div>
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 ml-2"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
