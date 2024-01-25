import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowLeftIcon,
} from "@heroicons/react/solid";
import UserContext from "../UserContext";
import { API_URL } from "../config/config";

const FlashcardDisplay = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDefinitionFirst, setIsDefinitionFirst] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isTermShown, setIsTermShown] = useState(true);
  const { flashcardSets } = useContext(UserContext);

  const [setId, setSetId] = useState(location.state?.setId);
  const [flashcards, setFlashcards] = useState(location.state?.flashcards);
  const [title, setTitle] = useState(location.state?.title);

  useEffect(() => {
    console.log("Location state on FlashcardDisplay:", location.state);
    async function fetchFlashcards() {
      try {
        const response = await fetch(`${API_URL}/api/flashcard/sets/${setId}`);
        const data = await response.json();
        setFlashcards(data.flashcards);
      } catch (error) {
        console.error("Error fetching flashcards:", error);
        setFlashcards([]);
      }
    }

    const loadedFlashcards = location.state?.flashcards;

    if (loadedFlashcards && Array.isArray(loadedFlashcards)) {
      setFlashcards(loadedFlashcards);
    } else {
      fetchFlashcards();
    }
  }, [location.state]);

  const goToNextCard = () => {
    setIsTermShown(!isDefinitionFirst);
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
  };

  const goToPreviousCard = () => {
    setIsTermShown(!isDefinitionFirst);
    setCurrentCardIndex(
      (prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length
    );
  };

  const flipCard = () => {
    setIsTermShown(!isTermShown);
  };

  const handleBack = () => {
    navigate("/flashcards", { state: { fromCreation: true } });
  };

  const toggleTermDefinition = () => {
    setIsDefinitionFirst(!isDefinitionFirst);
    setIsTermShown(isDefinitionFirst);
  };

  const handleEditFlashcards = () => {
    navigate("/edit-flashcards", {
      state: {
        setId,
        flashcards,
        title, // Assuming these are available in the state of FlashcardDisplay.js
      },
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-grow p-4 mt-[100px] flex flex-col items-center">
        {/* 
        <div className="w-full flex justify-start lg:hidden px-4 pt-2">
          <button
            onClick={handleBack}
            className="hidden md:flex items-center text-blue-500 hover:text-blue-700 transition-colors mb-4"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Flashcard Sets
          </button>
        </div>
        */}

        {/* Desktop Buttons */}
        <div className="hidden lg:flex lg:w-full lg:justify-center lg:mb-5 space-x-4">
          <button
            onClick={() => handleEditFlashcards(setId)}
            className="text-sm bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600"
          >
            Edit Set
          </button>
          <button
            onClick={toggleTermDefinition}
            className="text-sm bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600"
          >
            Term First
          </button>
        </div>

        {/* Mobile/Tablet Buttons */}
        <div className="lg:hidden w-full px-4 mb-5 space-y-2">
          <button
            onClick={() => handleEditFlashcards(setId)}
            className="bg-blue-500 hover:bg-blue-600 text-white text-sm py-2 lg:py-3 px-4 rounded transition-colors w-full sm:w-auto"
          >
            Edit Set
          </button>
          <button
            onClick={toggleTermDefinition}
            className="bg-blue-500 hover:bg-blue-600 text-white text-sm py-2 lg:py-3 px-4 rounded transition-colors w-full sm:w-auto"
          >
            {isDefinitionFirst ? "Definition First" : "Term First"}
          </button>
        </div>
        <div className="w-full max-w-4xl flex justify-between items-center mt-4 mb-4">
          <div className="flex flex-col">
            <span className="text-md font-semibold">Term</span>
          </div>
          <span className="text-sm font-semibold">
            Card {currentCardIndex + 1} / {flashcards.length}
          </span>
        </div>
        {flashcards && flashcards.length > 0 ? (
          <>
            <div
              className="w-full max-w-4xl p-8 bg-white shadow-lg rounded-lg cursor-pointer"
              onClick={flipCard}
              style={{ minHeight: "500px" }}
            >
              <div className="flex justify-center items-center h-full">
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {/* Display based on isTermShown */}
                    {isTermShown
                      ? flashcards[currentCardIndex]?.term
                      : flashcards[currentCardIndex]?.definition}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center space-x-4 mt-[70px]">
              <button
                onClick={goToPreviousCard}
                className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50 transition duration-300 ease-in-out"
              >
                <ChevronLeftIcon className="h-6 w-6" />
              </button>
              <button
                onClick={goToNextCard}
                className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50 transition duration-300 ease-in-out"
              >
                <ChevronRightIcon className="h-6 w-6" />
              </button>
            </div>
          </>
        ) : (
          <div className="text-center mt-[200px]">
            <p>No flashcards available.</p>
          </div>
        )}
      </div>

      <div className="hidden lg:block fixed top-0 right-0 w-80 p-4 bg-white shadow-lg rounded-lg h-screen overflow-y-auto">
        <div className="text-xl font-bold mb-2">Card Slides</div>
        <div
          className="overflow-y-auto"
          style={{ height: "calc(100% - 2rem)" }}
        >
          {/* <button
            onClick={handleEditFlashcards}
            className="mt-2 mb-2 w-full text-center px-4 py-2 bg-blue-600 text-white rounded-md shadow-lg hover:bg-blue-700 transition ease-in-out duration-300"
          >
            Edit Flashcard Set
          </button>
        */}

          {flashcards.map((card, index) => (
            <div
              key={index}
              className={`p-2 my-2 bg-gray-100 rounded cursor-pointer ${
                currentCardIndex === index ? "bg-blue-100" : ""
              }`}
              onClick={() => setCurrentCardIndex(index)}
            >
              Card {index + 1}: {card.term}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FlashcardDisplay;
