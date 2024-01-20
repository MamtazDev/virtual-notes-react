import axios from "axios";

export const handleLogout = async (setUser, navigate) => {
  try {
    await axios.post(
      "https://virtualserver.onrender.com/api/user/logout",
      {},
      { withCredentials: true }
    );
    setUser(null);
    navigate("/");
  } catch (error) {
    console.error("Logout error:", error);
  }
};
