import axios from "axios";
import { API_URL } from "../config/config";

export const handleLogout = async (setUser, navigate) => {
  try {
    await axios.post(
      `${API_URL}/api/user/logout`,
      {},
      { withCredentials: true }
    );
    setUser(null);
    navigate("/");
  } catch (error) {
    console.error("Logout error:", error);
  }
};
