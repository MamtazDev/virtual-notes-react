import React, { useState, useContext, useEffect } from "react";
import {
  HomeIcon,
  MicrophoneIcon,
  CogIcon,
  BookOpenIcon,
  BriefcaseIcon,
  SupportIcon,
  MenuIcon,
  XIcon,
  LogoutIcon,
  LockClosedIcon,
  LightBulbIcon,
  ClipboardListIcon,
} from "@heroicons/react/solid";
import { Link, useLocation, useNavigate } from "react-router-dom";
import UserContext from "../UserContext";
import classNames from "classnames";
import { handleLogout } from "./handleLogout";

function Sidebar({ setHaveSubscription = null }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser, planId, isSubscriptionActive } =
    useContext(UserContext);
  const [isBouncing, setIsBouncing] = useState(false);



  const navItems = [
    { name: "Home", icon: HomeIcon, to: "/", requiredPlans: [] },
    {
      name: "Class Summarizer",
      icon: MicrophoneIcon,
      to: "/ai-audio-summarizer",
      requiredPlans: [],
    },
    {
      name: "Quiz Generation",
      icon: BookOpenIcon,
      to: "/quiz-generation",
      requiredPlans: ["student_plan", "free_trial"],
    },
    {
      name: "Flashcards",
      icon: ClipboardListIcon,
      to: "/flashcards",
      requiredPlans: [],
    },
    {
      name: "AI Tutor",
      icon: LightBulbIcon,
      to: "/ai-tutor",
      requiredPlans: [],
    },
    {
      name: "Subscription Plans",
      icon: BriefcaseIcon,
      to: "/subscriptionplans",
      requiredPlans: [],
    },
    { name: "Settings", icon: CogIcon, to: "/settings", requiredPlans: [] },
    {
      name: "Help/Support",
      icon: SupportIcon,
      to: "/help",
      requiredPlans: [],
    },
  ];

  const handleLinkClick = (item) => {
    console.log("item:", item)

    if (item.requiredPlans.length > 0 && !item.requiredPlans.includes(planId)) {
      alert("Upgrade to access this feature.");
      return;
    }
    navigate(item.to);
  };

  const logout = () => {
    handleLogout(setUser, navigate);
  };

  useEffect(() => {
    console.log("Current planId:", planId);
  }, [planId]);

  const handleAITutorClick = () => {
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 500);
  };


  useEffect(() => {
    
    console.log("Sidebar Current planId:", planId);
    setHaveSubscription !== null &&  setHaveSubscription(planId)
  }, [planId])
  return (
    <div>
      <div className="absolute top-4 left-4 lg:hidden">
        <MenuIcon
          className="h-8 w-8 text-blue-600 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>

      {/* Sidebar */}
      <aside
        className={`transform top-0 left-0 w-64 bg-white fixed h-full overflow-auto ease-in-out transition-all duration-300 z-30 ${isOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 flex flex-col`}
      >
        <div className="flex items-center justify-between p-4 mb-8">
          <Link to="/" className="flex items-center">
            <span className="font-bold text-gray-700 text-2xl align-middle">
              Virtu
            </span>{" "}
            <span className="font-bold text-blue-500 text-2xl align-middle">
              Notes
            </span>
          </Link>
          <XIcon
            className="h-6 w-6 text-gray-400 lg:hidden cursor-pointer"
            onClick={() => setIsOpen(false)}
          />
        </div>

        {/* Nav items */}
        <nav className="mt-8 mb-4 flex-grow">
          {navItems.map((item) => (
            <div
              key={item.name}
              onClick={
                item.name === "AI Tutor"
                  ? handleAITutorClick
                  : () => handleLinkClick(item)
              }
              className={classNames(
                "flex items-center p-4 rounded cursor-pointer",
                location.pathname === item.to ? "bg-gray-100" : "",
                item.name === "AI Tutor" ? "relative" : ""
              )}
            >
              <item.icon className="h-5 w-5 text-blue-600" />
              <span className="ml-4 text-gray-800">{item.name}</span>
              {item.name === "AI Tutor" && (
                <span
                  className={classNames(
                    "ml-auto inline-block py-1 px-2.5 leading-none text-center whitespace-nowrap align-baseline font-bold bg-blue-500 text-white text-xs rounded-full",
                    isBouncing ? "bounce" : ""
                  )}
                >
                  Coming Soon
                </span>
              )}
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div className="mt-auto">
          <hr className="border-t border-gray-200" />
          <button
            onClick={logout}
            className="flex items-center justify-center w-full p-4 text-blue-600 transition-colors duration-300"
          >
            <LogoutIcon className="h-5 w-5 mr-2" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </div>
  );
}

export default Sidebar;
