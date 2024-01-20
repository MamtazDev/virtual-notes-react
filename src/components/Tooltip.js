import React, { useState } from "react";

const Tooltip = ({ message, children }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {showTooltip && (
        <div className="absolute bottom-full mb-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg shadow-lg">
          {message}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
