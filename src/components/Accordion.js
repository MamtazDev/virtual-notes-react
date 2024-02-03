import React, { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/solid";

const Accordion = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 bg=white transition-all duration-300 ease-in-out">
      <button
        className={`flex items-center justify-between w-full py-4 px-6 text-left  transition-all duration-300 ease-in-out ${
          isOpen ? "text-blue-600" : "text-gray-700"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`${isOpen ? "font-bold" : "font-semibold"}`}>
          {title}
        </span>
        {isOpen ? (
          <ChevronUpIcon className="w-5 h-5 text-blue-500" />
        ) : (
          <ChevronDownIcon className="w-5 h-5 text-blue-500" />
        )}
      </button>
      {isOpen && (
        <div className="px-6 py-4 bg-gray-50">
          <p className="text-gray-700">{content}</p>
        </div>
      )}
    </div>
  );
};

export default Accordion;
