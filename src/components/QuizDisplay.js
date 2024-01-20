import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  CheckIcon,
  XIcon,
  ExclamationIcon,
} from "@heroicons/react/solid";
import { motion } from "framer-motion";

const QuizDisplay = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const questions = location.state?.questions || [];
  const [selectedOptions, setSelectedOptions] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleOptionSelect = (option) => {
    setSelectedOptions({ ...selectedOptions, [currentQuestionIndex]: option });
    setError("");
  };

  const handleNextQuestion = () => {
    if (selectedOptions[currentQuestionIndex] === undefined) {
      setError("Please select an option before proceeding.");
      return;
    }

    setError("");
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      submitTest();
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
    setError("");
  };

  const submitTest = () => {
    setTestSubmitted(true);
  };

  const isOptionSelected = (option) => {
    return selectedOptions[currentQuestionIndex] === option;
  };

  const cleanOptionText = (option) => {
    return option.replace(/\s*Correct$/, "");
  };

  const currentQuestion = questions[currentQuestionIndex] || {};
  const questionText = currentQuestion.question
    ? currentQuestion.question.replace(/^Question:\s*/, "")
    : "Loading question...";

  const formatOptionsWithPrefix = (options) => {
    const prefixes = ["A", "B", "C", "D"];
    return options.map((option, index) => {
      const cleanOption = option.replace(/^[A-D]\.\s+/, "");
      return `${prefixes[index]}. ${cleanOption}`;
    });
  };

  const formattedOptions = Array.isArray(currentQuestion.options)
    ? formatOptionsWithPrefix(currentQuestion.options)
    : [];

  if (testSubmitted) {
    return (
      <TestReview questions={questions} selectedOptions={selectedOptions} />
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6 lg:pl-[250px]">
        {/* Question and Options */}
        <div
          className="bg-white rounded-md shadow-md mx-auto p-6 mt-[120px]"
          style={{ maxWidth: "800px" }}
        >
          <div className="text-2xl font-bold mb-4">
            {`${currentQuestionIndex + 1}. ${questionText}`}{" "}
          </div>

          <div className="options space-y-4">
            {formattedOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionSelect(option)}
                className={`w-full text-left p-4 text-lg font-medium rounded-lg border ${
                  isOptionSelected(option)
                    ? "border-blue-500 bg-blue-100"
                    : "border-gray-300"
                }`}
              >
                {cleanOptionText(option)}
              </button>
            ))}
          </div>

          {/* Error message display with matched width */}
          {error && (
            <motion.div
              className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mt-4 mb-4 rounded mx-auto"
              style={{ maxWidth: "800px" }}
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              <ExclamationIcon className="h-5 w-5 inline mr-2" />
              {error}
            </motion.div>
          )}

          {/* Navigation and Explain Buttons */}
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
              className="text-xl px-6 py-2 rounded-lg border border-gray-300 hover:border-blue-500 hover:text-blue-500 hover:shadow-lg transition ease-in-out duration-300"
              aria-label="Previous question"
            >
              <ChevronLeftIcon className="h-6 w-6" />
            </button>
            <button
              className="text-xl p-2 rounded-full border border-gray-300 hover:border-blue-500 hover:bg-blue-100 transition ease-in-out duration-300"
              aria-label="Explain Answer"
            >
              <EyeIcon className="h-6 w-6" />
            </button>
            {currentQuestionIndex === questions.length - 1 ? (
              <button
                onClick={submitTest}
                className="text-xl px-6 py-2 rounded-lg border border-gray-300 hover:border-blue-500 hover:text-blue-500 hover:shadow-lg transition ease-in-out duration-300"
                aria-label="Submit Test"
              >
                Submit Test
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="text-xl px-6 py-2 rounded-lg border border-gray-300 hover:border-blue-500 hover:text-blue-500 hover:shadow-lg transition ease-in-out duration-300"
                aria-label="Next question"
              >
                <ChevronRightIcon className="h-6 w-6" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const TestReview = ({ questions, selectedOptions }) => {
  const renderOptionWithPrefix = (option, index) => {
    const prefixes = ["A", "B", "C", "D"];
    const cleanOption = option.replace(/^[A-D]\.\s*/, "");
    return (
      <span>
        <span className="font-bold mr-2">{prefixes[index]}.</span>
        {cleanOption}
      </span>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-grow p-4 mt-16 sm:mt-16 md:mt-10 lg:mt-0 lg:p-8 lg:ml-[250px]">
        <div className="bg-white rounded-lg shadow-lg mx-auto p-8 w-full lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Review Your Test
          </h2>
          {questions.map((question, qIndex) => {
            const userAnswer = selectedOptions[qIndex];
            const userAnswerLetter = userAnswer?.charAt(0);
            const isCorrect = question.correctAnswer === userAnswerLetter;

            return (
              <div key={`question-${qIndex}`} className="mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">
                    {`${qIndex + 1}. `}
                    {question.question.replace(/^Question:\s*/, "") ||
                      "Question text missing"}
                  </span>
                  {isCorrect ? (
                    <CheckIcon className="h-6 w-6 text-green-500" />
                  ) : (
                    <XIcon className="h-6 w-6 text-red-500" />
                  )}
                </div>
                <ul className="mt-4 list-none space-y-2">
                  {question.options.map((option, oIndex) => {
                    const optionLetter = option.charAt(0);
                    const isSelected = userAnswerLetter === optionLetter;
                    const isOptionCorrect =
                      question.correctAnswer === optionLetter;

                    let optionStyles = "p-2 rounded-md ";
                    if (isSelected) {
                      optionStyles += isCorrect ? "bg-green-100" : "bg-red-100";
                    }
                    if (isOptionCorrect) {
                      optionStyles += " bg-green-100";
                    } else {
                      optionStyles += " bg-gray-100";
                    }

                    return (
                      <li
                        key={`option-${qIndex}-${oIndex}`}
                        className={optionStyles}
                      >
                        {isSelected && !isCorrect && (
                          <XIcon className="h-4 w-4 text-red-500 inline-block mr-2" />
                        )}
                        {isOptionCorrect && !isSelected && (
                          <CheckIcon className="h-4 w-4 text-green-500 inline-block mr-2" />
                        )}
                        {renderOptionWithPrefix(option, oIndex)}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuizDisplay;
