import React, { useState, useContext } from "react";
import {
  MenuIcon,
  XIcon,
  HomeIcon,
  CashIcon,
  LogoutIcon,
  InformationCircleIcon,
  AnnotationIcon,
  ChartBarIcon,
} from "@heroicons/react/solid";
import { Link, NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import UserContext from "../UserContext";
import { handleLogout } from "./handleLogout";

const Navbar = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const { user, setUser, planId } = useContext(UserContext);
  const navigate = useNavigate();

  console.log("User from Context:", user);

  const logout = () => {
    handleLogout(setUser, navigate);
  };

  return (
    <div className="bg-transparent px-6 pt-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center">
            <span className="font-bold text-blue-500 text-2xl align-middle">
              Virtu
            </span>{" "}
            <span className="font-bold  text-gray-700 text-2xl align-middle">
              notes
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden 2xl:flex justify-between items-center w-full">
          {/* Desktop Links */}
          <div className="flex space-x-8 ml-auto items-center">
            {user ? (
              <>
                {/* User is logged in */}
                <NavLink
                  to="/"
                  className="text-black hover:text-blue-500 font-medium transition-colors"
                >
                  Home
                </NavLink>
                <NavLink
                  to="/about"
                  className="text-black hover:text-blue-500 font-medium transition-colors"
                >
                  Why VirtuNotes
                </NavLink>
                {user && planId && (
                  <NavLink
                    className="text-black hover:text-blue-500 font-medium transition-colors"
                    to="/ai-audio-summarizer"
                  >
                    Dashboard
                  </NavLink>
                )}
                <NavLink
                  to="/pricing"
                  className="text-black hover:text-blue-500 font-medium transition-colors"
                >
                  Pricing
                </NavLink>
                <NavLink
                  to="/contact"
                  className="text-black hover:text-blue-500 font-medium transition-colors"
                >
                  Support
                </NavLink>

                {user ? (
                  // Logged in user view
                  <button
                    className="flex items-center space-x-2 bg-blue-500 text-white font-medium py-3 px-6 rounded-full transform hover:scale-105 transition-transform duration-300 ml-4"
                    onClick={logout}
                  >
                    Logout
                  </button>
                ) : (
                  // Guest view
                  <Link to="/login">Login</Link>
                )}
              </>
            ) : (
              <>
                {/* User is not logged in */}
                <Link
                  to="/"
                  className="text-black hover:text-blue-500 font-medium transition-colors"
                >
                  Home
                </Link>
                <Link
                  to="/about"
                  className="text-black hover:text-blue-500 font-medium transition-colors"
                >
                  Why VirtuNotes
                </Link>
                <Link
                  to="/pricing"
                  className="text-black hover:text-blue-500 font-medium transition-colors"
                >
                  Pricing
                </Link>
                <Link
                  to="/contact"
                  className="text-black hover:text-blue-500 font-medium transition-colors"
                >
                  Contact Us
                </Link>
                <Link
                  to="/signup"
                  className="text-black hover:text-blue-500 font-medium transition-colors"
                >
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  className="flex items-center space-x-2 bg-blue-500 text-white py-3 px-6 rounded-full transform hover:scale-105 transition-transform duration-300 ml-4"
                >
                  <span className="font-semibold">Login</span>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="relative 2xl:hidden">
          <button
            onClick={() => setMenuOpen(!isMenuOpen)}
            className="flex items-center p-2"
          >
            {isMenuOpen ? (
              <XIcon className="mt-[6px] h-6 w-6 text-blue-600" />
            ) : (
              <MenuIcon className="mt-[6px] h-6 w-6 text-blue-600" />
            )}
          </button>

          {/* Mobile Dropdown */}
          {isMenuOpen && (
            <div className="absolute top-full right-0 mt-3 space-y-2 w-56 bg-white shadow-lg rounded-lg p-4">
              {user ? (
                <>
                  {/* User is logged in */}
                  <Link
                    to="/"
                    className="flex items-center justify-start space-x-2 text-gray-600 hover:text-blue-600 block"
                  >
                    <HomeIcon className="h-5 w-5" />
                    <span>Home</span>
                  </Link>
                  <Link
                    to="/about"
                    className="flex items-center justify-start space-x-2 text-gray-600 hover:text-blue-600 block"
                  >
                    <InformationCircleIcon className="h-5 w-5" />
                    <span>Why VirtuNotes</span>
                  </Link>
                  {user && planId && (
                    <NavLink
                      to="/ai-audio-summarizer"
                      className="flex items-center justify-start space-x-2 text-gray-600 hover:text-blue-600 block"
                    >
                      <ChartBarIcon className="h-5 w-5" />{" "}
                      <span>Dashboard</span>
                    </NavLink>
                  )}
                  <Link
                    to="/pricing"
                    className="flex items-center justify-start space-x-2 text-gray-600 hover:text-blue-600 block"
                  >
                    <CashIcon className="h-5 w-5" />
                    <span>Pricing</span>
                  </Link>

                  <Link
                    to="/contact"
                    className="flex items-center justify-start space-x-2 text-gray-600 hover:text-blue-600 block"
                  >
                    <AnnotationIcon className="h-5 w-5" />
                    <span>Support</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="flex items-center justify-start space-x-2 text-gray-600 hover:text-blue-600 block"
                  >
                    <LogoutIcon className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  {/* User is not logged in */}
                  <Link
                    to="/"
                    className="text-gray-600 hover:text-blue-600 block"
                  >
                    Home
                  </Link>
                  <Link
                    to="/about"
                    className="text-gray-600 hover:text-blue-600 block"
                  >
                    Why VirtuNotes
                  </Link>
                  <Link
                    to="/pricing"
                    className="text-gray-600 hover:text-blue-600 block"
                  >
                    Pricing
                  </Link>
                  <Link
                    to="/contact"
                    className="text-gray-600 hover:text-blue-600 block"
                  >
                    Contact Us
                  </Link>
                  <Link
                    to="/signup"
                    className="text-gray-600 hover:text-blue-600 block"
                  >
                    Sign Up
                  </Link>
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-blue-600 block"
                  >
                    Login
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
