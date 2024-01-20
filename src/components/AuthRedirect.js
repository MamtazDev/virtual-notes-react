import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../UserContext";

const AuthRedirect = () => {
  const { user, checkAuth } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuthCheck = async () => {
      await checkAuth();
      if (!user) {
        navigate("/login");
      }
    };

    initAuthCheck();
  }, [user, checkAuth, navigate]);

  return null;
};

export default AuthRedirect;
