import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import Navbar from "./Navbar";
import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";
import UserContext from "../UserContext";
import axios from "axios";
import { ExclamationCircleIcon } from "@heroicons/react/outline";

const CheckoutForm = () => {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [numberOfUsers, setNumberOfUsers] = useState(1);
  const [priceId, setPriceId] = useState("price_monthly");
  const [companyOrSchool, setCompanyOrSchool] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [totalPrice, setTotalPrice] = useState(10);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedPriceId, setSelectedPriceId] = useState("");

  const { user, setUser, planId, setPlanId } = useContext(UserContext);
  const isUserLoggedIn = user !== null;

  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const location = useLocation();
  const { plan } = location.state || {
    price: 9.99,
    trialDays: 0,
    subscriptionPrice: 9.99,
    isFreeTrial: false,
  };

  const planToPriceId = {
    free_trial: "price_free_trial",
    student_plan: "price_student_plan",
  };

  useEffect(() => {
    if (plan) {
      setPriceId(planToPriceId[plan.id]);

      const productId = plan.productId;
    }
  }, [plan]);

  useEffect(() => {
    if (user && user.email) {
      setUserEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    const isStudentPlan = plan && plan.id === "student_plan";

    if (plan && plan.isFreeTrial) {
      setTotalPrice(0);
    } else {
      const newTotalPrice = calculatePrice(
        numberOfUsers,
        billingCycle,
        isStudentPlan
      );
      setTotalPrice(newTotalPrice);
    }
  }, [plan, billingCycle, numberOfUsers]);

  useEffect(() => {
    if (plan) {
      setPriceId(planToPriceId[plan.id]);
      if (plan.planId && planId !== plan.planId) {
        setPlanId(plan.planId || location.state.planId);
      }
    }
  }, [plan, setPlanId, planId, location.state]);

  const getRenewalDate = () => {
    let currentDate = new Date();
    if (plan && plan.isFreeTrial) {
      currentDate.setDate(currentDate.getDate() + plan.trialDays);
    } else {
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    return currentDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!termsAccepted) {
      alert("Please accept the terms and conditions to proceed.");
      return;
    }

    if (!stripe || !elements) {
      console.error("Stripe has not been initialized.");
      setErrorMessage("Stripe has not loaded. Please try again later.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    const cardElement = elements.getElement(CardElement);

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: { email: userEmail },
      });

      if (error) {
        console.log("[error]", error);
        setErrorMessage(
          "There was an issue with your payment details. Please check and try again."
        );
        setIsLoading(false);
        return;
      }

      const subscriptionResponse = await fetch(
        "http://localhost:5000/api/subscription/create-subscription",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            paymentMethodId: paymentMethod.id,
            email: userEmail,
            productId: plan.productId,
            billingCycle: billingCycle,
            planId: plan.planId,
          }),
        }
      );

      if (!subscriptionResponse.ok) {
        const errorResponse = await subscriptionResponse.json();
        console.error("Subscription response error:", errorResponse);
        setErrorMessage(
          errorResponse.error || "Error processing your subscription."
        );
        setIsLoading(false);
        return;
      }

      const subscriptionData = await subscriptionResponse.json();
      console.log("Subscription Data:", subscriptionData);

      if (user && setUser && subscriptionData.planId) {
        const updatedUser = { ...user, planId: subscriptionData.planId };
        setUser(updatedUser);
        setPlanId(subscriptionData.planId);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        localStorage.setItem("planId", subscriptionData.planId);
        navigate("/ai-audio-summarizer");
      }
    } catch (error) {
      console.error("[Network Error]", error);
      setErrorMessage(error.message || "Network error, please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  function calculatePrice(users, cycle, isStudentPlan) {
    const monthlyRate = isStudentPlan ? 9.99 : 10;
    const yearlyRate = isStudentPlan ? 99.99 : 100;
    return cycle === "yearly" ? yearlyRate * users : monthlyRate * users;
  }

  // Animations
  const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 1 } },
  };

  return (
    <motion.div
      className="flex flex-col min-h-screen pt-4 bg-gray-100"
      {...fadeIn}
    >
      <div className="bg-transparent px-6 pt-1">
        <div className="container mx-auto flex flex-col px-4 lg:px-20">
          <Navbar />
          <div className="container mx-auto mt-20 p-8 bg-white shadow-lg max-w-4xl rounded-lg">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 p-4">
                <div
                  className="flex items-center mb-6 text-blue-500 cursor-pointer"
                  onClick={() => navigate("/pricing")}
                >
                  <FaArrowLeft className="mr-2" />
                  <span>Back</span>
                </div>

                <h2 className="text-3xl font-semibold text-gray-800 mb-6">
                  Subscribe to VirtuNotes
                </h2>
                <div className="border-b pb-4">
                  <h3 className="font-semibold text-gray-700 mb-4">
                    Order summary
                  </h3>
                  {!plan.isFreeTrial ? (
                    <div>
                      <div className="mb-4">
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="billingCycle"
                            value="yearly"
                            checked={billingCycle === "yearly"}
                            onChange={() => setBillingCycle("yearly")}
                            className="form-radio h-5 w-5 text-blue-500"
                          />
                          <span className="text-gray-700 text-lg">
                            Yearly (Save 16%)
                          </span>
                        </label>
                      </div>
                      <div>
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="billingCycle"
                            value="monthly"
                            checked={billingCycle === "monthly"}
                            onChange={() => setBillingCycle("monthly")}
                            className="form-radio h-5 w-5 text-blue-500"
                          />
                          <span className="text-gray-700 text-lg">Monthly</span>
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2">
                      <div className="mt-4 text-sm text-gray-500">
                        Cancel anytime. Auto renews on {getRenewalDate()}
                      </div>
                    </div>
                  )}
                  <div className="mt-2">
                    <span className="text-gray-600 text-lg">Total:</span>
                    <span className="ml-2 font-semibold text-lg">
                      ${totalPrice}
                    </span>
                  </div>
                </div>
              </div>

              <form
                onSubmit={handleSubmit}
                className="md:w-1/2 p-4 bg-gray-50 rounded-lg"
              >
                {!isUserLoggedIn && (
                  <>
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                      Create your account
                    </h3>
                    <div className="mb-4">
                      <label
                        htmlFor="email"
                        className="block text-gray-700 text-sm font-bold mb-2"
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        placeholder="name@company.com"
                        className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500 text-lg"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="password"
                        className="block text-gray-700 text-sm font-bold mb-2"
                      >
                        Password
                      </label>
                      <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500 text-lg"
                        required
                      />
                    </div>
                  </>
                )}
                <div className="flex mb-4">
                  <div className="w-1/2 mr-2">
                    <label
                      htmlFor="firstName"
                      className="block text-gray-700 text-sm font-bold mb-2"
                    >
                      First Name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First"
                      className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500 text-lg"
                      required
                    />
                  </div>
                  <div className="w-1/2">
                    <label
                      htmlFor="lastName"
                      className="block text-gray-700 text-sm font-bold mb-2"
                    >
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last"
                      className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500 text-lg"
                      required
                    />
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Payment Details
                  </label>
                  <CardElement className="p-4 border rounded-lg bg-white" />
                </div>
                <div className="flex items-center mb-4 mt-4">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="form-checkbox h-3 w-3 text-blue-500"
                  />
                  <label htmlFor="terms" className="ml-2 text-gray-600 text-sm">
                    I agree to the
                    <Link to="/terms" className="ml-1 text-blue-500 text-sm">
                      Terms of Service
                    </Link>
                    <span className="ml-1">and</span>
                    <Link to="/privacy" className="text-blue-500 ml-1 text-sm">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
                {errorMessage && (
                  <div className="flex items-center justify-between p-4 mb-4 text-sm font-bold text-red-700 bg-red-100 rounded-md border border-red-400">
                    <div className="flex items-center">
                      <ExclamationCircleIcon
                        className="w-5 h-5 mr-2"
                        aria-hidden="true"
                      />
                      <span>{errorMessage}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setErrorMessage("")}
                      className="text-red-700"
                    >
                      <span className="sr-only">Dismiss</span>
                      <ExclamationCircleIcon
                        className="w-5 h-5"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                )}
                <button
                  type="submit"
                  className={`w-full px-4 py-2 text-white rounded-lg focus:outline-none ${
                    isLoading ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-700"
                  }`}
                  disabled={isLoading || !termsAccepted}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 0116 0H4z"
                        ></path>
                      </svg>
                      Processing...
                    </div>
                  ) : (
                    "Subscribe"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CheckoutForm;
