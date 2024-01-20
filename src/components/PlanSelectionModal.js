import React from "react";

function PlanSelectionModal({ isOpen, onClose, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <p>{message}</p>
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white font-medium mt-4"
        >
          OK
        </button>
      </div>
    </div>
  );
}

export default PlanSelectionModal;
