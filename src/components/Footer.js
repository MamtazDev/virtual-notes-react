import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://virtualserver.onrender.com/subscribe-newsletter",
        {
          method: "POST",
          body: JSON.stringify({ email }),
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        setIsSubmitted(true);
        setEmail("");
      } else {
        console.error("Subscription failed:", await response.json());
      }
    } catch (error) {
      console.error("Error when subscribing:", error);
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center sm:text-left">
          {/* About Section */}
          <div>
            <h2 className="text-xl font-bold mb-4">About VirtuNotes</h2>
            <p className="mb-4">
              Your trusted partner in virtual note-taking and productivity.
            </p>
          </div>

          {/* Quick Links Section */}
          <div>
            <h2 className="text-xl font-bold mb-4">Quick Links</h2>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="hover:text-blue-400 transition-colors duration-200"
                  onClick={() => handleNavigation("/")}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-blue-400 transition-colors duration-200"
                  onClick={() => handleNavigation("/")}
                >
                  Why VirtuNotes
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="hover:text-blue-400 transition-colors duration-200"
                  onClick={() => handleNavigation("/")}
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-blue-400 transition-colors duration-200"
                  onClick={() => handleNavigation("/")}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Section */}
          <div>
            <h2 className="text-xl font-bold mb-4">Legal</h2>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/faq"
                  className="hover:text-blue-400 transition-colors duration-200"
                  onClick={() => handleNavigation("/")}
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="hover:text-blue-400 transition-colors duration-200"
                  onClick={() => handleNavigation("/")}
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="hover:text-blue-400 transition-colors duration-200"
                  onClick={() => handleNavigation("/")}
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Section */}
          <div>
            <h2 className="text-xl font-bold mb-4">Newsletter</h2>
            <p className="mb-4">
              Stay updated with the latest news and exclusive offers.
            </p>
            <form
              onSubmit={handleSubmit}
              className="flex flex-wrap justify-center sm:justify-start"
            >
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={handleEmailChange}
                className="p-2 rounded bg-gray-800 text-white mb-2 sm:mb-0 sm:mr-2"
                required
              />
              <button
                type="submit"
                className="p-2 rounded bg-blue-500 hover:bg-blue-600 transition-colors duration-200"
              >
                Subscribe
              </button>
            </form>
            {isSubmitted && (
              <p className="text-green-400 mt-2">Thank you for subscribing!</p>
            )}
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-gray-800 pt-8 mt-8 text-sm text-center">
          © 2023 VirtuNotes. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
