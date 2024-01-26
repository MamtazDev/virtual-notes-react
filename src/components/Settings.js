import React, { useContext, useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import UserContext from "../UserContext";
import axios from "axios";
import ConfirmationDialog from "./ConfirmationDialog";
import classNames from "classnames";
import { API_URL } from "../config/config";

const Settings = () => {
  const { user, setUser } = useContext(UserContext);
  const [email, setEmail] = useState(user?.email || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfirmationDialog, setShowConfirmationDialog] =
    React.useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [subscriptionEndDate, setSubscriptionEndDate] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [cancelError, setCancelError] = useState("");
  const [canCancel, setCanCancel] = useState(user?.isSubscriptionActive);
  const [profileError, setProfileError] = useState("");
  const [subscriptionError, setSubscriptionError] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleUpdateProfile = async () => {
    if (loading) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || email === user?.email) {
      setProfileError("Please enter a new email to update your profile.");
      return;
    } else if (!emailRegex.test(email)) {
      setProfileError("Invalid email format.");
      return;
    }

    setLoading(true);
    setError("");
    setShowSuccessMessage(false);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Authentication required. Please log in again.");
        console.error("No authentication token found.");
        return;
      }

      const response = await axios.put(
        `${API_URL}/api/user/update`,
        { email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        const updatedUserData = { ...user, email: response.data.updatedEmail };
        setUser(updatedUserData);
        setShowSuccessMessage(true);
        setSuccessMessage("Profile updated successfully.");
      } else {
        setError(response.data.error || "Unknown error occurred.");
      }
    } catch (err) {
      console.error("Error updating profile: ", err);
      setError(
        err.response?.data?.error || err.message || "Failed to update profile."
      );
    }

    setLoading(false);
  };

  const formatDate = (date) => {
    return date
      ? new Date(date).toLocaleDateString("default", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : null;
  };

  const handleCancelSubscription = () => {
    setError("");
    setShowConfirmationDialog(true);
  };

  const handleConfirmCancellation = async () => {
    setLoading(true);
    setError("");
    
    console.log("Clicked on cancle subscription button!")
    
    try {
      const token = localStorage.getItem("authToken");

      console.log("token", user.id);
      // const authTokn = 

      // if (!token) {
      //   setError("Authentication required. Please log in again.");
      //   setLoading(false);
      //   // setShowConfirmationDialog(false);
      //   return;
      // }

      // const response = await axios.post(
      //   `${API_URL}/api/cancel-subscription`,
      //   { userId: user.id },
      //   { headers: { Authorization: `Bearer ${token}` } }
      // );

      const bodydata = { userId: user.id }

      const response = await fetch(`${API_URL}/api/subscription/cancel-subscription`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Make sure credentials include is set if your API requires it


        body: JSON.stringify({ userId: user.id }),
      });

      const data = await response.json();


      console.log("data: ", data)



      if (response.data.success) {
        const updatedUser = {
          ...user,
          planId: null,
          isSubscriptionActive: false,
          subscriptionEndDate: response.data.subscriptionEndDate,
        };
        setUser(updatedUser);
        setSubscriptionEndDate(response.data.subscriptionEndDate);

        const endDate = response.data.subscriptionEndDate
          ? new Date(response.data.subscriptionEndDate).toLocaleDateString()
          : "the end of your billing period";

        setSuccessMessage(
          `Your subscription has been cancelled successfully. It will remain active until ${endDate}.`
        );
        setSubscriptionEndDate(endDate);
        setShowSuccessMessage(true);
      } else {
        setError(
          response.data.message || "An error occurred during cancellation."
        );
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to cancel subscription."
      );
    } finally {
      setLoading(false);
      setShowConfirmationDialog(false);
    }
  };

  const checkUserPlan = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No authentication token found.");
        setError("Authentication required. Please log in again.");
        return;
      }

      const response = await axios.get(`${API_URL}/api/user/has-plan`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (response.data.hasPlan) {
        setUser({
          ...user,
          planId: response.data?.planId,
          isSubscriptionActive: true,
        });
      } else {
        setUser({ ...user, planId: null, isSubscriptionActive: false });
        setError("You do not have an active plan.");
      }
    } catch (error) {
      console.error("Error checking user plan: ", error);
      setError(error.response?.data?.message || "Failed to check user plan.");
    }
  };

  const updateCancellationStatus = () => {
    const currentDate = new Date();
    const subscriptionStartDate = new Date(user?.subscriptionStartDate);
    let IscanCancel = false;
    if (user?.planId === "free_trial") {
      IscanCancel = currentDate - subscriptionStartDate < 7 * 24 * 60 * 60 * 1000;
    } else if (user?.planId === "student_plan") {
      IscanCancel =
        currentDate - subscriptionStartDate < 30 * 24 * 60 * 60 * 1000;
    }

    console.log("IscanCancel:", IscanCancel)

    setCanCancel(canCancel);

  };

  useEffect(() => {
    if (user && localStorage.getItem("authToken")) {
      checkUserPlan();

      setSubscriptionEndDate(user.subscriptionEndDate);
    }
  }, [user]);

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);

      setProfileError("");
    }

    updateCancellationStatus();
  }, [user]);


  useEffect(() =>{
    // const currentDate = new Date();
    // const subscriptionStartDate = new Date(user?.subscriptionStartDate);
    // let IscanCancel = false;
    // if (user?.planId === "free_trial") {
    //   IscanCancel = currentDate - subscriptionStartDate < 7 * 24 * 60 * 60 * 1000;
    // } else if (user?.planId === "student_plan") {
    //   IscanCancel =
    //     currentDate - subscriptionStartDate < 30 * 24 * 60 * 60 * 1000;
    // }

    // console.log("IscanCancel:", IscanCancel)

  },[])

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col p-6 lg:ml-72 lg:p-8 pt-20 md:pt-20 lg:pt-6">
        {/* Loading overlay */}
        {loading && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex justify-center items-center">
            <p className="text-white text-lg">Processing...</p>
          </div>
        )}

        {/* Success message */}
        {showSuccessMessage && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Update Successful</h3>
              <p>{successMessage}</p>
              <div className="mt-4 flex justify-left">
                <button
                  onClick={() => setShowSuccessMessage(false)}
                  className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white font-medium"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}

        <h1 className="text-2xl lg:text-3xl font-bold mb-6">Settings</h1>
        <div className="space-y-8">
          {/* Profile Settings */}
          <div className="bg-white p-4 lg:p-6 rounded-lg shadow">
            <h2 className="text-xl lg:text-2xl font-semibold mb-4">
              Profile Settings
            </h2>

            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={handleEmailChange}
                disabled={user?.isGoogleAccount}
                className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm ${
                  user?.isGoogleAccount
                    ? "cursor-not-allowed"
                    : "focus:ring-blue-500 focus:border-blue-500"
                }`}
              />
            </div>
            <button
              onClick={handleUpdateProfile}
              disabled={loading || user?.isGoogleAccount}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                loading || user?.isGoogleAccount
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
            {user?.isGoogleAccount && (
              <p className="text-gray-500">
                Your email cannot be changed as your account is linked with
                Google.
              </p>
            )}
            {profileError && (
              <p className="text-red-500 mt-2">{profileError}</p>
            )}
          </div>

          {/* Subscription Settings */}
          <div className="bg-white p-4 lg:p-6 rounded-lg shadow">
            <h2 className="text-xl lg:text-2xl font-semibold mb-4">
              Subscription Settings
            </h2>
            <p className="mb-4">
              Manage your subscription plan and billing information.
            </p>
            <button
              // disabled={!canCancel}
              onClick={handleCancelSubscription}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 `}
            >
              Cancel Subscription
            </button>

            {!canCancel && subscriptionEndDate && (
              <div className="mt-2 text-sm text-gray-700">
                <p>
                  Your subscription is scheduled to end on{" "}
                  <span className="font-semibold">
                    {formatDate(subscriptionEndDate)}
                  </span>
                  . No further action is needed.
                </p>
              </div>
            )}
            {subscriptionError && (
              <p className=" text-red-500 mt-2">{subscriptionError}</p>
            )}
          </div>

          {/* Confirmation Dialog */}
          {showConfirmationDialog && (
            <ConfirmationDialog
              isOpen={showConfirmationDialog}
              onClose={() => setShowConfirmationDialog(false)}
              onConfirm={handleConfirmCancellation}
            />
          )}

          {/* End Subscription Message */}
          {subscriptionEndDate && (
            <div className="text-center p-4 my-4 bg-green-100 text-green-700 rounded">
              <p>
                Your subscription will end on {subscriptionEndDate}. Thank you
                for using our service.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
