import React, { useState, useEffect, useRef, Fragment, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { PlusIcon, ArrowLeftIcon, BookOpenIcon } from "@heroicons/react/solid";
import Sidebar from "./Sidebar";
import UserContext from "../UserContext";


import { Dialog, Transition } from '@headlessui/react'
import { API_URL } from "../config/config";
// import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

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

  const [open, setOpen] = useState(false)

  const cancelButtonRef = useRef(null)


  // console.log("location.state", location.state)
  // console.log("Flash Card setId from location.state:", location.state.setId)


  useEffect(() => {}, [flashcards])

  useEffect(() => {
    const fetchFlashcardSetDetails = async () => {
      if (setId) {
        try {
          const response = await axios.get(
            `API_URL/api/flashcard/sets/${setId}`,
            { withCredentials: true }
          );
          if (response.data) {

            // console.log("response.data: ", response.data)

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
    setOpen(true)
    // const newFlashcardData = { term: "", definition: "" };
    // await addNewFlashcard(newFlashcardData, setId);

    // // Add a new flashcard box at the very top
    // setFlashcards((currentFlashcards) => [
    //   newFlashcardData,
    //   ...currentFlashcards,
    // ]);
  };


  const addNewFlahCard = async() => {
    const newFlashcardData = { term: "Dihan", definition: `odules\@babel\parser\lib\index.js:13100:10)
    at FlowParserMixin.parseStatementContent (H:\VIrtual Notes\virtual-notes-react\node_modules\@babel\parser\lib\index.js:12683:23)
    at FlowParserMixin.parseStatementLike (H:\VIrtual Notes\virtual-notes-react\node_modules\@babel\parser\lib\index.js:12588:17)` };
    await addNewFlashcard(newFlashcardData, setId);

    // Add a new flashcard box at the very top
    setFlashcards((currentFlashcards) => [
      newFlashcardData,
      ...currentFlashcards,
    ]);
    setOpen(false)
  }


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
      const url = `${API_URL}/api/flashcard/flashcard-sets/${setId}/flashcards/${flashcardId}`;
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

    console.log("flashcard:", flashcard)

    setEditingFlashcard({
      id: flashcard._id,
      term: flashcard.term,
      definition: flashcard.definition,
    });
    setOpen(true)
  };

  const editHandler = (flashcard) => {

    startEditing(flashcard)
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      <Sidebar />



      <div className="flex-grow p-4 mt-10 lg:mt-0 lg:ml-[300px]">

        <Transition.Root show={open} as={Fragment}>
          <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                      <div className="sm:flex sm:items-start">
                        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                          <PlusIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                        </div>
                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                          <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                            Add New FlashCard here
                          </Dialog.Title>
                          <div className="mt-2">
                            <p className="text-sm text-gray-500">
                              Are you sure you want to deactivate your account? All of your data will be permanently
                              removed. This action cannot be undone.
                            </p>

                            <input
                              type="text"
                              placeholder="Term"
                              value={editingFlashcard.term}
                              // onChange={(e) => handleEditChange("term", e.target.value)}
                              className="w-full p-2 border rounded mb-2"
                            />
                            <textarea
                              placeholder="Definition"
                              value={editingFlashcard.definition}
                              // onChange={(e) =>
                              //   handleEditChange("definition", e.target.value)
                              // }
                              className="w-full p-2 border rounded mb-2"
                              rows={3}
                            />

                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                      <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                        onClick={() => {
                          
                          setEditingFlashcard({
                            id: null,
                            term: "",
                            definition: "",
                          })
                          
                          addNewFlahCard()}}
                      >
                        Deactivate
                      </button>
                      <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                        onClick={() => {
                          setEditingFlashcard({
                            id: null,
                            term: "",
                            definition: "",
                          })
                          setOpen(false)}}
                        ref={cancelButtonRef}
                      >
                        Cancel
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
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
              <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xl font-semibold">{flashcard.term}</p>
                    <p className="text-gray-600">{flashcard.definition}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => editHandler(flashcard)}
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
              {/* {editingFlashcard.id === flashcard._id ? (
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
              )} */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddFlashcardPage;
