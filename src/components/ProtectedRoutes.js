import React, { useContext, useNavigate, useEffect } from "react";
import UserContext from "../UserContext";

const ProtectedRoute = ({ children }) => {
  const { user, isSubscriptionActive } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.planId === "defaultPlanId") {
      navigate("/pricing");
    }
  }, [user, navigate]);  

  useEffect(() => {
    if (!user || !isSubscriptionActive) {
      navigate("/login");
    }
  }, [user, isSubscriptionActive, navigate]);

  if (!user || !isSubscriptionActive) {
    return <div>Loading...</div>;
  }

  return children;
};

export default ProtectedRoute;
