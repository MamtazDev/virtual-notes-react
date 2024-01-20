import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DocumentAddIcon,
  PencilAltIcon,
  ChevronLeftIcon,
  CheckCircleIcon,
  ExclamationIcon,
} from "@heroicons/react/solid";
import Sidebar from "./Sidebar";
import Spinner from "./Spinner";
import { motion } from "framer-motion";

const CreateFlashcardsSet = () => {
  const navigate = useNavigate();
  const [flashcardSetName, setFlashcardSetName] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [noteContent, setNoteContent] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleStartFromScratch = () => {
    setSelectedOption("scratch");
    setFile(null);
    setError("");
  };

  const handleCreateFromMaterial = () => {
    setSelectedOption("material");
    setNoteContent("");
    setError("");
  };

  const handleFileUpload = (event) => {
    setFile(event.target.files[0]);
  };

  const isOptionSelected = (optionName) => selectedOption === optionName;

  const handleContinue = async () => {
    // Error checks before starting the async operation
    if (!flashcardSetName.trim()) {
      setErrorMessage("Please provide a name for your flashcard set.");
      return;
    }

    if (selectedOption === "material" && !file) {
      setErrorMessage(
        "Please upload a file to create flashcards from material."
      );
      return;
    }

    if (selectedOption === "scratch" && !noteContent.trim()) {
      setErrorMessage("No class materials provided.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      let body = new FormData();
      body.append("setName", flashcardSetName);

      if (selectedOption === "material" && file) {
        body.append("materialFile", file);
      } else if (selectedOption === "scratch") {
        body.append("materialText", noteContent);
      }

      const generateResponse = await fetch(
        "http://localhost:5000/api/flashcard/generate-flashcards",
        {
          method: "POST",
          credentials: "include",
          body: body,
        }
      );

      if (!generateResponse.ok) {
        const generatedData = await generateResponse.json();
        throw new Error(
          generatedData.message || "Failed to generate flashcards."
        );
      }

      const generatedData = await generateResponse.json();
      const saveResponse = await fetch(
        "http://localhost:5000/api/flashcard/save-flashcards",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: flashcardSetName,
            description: "",
            flashcards: generatedData.flashcards,
          }),
        }
      );

      if (!saveResponse.ok) {
        const saveResponseData = await saveResponse.json();
        throw new Error(
          saveResponseData.message || "Failed to save flashcards."
        );
      }

      const saveResponseData = await saveResponse.json();
      if (saveResponseData.setId && saveResponseData.flashcards) {
        navigate("/flashcard-display", {
          state: {
            setId: saveResponseData.setId,
            flashcards: saveResponseData.flashcards,
            title: flashcardSetName,
          },
        });
      } else {
        throw new Error("Invalid response received from the server.");
      }
    } catch (error) {
      console.error("Error in the flashcard process:", error);
      let message = "There was an issue with flashcard processing.";
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        message = error.response.data.message;
      } else if (error.message) {
        message = error.message;
      }
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6 flex justify-center">
        <div className="w-full max-w-4xl space-y-6 mt-16">
          {/* <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-500 hover:text-blue-700 transition-colors"
          >
            <ChevronLeftIcon className="h-5 w-5 mr-2" />
            Back
  </button> */}
          <div>
            <h1 className="text-4xl font-bold text-gray-800">
              Create a Flashcards Set
            </h1>
            <p className="text-gray-600 mt-2">
              Enhance your study sessions with custom flashcards. Simply provide
              your material and choose whether to start from scratch or upload
              content directly.
            </p>
          </div>
          <div className="mb-6">
            <label
              htmlFor="flashcardSetName"
              className="block text-lg font-semibold mb-1"
            >
              Name Your Flashcards Set
            </label>
            <input
              id="flashcardSetName"
              type="text"
              placeholder="Study"
              value={flashcardSetName}
              onChange={(e) => setFlashcardSetName(e.target.value)}
              className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-3">
              Choose an Option
            </label>
            <div className="flex gap-6">
              <OptionCard
                icon={<PencilAltIcon className="h-10 w-10 text-blue-600" />}
                title="Start From Scratch"
                selected={isOptionSelected("scratch")}
                onSelect={handleStartFromScratch}
              />
              <OptionCard
                icon={<DocumentAddIcon className="h-10 w-10 text-blue-600" />}
                title="Create From Material"
                selected={isOptionSelected("material")}
                onSelect={handleCreateFromMaterial}
              />
            </div>
          </div>
          {isOptionSelected("scratch") && (
            <div className="mb-6">
              <label
                htmlFor="noteContent"
                className="block text-lg font-semibold mb-1"
              >
                Material
              </label>
              <textarea
                id="noteContent"
                rows="4"
                placeholder="Enter material for flashcards here..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
          )}
          {isOptionSelected("material") && (
            <div className="mb-6">
              <label
                htmlFor="fileUpload"
                className="block text-lg font-semibold mb-1"
              >
                Upload Material
              </label>
              <input
                id="fileUpload"
                type="file"
                onChange={handleFileUpload}
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              />
              {file && <span className="block mt-2">{file.name}</span>}
            </div>
          )}
          {isLoading && <Spinner />}

          {errorMessage && (
            <motion.div
              className="bg-red-100 border-l-4 border-red-400 text-red-700 px-4 py-3 rounded relative mb-5"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              <strong className="font-bold">
                <ExclamationIcon className="h-6 w-6 inline mr-2" />
              </strong>
              <span className="block sm:inline">{errorMessage}</span>
            </motion.div>
          )}

          {flashcardSetName && (
            <button
              onClick={handleContinue}
              disabled={isLoading}
              className="px-10 py-3 bg-blue-600 text-white rounded-full shadow-sm hover:bg-blue-700 transition-colors text-lg font-semibold"
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const OptionCard = ({ icon, title, selected, onSelect }) => (
  <div
    className={`flex-1 p-4 bg-white rounded-lg border shadow-md flex justify-between items-center ${
      selected ? "ring ring-blue-300" : ""
    }`}
    onClick={onSelect}
  >
    <div className="flex items-center">
      {icon}
      <span className="text-lg font-semibold ml-3">{title}</span>
    </div>
    {selected && <CheckCircleIcon className="w-6 h-6 text-green-500" />}
  </div>
);

export default CreateFlashcardsSet;
