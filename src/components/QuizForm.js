import React, { useState } from "react";
import {
  PaperClipIcon,
  QuestionMarkCircleIcon,
  ExclamationIcon,
  UploadIcon,
  ChevronRightIcon,
} from "@heroicons/react/outline";
import { motion } from "framer-motion";

const QuizForm = ({ onGenerateQuiz, onError, error }) => {
  const [files, setFiles] = useState([]);
  const [questionCount, setQuestionCount] = useState(10);
  const [difficulty, setDifficulty] = useState("medium");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!files.length) {
      // onError is a prop function that should be passed from QuizGeneration
      onError("Please upload at least one file to generate the quiz.");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    formData.append("questionCount", questionCount);
    formData.append("difficulty", difficulty);

    await onGenerateQuiz(formData);
  };

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.5 } },
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center "
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.form
        className="w-full max-w-3xl bg-white p-8 rounded-xl shadow-2xl"
        onSubmit={handleSubmit}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Create Your Custom Quiz
        </h2>

        <div className="mb-6">
          <label className="block text-gray-700 text-lg font-semibold mb-2 flex items-center">
            <UploadIcon className="h-6 w-6 mr-2 text-blue-500" />
            Upload Files
          </label>
          <motion.input
            type="file"
            multiple
            onChange={handleFileChange}
            className="block w-full text-md text-gray-700 p-2.5 border rounded-lg bg-gray-50 transition duration-200 ease-in-out focus:ring-blue-500 focus:border-blue-500"
            whileFocus={{ scale: 1.02 }}
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-lg font-semibold mb-2 flex items-center">
            <QuestionMarkCircleIcon className="h-6 w-6 mr-2 text-blue-500" />
            Number of Questions
          </label>
          <motion.select
            value={questionCount}
            onChange={(e) => setQuestionCount(e.target.value)}
            className="block w-full text-md p-2.5 border rounded-lg bg-gray-50 transition duration-200 ease-in-out focus:ring-blue-500 focus:border-blue-500"
            whileFocus={{ scale: 1.02 }}
          >
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </motion.select>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-lg font-semibold mb-2 flex items-center">
            Difficulty Level
          </label>
          <motion.select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="block w-full text-md p-2.5 border rounded-lg bg-gray-50 transition duration-200 ease-in-out focus:ring-blue-500 focus:border-blue-500"
            whileFocus={{ scale: 1.02 }}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </motion.select>
        </div>

        {error && (
          <motion.div
            className="bg-red-100 border-l-4 border-red-400 text-red-700 px-4 py-3 rounded relative mb-5"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <strong className="font-bold">
              <ExclamationIcon className="h-6 w-6 inline mr-2" />
            </strong>
            <span className="block sm:inline">{error}</span>
          </motion.div>
        )}

        <motion.button
          type="submit"
          className="flex items-center justify-center w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
        >
          Start Quiz
          <ChevronRightIcon className="ml-2 h-5 w-5" />
        </motion.button>
      </motion.form>
    </motion.div>
  );
};

export default QuizForm;
