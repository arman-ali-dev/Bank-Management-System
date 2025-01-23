import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const token = Cookies.get("auth-token");
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
      const { data } = await axios.get(
        "https://ali-bank.onrender.com/api/users/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(data.user);
    } catch (error) {
      if (error.response) {
        console.log(error.response.data.msg);
      } else {
        console.log(error.message);
      }
    }
  };

  useEffect(() => {
    fetchUser();
  }, [token]);

  const logoutHandler = () => {
    Cookies.remove("auth-token");
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, logoutHandler, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
