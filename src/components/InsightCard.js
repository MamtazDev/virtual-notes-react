import React from "react";

const InsightCard = () => {
  return (
    <div
      className={`mt-20 space-y-10 flex flex-col ${
        reverseOrder ? "md:flex-row-reverse" : "md:flex-row"
      } items-center md:space-x-10`}
    >
      <img
        src={imageSrc}
        alt={imageAlt}
        className="mx-auto w-full md:w-1/2 shadow-md rounded-md"
      />
      <div className="mt-4 md:mt-0 text-center md:text-left">
        <h2 className="text-2xl font-semibold text-blue-700">{title}</h2>
        <p className="text-gray-600 mt-2">{description}</p>
        <button className="transition duration-300 transform hover:scale-105 bg-blue-500 hover:bg-blue-600 text-white mt-4 px-4 py-2 rounded-md shadow">
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default InsightCard;
