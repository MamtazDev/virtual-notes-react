import React, { useEffect, useContext } from "react";
import Navbar from "./Navbar";
import { Footer } from "./Footer";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";
import podcastImage from "../assets/undraw_podcast_audience_re_4i5q.svg";
import ImageReadingTime from "../assets/undraw_reading_time_re_phf7 1.png";
import ImageOnlineLearning from "../assets/undraw_online_learning_re_qw08 1.png";
import ImageLearningSketching from "../assets/undraw_learning_sketching_nd4f 1.png";
import { FaChalkboardTeacher, FaBrain, FaBookReader } from "react-icons/fa";
import { motion } from "framer-motion";
import UserContext from "../UserContext";

function Home() {
  const { user, setUser, userPlan, setUserPlan } = useContext(UserContext);
  const navigate = useNavigate();

  const handleButtonClick = () => {
    if (user && user.planId) {
      navigate("/ai-audio-summarizer");
    } else if (user && !user.planId) {
      navigate("/pricing");
    } else {
      navigate("/signup");
    }
  };

  const handleSectionButtonClick = () => {
    if (user && user.planId) {
      navigate("/ai-audio-summarizer");
    } else {
      navigate("/pricing");
    }
  };

  // Animations
  const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 1 } },
  };

  const slideFromRight = {
    initial: { x: 300, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { duration: 1 } },
  };

  const slideFromLeft = {
    initial: { x: -300, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { duration: 1 } },
  };

  // For scroll animations
  const [ref1, inView1] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [ref2, inView2] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [ref3, inView3] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div className="flex flex-col min-h-screen pt-4" {...fadeIn}>
      <div className="bg-transparent px-6 pt-1 border-b border-white">
        <div className="container mx-auto flex flex-col px-4 lg:px-20 ">
          <Navbar />

          {/* Main Content */}
          <div className="container mx-auto px-6 pt-[80px] lg:pt-[140px]">
            {/* Hero Section */}
            <div className="flex flex-col lg:flex-row items-center justify-between mb-16 space-y-8 lg:space-y-0">
              {/* Right Content for Mobile/Tablet */}
              <motion.div className="lg:hidden lg:w-1/2" {...slideFromRight}>
                <img
                  src={podcastImage}
                  alt="Podcast Audience"
                  className="w-full h-auto"
                />
              </motion.div>

              {/* Left Content */}
              <motion.div
                className="lg:w-1/2 text-center lg:text-left"
                {...slideFromRight}
              >
                <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-blue-500">
                  Amplify Your Learning
                </h1>
                <p className="lg:text-md mb-6">
                  Experience the best adaptable tools for students on the market, making learning easier, more accessible, and efficient.
                </p>
                <div className="flex justify-center lg:justify-start space-x-4">
                  <button
                    onClick={handleButtonClick}
                    className="transition duration-300 transform hover:scale-105 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow"
                  >
                    {user ? "Go to Dashboard" : "Get Started Free"}
                  </button>
                  <button
                    onClick={() => navigate("/contact")}
                    className="transition duration-300 transform hover:scale-105 border-2 border-blue-500 hover:bg-blue-500 text-blue-500 hover:text-white font-semibold py-2 px-4 rounded-md shadow"
                  >
                    Contact Us
                  </button>
                </div>
              </motion.div>

              {/* Right Content for Desktop */}
              <motion.div
                className="hidden lg:block lg:w-1/2"
                {...slideFromRight}
              >
                <img
                  src={podcastImage}
                  alt="Podcast Audience"
                  className="w-full h-auto"
                />
              </motion.div>
            </div>

            {/* Features Section */}
            <motion.div
              className="pt-8 pb-16 lg:py-[120px] grid grid-cols-1 md:grid-cols-3 gap-12"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 50,
                damping: 20,
                delayChildren: 0.2,
                staggerChildren: 0.1,
              }}
            >
              <motion.div
                className="flex flex-col items-center text-center space-y-6"
                whileHover={{ scale: 1.05 }}
              >
                <FaChalkboardTeacher className="w-20 h-20 text-blue-500" />
                <h3 className="text-xl font-semibold">
                  Automated Lecture Summaries
                </h3>
                <p className="max-w-lg">
                  Leverage AI to transform lectures into precise key points and
                  summaries for better comprehension.
                </p>
              </motion.div>

              <motion.div
                className="flex flex-col items-center text-center space-y-6"
                whileHover={{ scale: 1.05 }}
              >
                <FaBrain className="w-20 h-20 text-blue-500" />
                <h3 className="text-xl font-semibold">
                  Effortless Comprehension
                </h3>
                <p className="max-w-lg">
                  AI-driven insights for clarity. Concise, structured summaries
                  designed for student mastery.
                </p>
              </motion.div>

              <motion.div
                className="flex flex-col items-center text-center space-y-6"
                whileHover={{ scale: 1.05 }}
              >
                <FaBookReader className="w-20 h-20 text-blue-500" />
                <h3 className="text-xl font-semibold">Master Your Lectures</h3>
                <p className="max-w-lg">
                  Transforming lectures into concise takeaways and detailed
                  summaries for optimal comprehension.
                </p>
              </motion.div>
            </motion.div>
          </div>

          <div className="space-y-20 lg:space-y-20 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 mb-16">
            {/* AI-powered insights section */}
            <motion.div
              className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-16"
              ref={ref1}
              initial="initial"
              animate={inView1 ? "animate" : "initial"}
              variants={slideFromRight}
            >
              <div className="w-full md:w-1/2 mb-4 md:mb-0">
                <img
                  src={ImageLearningSketching}
                  alt="Stay ahead with every lecture"
                  className="mx-auto w-3/4 sm:w-1/2 md:w-full md:max-w-lg h-auto"
                />
              </div>
              <div className="mt-4 md:mt-0 w-full md:w-1/2 text-center md:text-left">
                <p className="text-sm text-gray-500 mb-2">
                  AI-POWERED INSIGHTS
                </p>
                <h1 className="text-2xl md:text-3xl font-bold">
                  Stay Ahead with Every Lecture
                </h1>
                <p className="text-gray-600 mt-2 max-w-lg">
                  Don't miss out on any important details. Our AI listens
                  actively during class lectures and meetings, ensuring you
                  always have the most relevant information at your fingertips.
                </p>
                <button
                  onClick={handleSectionButtonClick}
                  className="bg-blue-500 hover:bg-blue-600 text-white mt-4 px-4 py-2 rounded"
                >
                  Tune In Now
                </button>
              </div>
            </motion.div>

            {/* Smart listening section */}
            <motion.div
              className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-10"
              ref={ref2}
              initial="initial"
              animate={inView2 ? "animate" : "initial"}
              variants={slideFromLeft}
            >
              <div className="w-full md:w-1/2 order-1 md:order-2">
                <img
                  src={ImageOnlineLearning}
                  alt="Effortless comprehension with AI"
                  className="mx-auto w-3/4 sm:w-1/2 md:w-full md:max-w-lg h-auto mb-3"
                />
              </div>
              <div className="mt-4 md:mt-0 text-center md:text-left w-full md:w-1/2 order-2 md:order-1">
                <p className="text-sm text-gray-500 mb-2">SMART LISTENING</p>
                <h1 className="text-2xl md:text-3xl font-bold">
                  Effortless Comprehension with AI
                </h1>
                <p className="text-gray-600 mt-2 max-w-lg">
                  Our advanced AI listens to class lectures and meetings,
                  identifying and highlighting the most crucial storylines. Dive
                  deep with our detailed summaries to ensure you grasp every key
                  topic.
                </p>
                <button
                  onClick={handleSectionButtonClick}
                  className="bg-blue-500 hover:bg-blue-600 text-white mt-4 px-4 py-2 rounded"
                >
                  Get Your Summary
                </button>
              </div>
            </motion.div>

            {/* In-depth summaries section */}
            <motion.div
              className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-10"
              ref={ref3}
              initial="initial"
              animate={inView3 ? "animate" : "initial"}
              variants={slideFromRight}
            >
              <div className="w-full md:w-1/2">
                <img
                  src={ImageReadingTime}
                  alt="Detailed notes in minutes"
                  className="mx-auto w-3/4 sm:w-1/2 md:w-full md:max-w-lg h-auto mb-4"
                />
              </div>
              <div className="mt-4 md:mt-0 text-center md:text-left w-full md:w-1/2">
                <p className="text-sm text-gray-500 mb-2">IN-DEPTH SUMMARIES</p>
                <h1 className="text-2xl md:text-3xl font-bold">
                  Detailed Notes in Minutes
                </h1>
                <p className="text-gray-600 mt-2 max-w-lg">
                  Say goodbye to scribbling notes in a hurry. With AI-powered
                  insights, get comprehensive lecture summaries in a matter of
                  minutes, ensuring you're always in the loop.
                </p>
                <button
                  onClick={handleSectionButtonClick}
                  className="bg-blue-500 hover:bg-blue-600 text-white mt-4 px-4 py-2 rounded"
                >
                  Try it Out
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </motion.div>
  );
}

export default Home;
