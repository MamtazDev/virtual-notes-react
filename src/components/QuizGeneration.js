import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import QuizForm from "./QuizForm";
import { motion } from "framer-motion";
import { API_URL } from "../config/config";

const QuizGeneration = () => {
  const navigate = useNavigate();
  const [attemptedGeneration, setAttemptedGeneration] = useState(false);
  const [files, setFiles] = useState([]);
  const [questionCount, setQuestionCount] = useState(10);
  const [difficulty, setDifficulty] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const generateQuiz = async (formData) => {
    setIsLoading(true);
    setError(""); // Clear any previous errors

    try {
      const response = await fetch(`${API_URL}/api/quiz/generate-quiz`, {
        method: "POST",
        body: formData,
        credentials: "include", // Make sure credentials include is set if your API requires it
      });

      const data = await response.json(); // Get the response data

      if (!response.ok) {
        // Handle different types of errors based on status codes
        let userFriendlyError =
          data.error || "Could not generate the quiz, please try again.";
        if (response.status === 401) {
          userFriendlyError = "You do not have permission to generate a quiz.";
        } else if (response.status === 400) {
          userFriendlyError =
            "The provided information is not sufficient to create a quiz.";
        }
        setError(userFriendlyError);
      } else if (data.questions && data.questions.length > 0) {
        navigate("/quiz-display", { state: { questions: data.questions } });
      } else {
        setError("No questions were generated, please try again.");
      }
    } catch (networkError) {
      setError(
        "There was a network error, please check your internet connection."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (event) => {
    setFiles([...event.target.files]);
  };

  const handleQuizError = (message) => {
    setError(message);
  };

  const loaderVariants = {
    animationOne: {
      x: [-20, 20],
      y: [0, -30],
      transition: {
        x: {
          yoyo: Infinity,
          duration: 0.5,
        },
        y: {
          yoyo: Infinity,
          duration: 0.25,
          ease: "easeOut",
        },
      },
    },
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6 lg:pl-[250px]">
        {isLoading && (
          <motion.div
            className="fixed inset-0 bg-gray-200 bg-opacity-75 flex justify-center items-center"
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="loader"
              variants={loaderVariants}
              animate="animationOne"
            />
          </motion.div>
        )}
        <QuizForm
          onGenerateQuiz={generateQuiz}
          onFileChange={handleFileChange}
          error={error}
          onError={handleQuizError} // Pass this function as a prop to QuizForm
        />
      </div>
    </div>
  );
};

export default QuizGeneration;
