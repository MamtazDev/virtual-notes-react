import React, { useState, useContext, useEffect } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import UserContext from "../UserContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { gapi } from "gapi-script";
// import { GoogleLogin } from "react-google-login";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [hasLoggedIn, setHasLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const { setUser, setPlanId, checkAuth } = useContext(UserContext);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e) => {
    console.log("Form submitted");
    e.preventDefault();
    let tempErrors = {};

    if (!email || !validateEmail(email)) {
      tempErrors.email = "Please enter a valid email address for BrieflyNoted.";
    }

    if (!password || password.length < 6) {
      tempErrors.password = "Password should be at least 6 characters.";
    }

    setErrors(tempErrors);
    console.log("Validation errors:", tempErrors);

    if (Object.keys(tempErrors).length === 0) {
      const loginSuccessful = await handleLogin(email, password);
      if (loginSuccessful) {
        navigate("/ai-audio-summarizer");
      }
    }
  };

  const handleLogin = async (email, password) => {
    try {
      console.log("Login Request:", { email, password });
      const loginData = { email, password };
      console.log("Sending login request with:", loginData);
      const response = await axios.post(
        "http://localhost:5000/api/user/login",
        loginData,
        { withCredentials: true }
      );

      console.log("Login response received:", response);
      if (response.data && response.data.user) {
        setUser(response.data.user);
        setPlanId(response.data.user.planId);
        await checkAuth();
        navigate(
          response.data.user.planId ? "/ai-audio-summarizer" : "/pricing"
        );
        return true;
      } else {
        setLoginError("Failed to log in. Please try again.");
        return false;
      }
    } catch (error) {
      console.error("Error during Google login:", error);
      let errorMessage = "Failed to log in with Google. Please try again.";
      if (error.response && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      // setErrors({
      //   ...errors,
      //   googleLogin: errorMessage,
      // });
    }
  };

  const clientId =
    "228605974535-b8n2532qfielncavgd50qjbg34rs6b56.apps.googleusercontent.com";

  useEffect(() => {
    function start() {
      if (!gapi.auth2.getAuthInstance()) {
        gapi.auth2.init({
          clientId: clientId,
          scope: "email",
        });
      }
    }

    gapi.load("client:auth2", start);
  }, []);

  // const handleGoogleLogin = async (googleData) => {
  //   console.log("Google login data:", googleData);

  //   try {
  //     const { tokenId } = googleData;
  //     const response = await axios.post(
  //       "http://localhost:5000/api/user/google-login",
  //       { token: tokenId },
  //       { withCredentials: true }
  //     );

  //     console.log("Google login response:", response);

  //     if (response.data && response.data.user) {
  //       setUser(response.data.user);
  //       setPlanId(response.data.user.planId);

  //       await checkAuth();
  //       navigate(
  //         response.data.user.planId ? "/ai-audio-summarizer" : "/pricing"
  //       );
  //     } else {
  //       console.error("No user data received from backend");
  //       setLoginError("Failed to log in with Google. Please try again.");
  //     }
  //   } catch (error) {
  //     console.error("Error during Google login:", error);
  //     let errorMessage = "Failed to log in with Google. Please try again.";
  //     if (error.response && error.response.data.message) {
  //       errorMessage = error.response.data.message;
  //     }
  //     setErrors({
  //       ...errors,
  //       googleLogin: errorMessage,
  //     });
  //   }
  // };

  const handleLoginFailure = (error) => {
    console.error("Google Login Failed: ", error);

    // setErrors({
    //   ...errors,
    //   googleLogin: "Failed to log in with Google. Please try again.",
    // });
  };

  const navigateToSignup = () => {
    navigate("/signup");
  };

  const navigateToForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <motion.div className="flex flex-col min-h-screen bg-gray-100 pt-4">
      <div className="bg-gray-100 px-6 pt-1">
        <div className="container mx-auto flex flex-col px-4 lg:px-20">
          <Navbar />

          <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md w-full space-y-8">
              <div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                  Sign in to your account
                </h2>
              </div>
              <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <input type="hidden" name="remember" defaultValue="true" />
                <div className="rounded-md shadow-sm -space-y-px">
                  <div>
                    <label htmlFor="email-address" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="email-address"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="sr-only">
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    {loginError && (
                      <div className="text-red-500 p-2">{loginError}</div>
                    )}
                      {/* {errors.googleLogin && (
                        <div className="text-red-500 p-2">
                          {errors.googleLogin}
                        </div>
                      )} */}
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-00 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Sign in
                  </button>
                </div>
                {/* Forgot password link */}
                <div className="text-xs text-center">
                  <button
                    onClick={navigateToForgotPassword}
                    className="font-medium text-blue-500 hover:text-blue-600"
                  >
                    Forgot your password?
                  </button>
                </div>
              </form>

              {/* Other authentication methods */}
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
                      Sign in with Google
                    </button>
                  )}
                  onSuccess={handleGoogleLogin}
                  onFailure={handleLoginFailure}
                  cookiePolicy={"single_host_origin"}
                /> */}
              </div>
              {/* Sign up link */}
              <div className="text-center text-sm mt-4">
                Don't have an account?{" "}
                <button onClick={navigateToSignup} className="text-blue-500">
                  Sign up
                </button>
              </div>

              {/* Terms and Privacy Policy */}
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

export default Login;
