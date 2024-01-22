import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { PlusIcon, ArrowLeftIcon, BookOpenIcon } from "@heroicons/react/solid";
import Sidebar from "./Sidebar";
import UserContext from "../UserContext";

const AddFlashcardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [editedFlashcards, setEditedFlashcards] = useState({});
  const [editingFlashcard, setEditingFlashcard] = useState({
    id: null,
    term: "",
    definition: "",
  });
  const { addNewFlashcard, handleSaveFlashcards } = useContext(UserContext);

  const [setId, setSetId] = useState(location.state?.setId);
  const [flashcards, setFlashcards] = useState(location.state?.flashcards);
  const [title, setTitle] = useState(location.state?.title);

  useEffect(() => {
    const fetchFlashcardSetDetails = async () => {
      if (setId) {
        try {
          const response = await axios.get(
            `API_URL/api/flashcard/sets/${setId}`,
            { withCredentials: true }
          );
          if (response.data) {
            setTitle(response.data.title);
            setFlashcards(response.data.flashcards);
          }
        } catch (error) {
          console.error("Error fetching flashcard set details:", error);
        }
      }
    };

    fetchFlashcardSetDetails();
  }, [setId]);

  const updateFlashcard = (index, side, text) => {
    const newFlashcards = [...flashcards];
    // Find the flashcard that's being edited using the index
    const flashcard = newFlashcards[index];
    // Check if there is an actual change in the text
    if (flashcard[side] !== text) {
      flashcard[side] = text;
      setFlashcards(newFlashcards);
      // Mark the flashcard as edited
      setEditedFlashcards({ ...editedFlashcards, [flashcard._id]: true });
    }
  };

  const handleAddNewFlashcard = async () => {
    const newFlashcardData = { term: "", definition: "" };
    await addNewFlashcard(newFlashcardData, setId);

    // Add a new flashcard box at the very top
    setFlashcards((currentFlashcards) => [
      newFlashcardData,
      ...currentFlashcards,
    ]);
  };

  const handleDeleteFlashcard = async (flashcardId) => {
    // Ensure setId and flashcardId are defined
    if (!setId) {
      console.error("setId is undefined");
      return;
    }
    if (!flashcardId) {
      console.error("Invalid flashcardId:", flashcardId);
      return;
    }

    try {
      const url = `API_URL/api/flashcard/flashcard-sets/${setId}/flashcards/${flashcardId}`;
      const response = await axios.delete(url, { withCredentials: true });

      if (response.status === 200) {
        // Remove the deleted flashcard from the current state
        setFlashcards((currentFlashcards) =>
          currentFlashcards.filter((flashcard) => flashcard._id !== flashcardId)
        );
      } else {
        console.error(`Error deleting flashcard. Status: ${response.status}`);
      }
    } catch (error) {
      console.error(
        "Error deleting flashcard:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleStudyNowClick = () => {
    navigate("/flashcard-display", {
      state: {
        setId,
        flashcards,
        title,
      },
    });
  };

  const handleEditChange = (field, value) => {
    setEditingFlashcard({ ...editingFlashcard, [field]: value });
  };

  const startEditing = (flashcard) => {
    setEditingFlashcard({
      id: flashcard._id,
      term: flashcard.term,
      definition: flashcard.definition,
    });
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-grow p-4 mt-10 lg:mt-0 lg:ml-[300px]">
        <div className="pt-8 flex flex-col lg:flex-row lg:items-center lg:justify-between">
          {/* Flashcard Set Title and Description */}
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {title || "Flashcard Set"}
            </h1>
            <p className="text-gray-600">No description</p>
          </div>

          {/* Buttons for all screens */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center sm:gap-2 mt-4 sm:mt-0">
            {/* Add New Flashcard button */}
            <button
              onClick={handleAddNewFlashcard}
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm py-2 lg:py-3 px-4 rounded transition-colors w-full sm:w-auto"
            >
              Add Flashcard
            </button>

            {/* Study Now button */}
            <button
              onClick={handleStudyNowClick}
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm py-2 lg:py-3 px-4 rounded transition-colors w-full sm:w-auto mt-2 sm:mt-0"
            >
              Study Now
            </button>
          </div>
        </div>

        <hr className="my-4" />
        {/* Flashcards container */}
        <div className="space-y-4">
          {flashcards.map((flashcard, index) => (
            <div
              key={flashcard._id}
              className="bg-white p-4 border rounded-lg shadow-sm"
            >
              {editingFlashcard.id === flashcard._id ? (
                // Edit mode
                <div className="flex flex-col">
                  <input
                    type="text"
                    placeholder="Term"
                    value={editingFlashcard.term}
                    onChange={(e) => handleEditChange("term", e.target.value)}
                    className="w-full p-2 border rounded mb-2"
                  />
                  <textarea
                    placeholder="Definition"
                    value={editingFlashcard.definition}
                    onChange={(e) =>
                      handleEditChange("definition", e.target.value)
                    }
                    className="w-full p-2 border rounded mb-2"
                    rows={3}
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() =>
                        setEditingFlashcard({
                          id: null,
                          term: "",
                          definition: "",
                        })
                      }
                      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition ease-in-out duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSaveFlashcards(setId, flashcard._id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition ease-in-out duration-300"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                // Display mode
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xl font-semibold">{flashcard.term}</p>
                    <p className="text-gray-600">{flashcard.definition}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startEditing(flashcard)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition ease-in-out duration-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteFlashcard(flashcard._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition ease-in-out duration-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddFlashcardPage;
