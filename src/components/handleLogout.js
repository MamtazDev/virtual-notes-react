import axios from "axios";

export const handleLogout = async (setUser, navigate) => {
  try {
    await axios.post(
      "http://localhost:5000/api/user/logout",
      {},
      { withCredentials: true }
    );
    setUser(null);
    navigate("/");
  } catch (error) {
    console.error("Logout error:", error);
  }
};
