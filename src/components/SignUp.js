import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { gapi } from "gapi-script";
// import { GoogleLogin } from "react-google-login";
import { FcGoogle } from "react-icons/fc";
import UserContext from "../UserContext";

const Signup = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);
  const { checkAuth, setUser, setPlanId } = useContext(UserContext);
  const navigate = useNavigate();

  const { email, password, confirmPassword } = formData;

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let tempErrors = {};
    setErrors({});

    if (!email || !validateEmail(email)) {
      tempErrors.email = "Please enter a valid email address.";
    }
    if (password.length < 6) {
      tempErrors.password = "Password should be at least 6 characters.";
    }
    if (password !== confirmPassword) {
      tempErrors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(tempErrors).length === 0) {
      try {
        const response = await axios.post(
          "https://virtualserver.onrender.com/api/user/signup",
          {
            email,
            password,
          },
          { withCredentials: true }
        );

        const { user } = response.data;

        setUser(user);
        setPlanId(user.planId);

        navigate(user.planId ? "/ai-audio-summarizer" : "/pricing");
      } catch (error) {
        setLoading(false);
        if (error.response) {
          // Handling known error responses from the server
          const errorMessage =
            error.response.data.message || "Error occurred during signup";
          setErrors({ server: errorMessage });
        } else {
          // Handling network errors or unexpected issues
          setErrors({ server: "Network error, please try again later." });
        }
      }
    } else {
      setErrors(tempErrors);
      setLoading(false);
    }
  };

  const clientId =
    "228605974535-b8n2532qfielncavgd50qjbg34rs6b56.apps.googleusercontent.com";

  const handleInputChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // Animations
  const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 1 } },
  };

  const slideFromRight = {
    initial: { x: 300, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { duration: 1 } },
  };

  const slideFromLeft = {
    initial: { x: -300, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { duration: 1 } },
  };

  const [ref1, inView1] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [ref2, inView2] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [ref3, inView3] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    function start() {
      if (!gapi.auth2.getAuthInstance()) {
        gapi.auth2
          .init({
            clientId: clientId,
            scope: "email profile",
          })
          .then(
            () => {},
            (error) => {
              console.error("Error loading GAPI client for API", error);
            }
          );
      }
    }

    gapi.load("client:auth2", start);
  }, []);

  const handleGoogleSignup = async (googleData) => {
    console.log("Google login data:", googleData);

    try {
      const { tokenId } = googleData;
      const response = await axios.post(
        "https://virtualserver.onrender.com/api/user/google-login",
        { token: tokenId },
        { withCredentials: true }
      );

      console.log("Google login response:", response);

      if (response.data && response.data.user) {
        setUser(response.data.user);
        setPlanId(response.data.user.planId);

        await checkAuth();
        navigate(
          response.data.user.planId ? "/ai-audio-summarizer" : "/pricing"
        );
      } else {
        console.error("No user data received from backend");
        setLoginError("Failed to log in with Google. Please try again.");
      }
    } catch (error) {
      console.error("Error during Google login:", error);
      let errorMessage = "Failed to log in with Google. Please try again.";
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        // Use the detailed error message from the backend
        errorMessage = error.response.data.message;
      }
      // setErrors({
      //   ...errors,
      //   googleLogin: errorMessage,
      // });
    }
  };

  const handleSignupFailure = (error) => {
    console.error("Google Login Failed: ", error);

    // setErrors({
    //   ...errors,
    //   googleLogin: "Failed to log in with Google. Please try again.",
    // });
  };
  return (
    <motion.div
      className="flex flex-col min-h-screen bg-gray-100 pt-4"
      {...fadeIn}
    >
      <div className="bg-gray-100 px-6 pt-1">
        <div className="container mx-auto flex flex-col px-4 lg:px-20">
          <Navbar />

          <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md w-full space-y-8">
              <div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                  Sign up for an account
                </h2>
              </div>
              <form className="mt-8 space-y-6" onSubmit={handleSignupSubmit}>
                <input type="hidden" name="remember" defaultValue="true" />
                <div className="rounded-md shadow-sm -space-y-px">
                  {/* Email Address Field */}
                  <div>
                    <label htmlFor="email-address" className="sr-only">
                      Email Address
                    </label>
                    <input
                      id="email-address"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  {/* Password Field */}
                  <div>
                    <label htmlFor="password" className="sr-only">
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                  </div>
                  {/* Confirm Password Field */}
                  <div>
                    <label htmlFor="confirm-password" className="sr-only">
                      Confirm Password
                    </label>
                    <input
                      id="confirm-password"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      required
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                    />
                    {errors.email && (
                      <div className="text-red-500 p-2">{errors.email}</div>
                    )}
                    {errors.password && (
                      <div className="text-red-500 p-2">{errors.password}</div>
                    )}
                    {errors.confirmPassword && (
                      <div className="text-red-500 p-2">
                        {errors.confirmPassword}
                      </div>
                    )}
                    {errors.server && (
                      <div className="text-red-500 p-2">{errors.server}</div>
                    )}
                    {/* {errors.googleLogin && (
                      <div className="text-red-500 p-2">
                        {errors.googleLogin}
                      </div>
                    )} */}
                  </div>
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    onClick={handleSignupSubmit}
                    disabled={loading}
                    className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                      loading ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-600"
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                  >
                    {loading ? "Signing Up..." : "Sign Up"}
                  </button>
                </div>
              </form>

              {/* Google Sign Up */}
              <div className="flex items-center justify-center space-x-2">
                <span className="h-px w-16 bg-gray-300"></span>
                <span className="text-gray-400 font-normal">OR</span>
                <span className="h-px w-16 bg-gray-300"></span>
              </div>

              <div>
                {/* <GoogleLogin
                  clientId={clientId}
                  render={(renderProps) => (
                    <button
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                      className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <FcGoogle className="h-5 w-5 mr-3" />
                      Sign up with Google
                    </button>
                  )}
                  onSuccess={handleGoogleSignup}
                  onFailure={handleSignupFailure}
                  cookiePolicy={"single_host_origin"}
                /> */}
              </div>

              <div className="text-center text-sm mt-4">
                Already have a VirtuNotes Account?{" "}
                <Link to="/login" className="text-blue-500">
                  Sign in
                </Link>
              </div>
              <div className="text-center text-sm mt-2">
                By using VirtuNotes you agree to the{" "}
                <Link to="/terms" className="text-blue-500">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-blue-500">
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Signup;
