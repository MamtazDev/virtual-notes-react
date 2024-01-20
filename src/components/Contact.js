import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { Footer } from "./Footer";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";
import UserContext from "../UserContext";

const Contact = () => {
  const { user, setUser, userPlan, setUserPlan } = useContext(UserContext);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailData = {
      subject: "Contact Form Submission from " + formData.name,
      text: `Name: ${formData.name}\nEmail: ${formData.email}\nMessage: ${formData.message}`,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/email/send-email",
        emailData
      );
      setSuccessMessage("Your message has been sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  // Animation
  const fadeInUp = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.8 } },
  };

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 1 } },
  };

  return (
    <motion.div
      className=" bg-gray-100 flex flex-col min-h-screen pt-4"
      {...fadeIn}
    >
      <div className="bg-gray-100 px-6 pt-1 border-b border-white">
        <div className="container mx-auto flex flex-col px-4 lg:px-20 ">
          {/* Navbar */}
          <Navbar />

          {/* Main Content */}
          <motion.section
            ref={ref}
            variants={fadeInUp}
            initial="initial"
            animate={inView ? "animate" : ""}
            className="flex-1 container mx-auto px-4 lg:px-20 py-12 mb-10 lg:mb-20"
          >
            {/* Content Header */}
            <div className="text-center space-y-6 mb-12">
              <h1 className="text-4xl font-extrabold">Contact Us</h1>
              <p className="text-lg sm:text-xl text-gray-700">
                Questions or feedback? We'd love to hear from you.
              </p>
            </div>

            {/* Form Container */}
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg mb-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name field */}
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    required
                    onChange={handleChange}
                    value={formData.name}
                    className="w-full p-3 border border-gray-300 rounded"
                  />
                </div>
                {/* Email field */}
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="john@example.com"
                    required
                    onChange={handleChange}
                    value={formData.email}
                    className="w-full p-3 border border-gray-300 rounded"
                  />
                </div>
                {/* Message field */}
                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className="text-sm font-medium text-gray-700"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    placeholder="How can we help you?"
                    required
                    onChange={handleChange}
                    value={formData.message}
                    className="w-full p-3 border border-gray-300 rounded"
                  />
                </div>

                {successMessage && (
                  <div className="w-full  ">
                    <div
                      className="relative bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 flex justify-between items-center"
                      role="alert"
                    >
                      <div className="flex-1">
                        <strong className="font-bold mr-2">Success!</strong>
                        <span className="block sm:inline">
                          {successMessage}
                        </span>
                      </div>
                      <button
                        className="ml-4"
                        onClick={() => setSuccessMessage("")}
                      >
                        <span className="text-green-500 text-2xl hover:text-green-700">
                          &times;
                        </span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  Send Message
                </button>
              </form>
            </div>
          </motion.section>
        </div>
      </div>
      <Footer />
    </motion.div>
  );
};

export default Contact;
