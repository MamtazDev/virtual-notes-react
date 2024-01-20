import React, { useContext, useState } from "react";
import { Footer } from "./Footer";
import { useNavigate } from "react-router-dom";
import { Check2 } from "react-bootstrap-icons";
import Navbar from "./Navbar";
import { motion } from "framer-motion";
import UserContext from "../UserContext";
import PlanSelectionModal from "./PlanSelectionModal";

function Pricing() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const { user, planId, isSubscriptionActive } = useContext(UserContext);
  const navigate = useNavigate();

  const isCurrentPlan = (planIdToCheck) => {
    return planId === planIdToCheck;
  };

  const hasUsedFreeTrial = () => {
    return user?.hasUsedFreeTrial;
  };

  const handlePlanSelection = (planIdToSelect) => {
    if (isCurrentPlan(planIdToSelect)) {
      setModalMessage("You are already on this plan.");
      setModalOpen(true);
      return;
    }

    if (planIdToSelect === "free_trial" && hasUsedFreeTrial()) {
      setModalMessage("You have already used your free trial.");
      setModalOpen(true);
      return;
    }

    if (planIdToSelect === "contact") {
      navigate("/contact");
      return;
    }

    const planDetails = {
      free_trial: {
        productId: "prod_Oz7rQ78PYkbCNq",
      },
      student_plan: {
        productId: "prod_Oz7q5ksiXFH7mn",
      },
    };

    navigate("/checkout", {
      state: { plan: planDetails[planIdToSelect], planId: planIdToSelect },
    });
  };

  return (
    <motion.div className="flex flex-col min-h-screen pt-4 bg-gray-100">
      <div className="bg-transparent px-6 pt-1 border-b border-white">
        <div className="container mx-auto flex flex-col px-4 lg:px-20">
          <Navbar />

          <div className="flex-1 container mx-auto px-6 py-12 mt-4">
            <div className="text-center space-y-6 mb-12">
              <h1 className="text-4xl font-extrabold">Plans & Pricing</h1>
              <p className="text-lg sm:text-xl text-gray-700">
                Choose the right package for your needs and get started today!
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
              <div className="bg-white p-6 rounded-2xl shadow-xl transition-all hover:shadow-2xl">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                  Free Trial
                </h2>
                <h3 className="text-lg text-gray-500 mb-6">
                  Perfect for individuals just starting out
                </h3>
                <div className="flex items-baseline space-x-2 mb-6">
                  <span className="text-5xl font-bold">$0</span>
                  <span className="text-gray-500 font-semibold">/ month</span>
                </div>
                <p className="text-gray-500 text-sm mb-6">
                  Free forever with essential features
                </p>

                <button
                  onClick={() => handlePlanSelection("free_trial")}
                  disabled={isCurrentPlan("free_trial") || hasUsedFreeTrial()}
                  className={`bg-blue-500 w-full text-white py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200 text-lg mb-6 font-semibold ${
                    isCurrentPlan("free_trial") || hasUsedFreeTrial()
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {isCurrentPlan("free_trial")
                    ? "Your Current Plan"
                    : "Start Free Trial"}
                </button>

                <div className="border-b mb-6"></div>
                <ul className="mb-6">
                  <li className="flex items-center mb-2">
                    <Check2 className="text-blue-500" />
                    <span className="ml-2 text-md text-gray-700">
                      Limited transcription credits
                    </span>
                  </li>
                  <li className="flex items-center mb-2">
                    <Check2 className="text-blue-500" />
                    <span className="ml-2 text-md text-gray-700">
                      60 minutes of secure storage
                    </span>
                  </li>

                  <li className="flex items-center mb-2">
                    <Check2 className="text-blue-500" />
                    <span className="ml-2 text-md text-gray-700">
                      Real-time note taking
                    </span>
                  </li>
                  <li className="flex items-center mb-2">
                    <Check2 className="text-blue-500" />
                    <span className="ml-2 text-md text-gray-700">
                      Access to community forums
                    </span>
                  </li>
                  <li className="flex items-center mb-2">
                    <Check2 className="text-blue-500" />
                    <span className="ml-2 text-md text-gray-700">
                      Basic customer support
                    </span>
                  </li>
                  <li className="flex items-center mb-2">
                    <Check2 className="text-blue-500" />
                    <span className="ml-2 text-md text-gray-700">
                      Cloud synchronization
                    </span>
                  </li>
                </ul>

                <h3 className="font-semibold text-lg text-gray-800 mb-2">
                  Key Features
                </h3>
                <ul>
                  <li className="flex items-center mb-2">
                    <Check2 className="text-blue-500" />
                    <span className="ml-2 text-md text-gray-700">
                      Automated summaries
                    </span>
                  </li>
                  <li className="flex items-center mb-2">
                    <Check2 className="text-blue-500" />
                    <span className="ml-2 text-md text-gray-700">
                      Transcription in 69+ languages
                    </span>
                  </li>

                  <li className="flex items-center mb-2">
                    <Check2 className="text-blue-500" />
                    <span className="ml-2 text-md text-gray-700">
                      Easy export and sharing options
                    </span>
                  </li>
                  <li className="flex items-center mb-2">
                    <Check2 className="text-blue-500" />
                    <span className="ml-2 text-md text-gray-700">
                      Integration with popular note-taking apps
                    </span>
                  </li>
                </ul>
              </div>

              {/* Student Plan */}
              <div className="bg-white p-6 rounded-2xl shadow-xl transition-all hover:shadow-2xl">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                  Student Plan
                </h2>
                <h3 className="text-lg text-gray-500 mb-6">
                  Tailored for academic success
                </h3>
                <div className="flex items-baseline space-x-2 mb-6">
                  <span className="text-5xl font-bold">$9.99</span>
                  <span className="text-gray-500 font-semibold">/ month</span>
                </div>
                <p className="text-gray-500 text-sm mb-6">
                  Specialized features for students on a budget
                </p>
                <button
                  onClick={() => handlePlanSelection("student_plan")}
                  disabled={isCurrentPlan("student_plan")}
                  className={`bg-blue-500 w-full text-white py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200 text-lg mb-6 font-semibold ${
                    isCurrentPlan("student_plan")
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {isCurrentPlan("student_plan")
                    ? "Your Current Plan"
                    : "Choose Student Plan"}
                </button>

                <div className="border-b mb-6"></div>
                <ul className="mb-6">
                  <li className="flex items-center mb-2">
                    <Check2 className="text-blue-500" />
                    <span className="ml-2 text-md text-gray-700">
                      Unlimited transcription credits
                    </span>
                  </li>
                  <li className="flex items-center mb-2">
                    <Check2 className="text-blue-500" />
                    <span className="ml-2 text-md text-gray-700">
                      200 minutes of secure storage
                    </span>
                  </li>

                  <li className="flex items-center mb-2">
                    <Check2 className="text-blue-500" />
                    <span className="ml-2 text-md text-gray-700">
                      Advanced summarization
                    </span>
                  </li>

                  <li className="flex items-center mb-2">
                    <Check2 className="text-blue-500" />
                    <span className="ml-2 text-md text-gray-700">
                      Exclusive educational content
                    </span>
                  </li>
                  <li className="flex items-center mb-2">
                    <Check2 className="text-blue-500" />
                    <span className="ml-2 text-md text-gray-700">
                      Priority customer support
                    </span>
                  </li>
                  <li className="flex items-center mb-2">
                    <Check2 className="text-blue-500" />
                    <span className="ml-2 text-md text-gray-700">
                      Group project collaboration tools
                    </span>
                  </li>
                  <li className="flex items-center mb-2">
                    <Check2 className="text-blue-500" />
                    <span className="ml-2 text-md text-gray-700">
                      Integration with educational apps
                    </span>
                  </li>
                </ul>

                <h3 className="font-semibold text-lg text-gray-800 mb-2">
                  Key Features
                </h3>
                <ul>
                  <li className="flex items-center mb-2">
                    <Check2 className="text-blue-500" />
                    <span className="ml-2 text-md text-gray-700">
                      Automated summaries
                    </span>
                  </li>
                  <li className="flex items-center mb-2">
                    <Check2 className="text-blue-500" />
                    <span className="ml-2 text-md text-gray-700">
                      Transcription in 69+ languages
                    </span>
                  </li>

                  <li className="flex items-center mb-2">
                    <Check2 className="text-blue-500" />
                    <span className="ml-2 text-md text-gray-700">
                      Easy export and sharing options
                    </span>
                  </li>

                  <li className="flex items-center mb-2">
                    <Check2 className="text-blue-500" />
                    <span className="ml-2 text-md text-gray-700">
                      Lecture capture and note synchronization
                    </span>
                  </li>
                  <li className="flex items-center mb-2">
                    <Check2 className="text-blue-500" />
                    <span className="ml-2 text-md text-gray-700">
                      Automated citation and referencing tools
                    </span>
                  </li>
                </ul>
              </div>

              {/* Enterprise Plan */}
              <div className="bg-white p-6 rounded-2xl shadow-xl transition-all hover:shadow-2xl">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                  Enterprise Plan
                </h2>
                <h3 className="text-lg text-gray-500 mb-6">
                  Designed for large-scale business needs
                </h3>
                <div className="flex items-baseline space-x-2 mb-6">
                  <span className="text-4xl font-bold">Custom</span>
                  <span className="text-gray-500 font-semibold">/ month</span>
                </div>
                <p className="text-gray-500 text-sm mb-6">
                  Tailored solutions with premium features
                </p>
                <button
                  className="bg-blue-500 w-full text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-lg mb-6 font-semibold"
                  onClick={() => handlePlanSelection("contact")}
                >
                  Contact Us
                </button>
                <div className="border-b mb-6"></div>
                <ul className="mb-6">
                  <li className="flex items-center mb-2">
                    <Check2 className="text-blue-500" />
                    <span className="ml-2 text-md text-gray-700">
                      Unlimited transcription credits
                    </span>
                  </li>
                  <li className="flex items-center mb-2">
                    <Check2 className="text-blue-500" />
                    <span className="ml-2 text-md text-gray-700">
                      Unlimited storage
                    </span>
                  </li>

                  <li className="flex items-center mb-2">
                    <Check2 className="text-blue-500" />
                    <span className="ml-2 text-md text-gray-700">
                      Business integrations
                    </span>
                  </li>

                  <li className="flex items-center mb-2">
                    <Check2 className="text-blue-500" />
                    <span className="ml-2 text-md text-gray-700">
                      Advanced security features
                    </span>
                  </li>
                  <li className="flex items-center mb-2">
                    <Check2 className="text-blue-500" />
                    <span className="ml-2 text-md text-gray-700">
                      Dedicated account management
                    </span>
                  </li>
                  <li className="flex items-center mb-2">
                    <Check2 className="text-blue-500" />
                    <span className="ml-2 text-md text-gray-700">
                      Customizable workflow integration
                    </span>
                  </li>
                  <li className="flex items-center mb-2">
                    <Check2 className="text-blue-500" />
                    <span className="ml-2 text-md text-gray-700">
                      Priority customer support
                    </span>
                  </li>
                </ul>

                <h3 className="font-semibold text-lg text-gray-800 mb-2">
                  Key Features
                </h3>
                <ul>
                  <li className="flex items-center mb-2">
                    <Check2 className="text-blue-500" />
                    <span className="ml-2 text-md text-gray-700">
                      Personalized setup and onboarding
                    </span>
                  </li>
                  <li className="flex items-center mb-2">
                    <Check2 className="text-blue-500" />
                    <span className="ml-2 text-md text-gray-700">
                      API access for custom integrations
                    </span>
                  </li>

                  <li className="flex items-center mb-2">
                    <Check2 className="text-blue-500" />
                    <span className="ml-2 text-md text-gray-700">
                      SLA guarantees and uptime commitments
                    </span>
                  </li>
                  <li className="flex items-center mb-2">
                    <Check2 className="text-blue-500" />
                    <span className="ml-2 text-md text-gray-700">
                      Volume discounts for large teams
                    </span>
                  </li>
                </ul>
                <PlanSelectionModal
                  isOpen={isModalOpen}
                  onClose={() => setModalOpen(false)}
                  message={modalMessage}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </motion.div>
  );
}

export default Pricing;
