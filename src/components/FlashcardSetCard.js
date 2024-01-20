import React from "react";
import { useNavigate } from "react-router-dom";

const FlashcardSetCard = ({ material, isSelected, onCardClick }) => {
  const navigate = useNavigate();

  const handleStudyClick = (e) => {
    e.stopPropagation();
    navigate("/flashcard-display", {
      state: { flashcards: material.flashcards },
    });
  };

  return (
    <div
      className={`flex items-center justify-between p-4 rounded-lg transition duration-150 ${
        isSelected ? "ring-2 ring-blue-500 bg-blue-50" : "bg-white"
      }`}
      onClick={onCardClick}
    >
      <div className="flex flex-col">
        <h3 className="text-lg font-semibold">{material.title}</h3>
        <p className="text-sm text-gray-500">
          {material.description || "No description"}
        </p>
      </div>
      <button
        onClick={handleStudyClick}
        className="text-white bg-blue-500 hover:bg-blue-700 font-medium rounded-full text-sm px-5 py-2.5 text-center transition duration-300 ease-in-out mr-2"
      >
        Study
      </button>
    </div>
  );
};

export default FlashcardSetCard;
