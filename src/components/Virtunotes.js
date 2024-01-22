import React, { useState, useContext, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  XIcon,
  ClipboardCopyIcon,
  MailIcon,
  SaveIcon,
  ClockIcon,
  RefreshIcon,
  ArrowCircleRightIcon,
  FilterIcon,
  ChevronDownIcon,
  DotsVerticalIcon,
} from "@heroicons/react/solid";
import Sidebar from "./Sidebar";
import UserContext from "../UserContext";
import axios from "axios";
import Pagination from "./Pagination";
import { API_URL } from "../config/config";
import loader from "../assets/Spinner-1s-200px.svg";

const EduEchoMain = () => {
  const [recording, setRecording] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const mediaRecorder = useRef(null);
  const [audioPlaybackURL, setAudioPlaybackURL] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSummaryOverlay, setShowSummaryOverlay] = useState(false);
  const [dropdownIndex, setDropdownIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const summariesPerPage = 5;
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedSummariesIds, setSelectedSummariesIds] = useState(new Set());
  const [selectedSummariesState, setSelectedSummariesState] = useState({});
  const dropdownRef = useRef(null);
  const buttonRefs = useRef([]);
  const [timer, setTimer] = useState(null);

  const {
    user,
    saveSummary,
    savedSummaries,
    fetchSavedSummaries,
    deleteSavedSummary,
    setSavedSummaries,
  } = useContext(UserContext);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });

      mediaRecorder.current = recorder;
      mediaRecorder.current.audioChunks = [];

      mediaRecorder.current.ondataavailable = (event) => {
        mediaRecorder.current.audioChunks.push(event.data);
      };

      mediaRecorder.current.onstop = handleAudioProcessing;

      mediaRecorder.current.start();
      setRecording(true);

      if (timer) {
        clearTimeout(timer);
      }

      startTimer();

      setStartTime(new Date());
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      setRecording(false);

      setEndTime(new Date());
      // if (timer) {
      clearTimeout(timer);
      // }
    }
  };

  //-----
  const startTimer = () => {
    const timerId = setTimeout(() => {
      stopRecording();
      console.log("Function triggered after 1 hour and 20 minutes");
    }, 1 * 60 * 60 * 1000 + 20 * 60 * 1000);

    setTimer(timerId);
  };

  useEffect(() => {
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [timer]);

  // ------
  const handleAudioProcessing = async () => {
    if (mediaRecorder.current) {
      const audioBlob = new Blob(mediaRecorder.current.audioChunks, {
        type: "audio/webm",
      });
      setAudioPlaybackURL(URL.createObjectURL(audioBlob));

      const formData = new FormData();
      formData.append("audio", audioBlob);

      try {
        setLoading(true);

        let response = await fetch(`${API_URL}/api/summary/upload-audio`, {
          method: "POST",
          body: formData,
        });
        if (!response.ok) {
          throw new Error(`Error uploading audio: ${response.statusText}`);
        }
        const uploadData = await response.json();
        const audioID = uploadData.audioID;

        const userId = user.id;

        response = await fetch(`${API_URL}/api/summary/transcribe-audio`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ audioID, userId }),
        });
        if (!response.ok) {
          throw new Error(`Error transcribing audio: ${response.statusText}`);
        }
        const summaryData = await response.json();

        if (!summaryData.summary) {
          throw new Error("Summary could not be generated.");
        }

        const summaryLines = summaryData.summary.split("\n");

        const topic = summaryLines[0].replace(/^Topic:\s*/, "");
        const points = summaryLines.slice(1);

        setSummary({
          topic: topic,
          points: points,
        });
        setShowSummaryOverlay(true);
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    } else {
      handleError(new Error("MediaRecorder is not initialized."));
    }
  };

  useEffect(() => {
    const initializeSummaries = async () => {
      await fetchSavedSummaries();
      initializeSelectedState();
    };

    initializeSummaries();
  }, []);

  const initializeSelectedState = () => {
    const initialSelectedState = savedSummaries.reduce((acc, summary) => {
      acc[summary._id] = false;
      return acc;
    }, {});
    setSelectedSummariesState(initialSelectedState);
  };

  const pageCount = Math.ceil(savedSummaries.length / summariesPerPage);
  const indexOfLastSummary = currentPage * summariesPerPage;
  const indexOfFirstSummary = indexOfLastSummary - summariesPerPage;
  const currentSummaries = savedSummaries.slice(
    indexOfFirstSummary,
    indexOfLastSummary
  );

  const closeErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage("");
  };

  const formatTime = (date) =>
    date
      ? date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
      : "--:--";

  const getDuration = () => {
    if (startTime && endTime) {
      let difference = endTime.getTime() - startTime.getTime();

      difference = difference < 0 ? 0 : difference;

      let hoursDifference = Math.floor(difference / 1000 / 60 / 60);
      difference -= hoursDifference * 1000 * 60 * 60;

      let minutesDifference = Math.floor(difference / 1000 / 60);
      let secondsDifference = Math.floor((difference % (1000 * 60)) / 1000);

      return `${hoursDifference}hr ${minutesDifference}min ${secondsDifference}sec`;
    }
    return "--:--";
  };

  const handleSaveSummary = async () => {
    if (!summary) return;

    const newSummary = {
      ...summary,
      date: new Date().toISOString(),
    };

    try {
      setLoading(true);
      await saveSummary(newSummary);
      setShowSummaryOverlay(false);
      fetchSavedSummaries();
    } catch (error) {
      console.error("Error submitting summary:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSelectedSummaries = async () => {
    const idsToDelete = Object.keys(selectedSummariesState).filter(
      (id) => selectedSummariesState[id]
    );
    for (let summaryId of idsToDelete) {
      await deleteSavedSummary(summaryId);
    }
    await fetchSavedSummaries();
    setIsSelectMode(false);
    setSelectedSummariesState({});
    initializeSelectedState();
  };

  function toggleSummary(index) {
    setExpandedIndex(expandedIndex === index ? null : index);
  }

  const handleCloseSummaryOverlay = () => {
    setShowSummaryOverlay(false);
    setSummary("");
  };

  const handleError = (error) => {
    console.error("Error:", error);

    console.log("Received error message:", error.message);

    let userFriendlyMessage =
      "We couldn't understand the audio. Please ensure clear audio quality.";
    if (
      error.message.includes("Transcription is empty") ||
      error.message.includes("not understandable")
    ) {
      userFriendlyMessage =
        "We couldn't understand the audio. Please ensure clear audio quality.";
      console.log("Setting user-friendly message for transcription error");
    }

    setErrors({
      hasError: true,
      message: error.message,
      userFriendlyMessage,
    });
    setShowErrorModal(true);
  };

  const cleanPoint = (point) => {
    return point.replace(/^[-•\d\s.]+/, "");
  };

  const getActionButtonLabel = () => {
    const isAnySelected = Object.values(selectedSummariesState).some(
      (value) => value
    );
    if (isSelectMode && !isAnySelected) {
      return "Deselect";
    } else if (isSelectMode && isAnySelected) {
      return "Delete";
    }
    return "Select";
  };

  const handleActionButtonClick = () => {
    if (
      isSelectMode &&
      !Object.values(selectedSummariesState).some((value) => value)
    ) {
      setIsSelectMode(false);
      setSelectedSummariesState((prevState) => {
        return Object.keys(prevState).reduce((acc, key) => {
          acc[key] = false;
          return acc;
        }, {});
      });
    } else if (
      isSelectMode &&
      Object.values(selectedSummariesState).some((value) => value)
    ) {
      handleDeleteSelectedSummaries();
    } else {
      setIsSelectMode(true);
    }
  };

  const handleSummarySelection = (id) => {
    setSelectedSummariesState((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleExpandClick = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="flex min-h-screen bg-gray-100 items-center justify-center lg:items-start">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-6 lg:ml-[250px] lg:max-w-[1200px]">
        <div className="mt-24 md:mt-40"></div>

        {/* Title Section */}
        <div className="text-center space-y-6 mb-8">
          <h1 className="text-4xl font-extrabold text-blue-600">
            Class Summarizer
          </h1>
          <p className="text-md text-gray-600">
            Ensure clear audio when using our tool for the best.
          </p>
        </div>

        {/* Timer Section */}
        <section className="mb-2 py-6 from-blue-500 via-blue-600 to-blue-700">
          <div className="container mx-auto px-4 max-w-screen-lg">
            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 justify-center">
              {/* Start Time Card */}
              <div className="flex flex-col items-center justify-center w-full sm:w-1/3 lg:w-1/4 bg-white shadow-xl p-6 rounded-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 mb-4 sm:mb-0">
                <ClockIcon className="h-8 w-8 text-blue-500 mb-3" />
                <h4 className="font-semibold text-blue-500 mb-2">Start Time</h4>
                <span className="font-bold text-lg">
                  {formatTime(startTime)}
                </span>
              </div>

              {/* End Time Card */}
              <div className="flex flex-col items-center justify-center w-full sm:w-1/3 lg:w-1/4 bg-white shadow-xl p-6 rounded-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 mb-4 sm:mb-0">
                <ArrowCircleRightIcon className="h-8 w-8 text-blue-500 mb-3" />
                <h4 className="font-semibold text-blue-500 mb-2">End Time</h4>
                <span className="font-bold text-lg">{formatTime(endTime)}</span>
              </div>

              {/* Duration Card */}
              <div className="flex flex-col items-center justify-center w-full sm:w-1/3 lg:w-1/4 bg-white shadow-xl p-6 rounded-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
                <ClockIcon className="h-8 w-8 text-blue-500 mb-3" />
                <h4 className="font-semibold text-blue-500 mb-2">Duration</h4>
                <span className="font-bold text-lg">{getDuration()}</span>
              </div>
            </div>
          </div>
        </section>

        <main className="container mx-auto px-4 space-y-12 py-10">
          {/* Controls Section */}
          <section className="flex flex-col items-center  w-full max-w-3xl mx-auto">
            <div className="space-y-4 mb-11 pb-5">
              {recording ? (
                <button
                  className="bg-red-500 text-white px-10 py-5 rounded-full shadow-lg transform hover:scale-105 hover:bg-red-600 transition-all duration-200 "
                  onClick={stopRecording}
                >
                  Stop Listening
                </button>
              ) : (
                <button
                  className="bg-blue-500 text-white px-10 py-5 rounded-full shadow-lg transform hover:scale-105 hover:bg-blue-600 transition-all duration-200"
                  onClick={startRecording}
                >
                  Start Listening
                </button>
              )}
            </div>

            {/* Error Modal */}
            {showErrorModal && (
              <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-xl">
                  <h3 className="text-xl font-semibold text-red-500 mb-4">
                    Error
                  </h3>
                  <p className="text-gray-700 mb-4">
                    {errors.userFriendlyMessage}
                  </p>
                  <button
                    onClick={closeErrorModal}
                    className="bg-blue-500 text-white px-5 py-2 rounded-lg shadow-lg transform transition hover:bg-blue-600"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {/* Loading Spinner while Processing */}
            {loading && (
              <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-[2px]">
                <div className="bg-white opacity-25 w-full h-full absolute "></div>
                {/* <RefreshIcon className="h-20 w-20 text-[#2563eb] animate-spin z-10" /> */}
                <img src={loader} alt="" />
              </div>
            )}

            {/* Summary Pop-up */}
            {showSummaryOverlay && summary && (
              <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-black opacity-50 w-full h-full absolute"></div>
                <div className="w-2/3 md:w-1/3 bg-white p-6 shadow-2xl rounded-lg relative z-10 overflow-hidden">
                  <div className="flex items-start justify-between mb-4">
                    <h2 className="font-bold text-xl">Summary</h2>
                    <button onClick={handleCloseSummaryOverlay}>
                      <XIcon className="h-6 w-6 text-gray-400 hover:text-gray-500" />
                    </button>
                  </div>
                  {/* Summary content container */}
                  <div className="text-left mb-6 max-h-80 overflow-auto">
                    {summary.points.map((point, index) => (
                      <p
                        key={index}
                        className="mb-3 text-gray-700 leading-relaxed"
                      >
                        {point}
                      </p>
                    ))}
                  </div>
                  <div className="flex justify-end space-x-4">
                    <button
                      className="flex items-center justify-center bg-blue-500 text-white px-5 py-2 rounded-lg shadow-lg transform transition hover:bg-blue-600 hover:scale-105"
                      onClick={handleSaveSummary}
                    >
                      <SaveIcon className="h-5 w-5 mr-2" />
                      Save
                    </button>
                    <button
                      className="flex items-center justify-center bg-red-500 text-white px-5 py-2 rounded-lg shadow-lg transform transition hover:bg-red-600 hover:scale-105"
                      onClick={() => setSummary("")}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Saved Summaries Section */}
            {user && savedSummaries.length > 0 && (
              <div className="w-full p-8 bg-white rounded-lg mt-12 shadow-lg border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-semibold text-gray-800">
                    Saved Summaries
                  </h2>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={handleActionButtonClick}
                  >
                    {getActionButtonLabel()}
                  </button>
                </div>

                {currentSummaries.map((item, index) => (
                  <div key={item.id} className="mb-6">
                    {isSelectMode && (
                      <input
                        type="checkbox"
                        checked={selectedSummariesState[item._id] || false}
                        onChange={() => handleSummarySelection(item._id)}
                        className="form-checkbox h-4 w-4 text-blue-600"
                      />
                    )}
                    <div
                      className={`rounded-lg overflow-hidden transition-shadow duration-300 hover:shadow-xl ${
                        expandedIndex === index ? "bg-gray-100" : "bg-gray-100"
                      }`}
                      onClick={() => handleExpandClick(index)}
                    >
                      <div
                        className="p-4 cursor-pointer"
                        onClick={() => toggleSummary(index)}
                      >
                        <div className="flex items-center justify-between">
                          {" "}
                          {/* Adjusted margin bottom here */}
                          <div className="flex items-center">
                            <span
                              className={`mr-2 sm:mr-4 transform ${
                                expandedIndex === index ? "rotate-180" : ""
                              } transition-transform duration-300 text-blue-600`}
                            >
                              <ChevronDownIcon className="h-5 w-5" />
                            </span>
                            <p className="text-md sm:text-lg text-gray-700 flex-grow font-semibold">
                              {item.topic ? item.topic : "Topic not provided"}{" "}
                              {/* Applied font-semibold */}
                            </p>
                          </div>
                          <div className="text-xs sm:text-sm text-gray-600">
                            {new Date(item.date).toLocaleDateString()}{" "}
                          </div>
                        </div>
                        {expandedIndex === index && (
                          <div className="mt-4 bg-gray-100 p-4 rounded">
                            {/* Key Points Section */}
                            <div className="font-semibold mb-2">
                              Key Points:
                            </div>
                            <ul className="list-disc ml-5">
                              {item.points.map((point, idx) => {
                                if (point.trim().startsWith("Key Points:")) {
                                  return null;
                                }

                                if (point.trim().startsWith("Summary:")) {
                                  return null;
                                }

                                const cleanedPoint = cleanPoint(point);
                                return cleanedPoint ? (
                                  <li key={idx} className="mb-2 text-gray-600">
                                    {cleanedPoint}
                                  </li>
                                ) : null;
                              })}
                            </ul>
                            {/* Summary Content */}
                            <div className="font-semibold mt-6 mb-2">
                              Summary:
                            </div>
                            <p className="text-gray-600">
                              {item.points
                                .find((point) => point.startsWith("Summary:"))
                                ?.substring("Summary:".length)
                                .trim() || "No summary provided."}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <Pagination
                  currentPage={currentPage}
                  setPage={setCurrentPage}
                  totalPages={pageCount}
                />
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default EduEchoMain;
