import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors("");
    setSuccess("");

    if (!email) {
      setErrors("Please enter a valid email address.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/forgot-password",
        { email }
      );
      setSuccess(response.data.message);
    } catch (error) {
      setErrors(
        error.response.data.error || "An error occurred. Please try again."
      );
    }
  };

  return (
    <motion.div
      className="flex flex-col min-h-screen bg-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          className="min-h-screen flex items-center justify-center w-full"
          initial={{ y: -250 }}
          animate={{ y: -10 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <div className="max-w-md w-full space-y-8">
            <div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Forgot Password
              </h2>
              <p className="mt-4 text-center text-md text-gray-600">
                Enter the email address associated with your account
                <p> and we'll send you a link to reset your password.</p>
              </p>
            </div>
            <form className="mt-8 space-y-6 w-full" onSubmit={handleSubmit}>
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div>
                {errors && (
                  <p className="text-red-600 text-sm text-center mt-2">
                    {errors}
                  </p>
                )}
                {success && (
                  <p className="text-green-600 text-sm text-center mt-2">
                    {success}
                  </p>
                )}
              </div>
              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Continue
                </button>
              </div>
            </form>
            <div className="text-sm text-center mt-4">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign up
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ForgotPassword;
