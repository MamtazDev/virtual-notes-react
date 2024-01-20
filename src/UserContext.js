import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [planId, setPlanId] = useState(null);
  const [summaries, setSummaries] = useState([]);
  const [savedSummaries, setSavedSummaries] = useState([]);
  const [isSubscriptionActive, setIsSubscriptionActive] = useState(false);
  const [selectedSummariesState, setSelectedSummariesState] = useState({});

  const [flashcardSets, setFlashcardSets] = useState([]);
  const [flashcards, setFlashcards] = useState([]);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await checkAuth();
      } catch (error) {
        console.error("Error during initial auth check:", error);
      }
    };
    initializeAuth();
  }, []);

  const initializeUserData = async () => {
    await fetchSavedSummaries();
    await fetchFlashcardSets();
    await fetchSavedSummaries();
  };

  const logoutUser = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/user/logout",
        {},
        { withCredentials: true }
      );

      setUser(null);
      setIsAuthenticated(false);
      setPlanId(null);
      setIsSubscriptionActive(false);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const refreshToken = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/refresh-token",
        {},
        { withCredentials: true }
      );
      if (response.data.success) {
        await checkAuth();
      } else {
        logoutUser();
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      logoutUser();
    }
  };

  const handleSaveFlashcards = async (setId) => {
    // Assuming you have a way to determine the setId for the current set of flashcards
    if (!setId) {
      console.error("setId is not defined");
      return;
    }

    const url = `http://localhost:5000/api/flashcard/flashcard-sets/${setId}`;

    try {
      // Send the entire array of flashcards to the backend
      const response = await axios.put(
        url,
        { flashcards },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        // Here you could set a state to show a success message or perform other actions
      }
    } catch (error) {
      console.error("Error saving flashcards:", error);
    }
  };

  const addNewFlashcard = async (newFlashcardData, setId) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/flashcard/flashcard-sets/${setId}/flashcards`,
        newFlashcardData,
        { withCredentials: true }
      );
      if (response.data && response.data.flashcards) {
        setFlashcards(response.data.flashcards);
      }
    } catch (error) {
      console.error("Error adding new flashcard:", error);
    }
  };

  const deleteFlashcard = async (flashcardId, setId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/flashcard/flashcard-sets/${setId}/flashcards/${flashcardId}`,
        { withCredentials: true }
      );
      if (response.data && response.data.flashcards) {
        setFlashcards(response.data.flashcards);
      }
    } catch (error) {
      console.error("Error deleting flashcard:", error);
    }
  };

  const fetchFlashcardSets = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/flashcard/flashcard-sets",
        {
          withCredentials: true,
        }
      );
      if (response.data && response.data.flashcardSets) {
        setFlashcardSets(response.data.flashcardSets);
      }
    } catch (error) {
      console.error("Error fetching flashcard sets:", error);
    }
  };

  const deleteFlashcardSet = async (setId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/flashcard/flashcard-sets/${setId}`,
        { withCredentials: true }
      );
      if (response.status === 200) {
        setFlashcardSets((currentSets) =>
          currentSets.filter((set) => set._id !== setId)
        );
      }
    } catch (error) {
      console.error("Error deleting flashcard set:", error);
    }
  };

  const fetchSavedSummaries = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/summary/saved-summaries",
        { withCredentials: true }
      );
      if (response.status === 200 && response.data.summaries) {
        const sortedSummaries = response.data.summaries.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setSavedSummaries(sortedSummaries);

        const initialSelectedState = sortedSummaries.reduce((acc, summary) => {
          acc[summary._id] = false;
          return acc;
        }, {});
        setSelectedSummariesState(initialSelectedState);
      }
    } catch (error) {
      console.error("Error fetching saved summaries:", error);
    }
  };

  const deleteSavedSummary = async (summaryId) => {
    try {
      console.log(`Attempting to delete summary with ID: ${summaryId}`);
      const response = await axios.delete(
        `http://localhost:5000/api/summary/summaries/${summaryId}`,
        { withCredentials: true }
      );
      console.log("Delete response:", response);
      if (response.status === 200) {
        setSavedSummaries((currentSummaries) =>
          currentSummaries.filter((summary) => summary._id !== summaryId)
        );
      }
    } catch (error) {
      console.error("Error deleting summary:", error);
    }
  };

  const checkAuth = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/user/data", {
        withCredentials: true,
      });
      if (response.data && response.data.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        setPlanId(response.data.user.planId);
        setIsSubscriptionActive(response.data.user.isSubscriptionActive);
        await initializeUserData();
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
      if (error.response?.status === 401) {
        try {
          const refreshResponse = await axios.post(
            "http://localhost:5000/api/user/refresh-token",
            {},
            { withCredentials: true }
          );
          if (refreshResponse.status === 200) {
            await checkAuth();
          } else {
            logoutUser();
          }
        } catch (refreshError) {
          console.error("Error refreshing token:", refreshError);
          logoutUser();
        }
      } else {
        setIsAuthenticated(false);
      }
    }
  };

  const saveSummary = async (newSummary) => {
    try {
      console.log("Sending summary to backend:", newSummary);
      const response = await axios.post(
        "http://localhost:5000/api/summary/save-summary",
        newSummary,
        { withCredentials: true }
      );

      if (response.status === 201) {
        setSavedSummaries((prevSummaries) => [
          response.data.savedSummary,
          ...prevSummaries,
        ]);
      } else {
        console.error("Non-successful response", response);
      }
    } catch (error) {
      console.error("Error saving summary:", error);
      if (error.response && error.response.status === 401) {
        await refreshToken();
      }
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        planId,
        setPlanId,
        summaries,
        setSummaries,
        savedSummaries,
        setSavedSummaries,
        isSubscriptionActive,
        setIsSubscriptionActive,
        saveSummary,
        checkAuth,
        logoutUser,
        flashcardSets,
        setFlashcardSets,
        deleteFlashcardSet,
        fetchSavedSummaries,
        fetchFlashcardSets,
        saveSummary,
        deleteSavedSummary,
        flashcards,
        setFlashcards,
        addNewFlashcard,
        deleteFlashcard,
        handleSaveFlashcards,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
