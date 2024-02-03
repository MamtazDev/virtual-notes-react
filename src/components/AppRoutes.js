import React, { useState } from "react";
import { Route, Navigate, Routes } from "react-router-dom";

import Home from "../components/Home";
import About from "../components/About";
import Login from "../components/Login";
import Pricing from "../components/Pricing";
import Signup from "../components/SignUp";
import Contact from "../components/Contact";
import TermsAndConditions from "../components/TermsAndConditions";
import FAQ from "../components/FAQ";
import PrivacyPolicy from "../components/PrivacyPolicy";
import CheckoutForm from "../components/CheckoutForm";
import Virtunotes from "../components/Virtunotes";
import Settings from "../components/Settings";
import SubscriptionPlans from "../components/SubscriptionPlans";
import HelpSupport from "../components/Help";
import QuizGeneration from "./QuizGeneration";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import QuizDisplay from "./QuizDisplay";
import FlashcardsMain from "./FlashcardMain";
import CreateFlashcardsSet from "./CreateFlashcardsSet";
import FlashcardDisplay from "./FlashcardDisplay";
import AddFlashcardPage from "./AddFlashcardPage";

const PrivateRoute = ({ component, isAuthenticated, ...rest }) => {
  return (
    <Route
      {...rest}
      element={isAuthenticated ? <component /> : <Navigate to="/login" />}
    />
  );
};


const AppRoutes = () => {

  const [isAuthenticated, setIsAuthenticated] = useState(false)

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/ai-audio-summarizer" element={<Virtunotes />} />


        {/* {isAuthenticated ? <Route path="/ai-audio-summarizer" element={<Virtunotes />} /> : <Route path="/login" element={<Login />} />} */}
        {/* <PrivateRoute
          path="/ai-audio-summarizer"
          component={Virtunotes}
          isAuthenticated={false}
        /> */}





        <Route path="/settings" element={<Settings />} />
        <Route path="/checkout" element={<CheckoutForm />} />
        <Route path="/help" element={<HelpSupport />} />
        <Route path="/subscriptionplans" element={<SubscriptionPlans />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/quiz-generation" element={<QuizGeneration />} />
        <Route path="/quiz-display" element={<QuizDisplay />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
        <Route path="/flashcards" element={<FlashcardsMain />} />
        <Route path="/create-flashcards" element={<CreateFlashcardsSet />} />
        <Route path="/flashcard-display" element={<FlashcardDisplay />} />
        <Route path="/edit-flashcards" element={<AddFlashcardPage />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
