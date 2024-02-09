import React, { useState, useContext, useEffect } from "react";
import { PlusIcon } from "@heroicons/react/solid";
import Sidebar from "./Sidebar";
import UserContext from "../UserContext";
import { useNavigate, useLocation } from "react-router-dom";
import FlashcardSetCard from "./FlashcardSetCard";
import { API_URL } from "../config/config";
import axios from "axios";
import spinner from "../assets/loading-spinner.svg";

const FlashcardsMain = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { flashcardSets, deleteFlashcardSet, fetchFlashcardSets } =
    useContext(UserContext);
  const [selectedMaterials, setSelectedMaterials] = useState(new Set());

  const [allFlashCard, setAllFlashCard] = useState([]);
  const [setId, setSetId] = useState(location.state?.setId);
  const [flashcards, setFlashcards] = useState(location.state?.flashcards);
  const [title, setTitle] = useState(location.state?.title);

  const toggleSelectMaterial = (index) => {
    const newSelectedMaterials = new Set(selectedMaterials);
    if (newSelectedMaterials.has(index)) {
      newSelectedMaterials.delete(index);
    } else {
      newSelectedMaterials.add(index);
    }
    setSelectedMaterials(newSelectedMaterials);
  };

  const deleteSelected = async () => {
    for (let index of selectedMaterials) {
      const setId = flashcardSets[index]._id;
      await deleteFlashcardSet(setId);
    }
    setSelectedMaterials(new Set());
  };

  console.log("Demo console.log");
  const handleEdit = (setId) => {
    navigate("/edit-flashcards", {
      state: {
        setId,
        flashcards,
        title,
      },
    });
  };

  // Function to handle navigation to the Study page
  const handleStudy = (setId) => {
    console.log("Navigating to FlashcardDisplay with setId:", setId);
    navigate("/flashcard-display", {
      state: {
        setId,
        flashcards,
        title,
      },
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      if (location.state?.fromCreation) {
        await fetchFlashcardSets();
        navigate(location.pathname, { replace: true, state: {} });
      }
    };

    fetchData();
  }, [location, navigate, fetchFlashcardSets]);

  const fetchFlashcardHandler = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/flashcard/flashcard-sets`,
        {
          withCredentials: true,
        }
      );
      if (response.data && response.data.flashcardSets) {
        console.log("response.data: ", response.data.flashcardSets);
        setAllFlashCard(response.data.flashcardSets);
      }
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.error("Error request:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error message:", error.message);
      }
      console.error("Error config:", error.config);
    }
  };

  useEffect(() => {
    fetchFlashcardHandler();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar className="hidden lg:block" />

      {/* Main content area */}
      <div className="flex-1">
        <div className="pt-16 sm:pt-20 lg:pt-8 px-4 sm:px-6 lg:px-8 lg:ml-64">
          {/* Header and control panel section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between lg:justify-end border-b border-gray-200 pb-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-800">
                Flashcards
              </h1>
              <p className="text-gray-600 mt-2">
                The good old flashcards. You can use this to study your
                materials.
              </p>
            </div>
            {/* Control Panel for selected flashcards */}
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-4 sm:mt-0 w-full sm:w-auto">
              {selectedMaterials.size > 0 && (
                <button
                  onClick={deleteSelected}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto mb-2 sm:mb-0 order-2 sm:order-none mt-2 sm:mt-0" // Added mt-4 for mobile and sm:mt-0 for tablet and above
                >
                  Delete Selected
                </button>
              )}
              <button
                onClick={() => navigate("/create-flashcards")}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto order-1"
              >
                New
              </button>
            </div>
          </div>

          {/* Grid layout for flashcards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 pb-5">
            {allFlashCard.length > 0 ? (
              allFlashCard.map((material, index) => (
                <div
                  key={material._id}
                  className={`cursor-pointer rounded-lg shadow-md ${
                    selectedMaterials.has(index)
                      ? "ring-2 ring-blue-500 bg-blue-50"
                      : "bg-white"
                  }`}
                  onClick={() => toggleSelectMaterial(index)}
                >
                  <FlashcardSetCard
                    material={material}
                    isSelected={selectedMaterials.has(index)}
                    onEdit={() => handleEdit(material._id)}
                    onStudy={() => handleStudy(material._id)}
                  />
                </div>
              ))
            ) : (
              <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-xl text-center text-gray-500 py-[300px]">
                No flashcards available.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardsMain;

// speeed optimization
