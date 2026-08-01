import { createContext, useEffect, useState } from "react";
import { api } from "./src/api";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext();

const ContextProvider = ({ children }) => {
  const [user, setUser] = useState(undefined);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  console.log(user, "setUser")

  const getEmpDetails = async () => {
    try {
      
      const response = await api.get("AuthController/getUserById");

      if (response?.status === 200) {
        setUser(response?.data?.data);
      }
    } catch (error) {
       setUser(null);
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("LoggedIn");
        navigate("/login", { replace: true });
      }

      console.error(error);
    } 
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (localStorage.getItem("LoggedIn")) {
        await getEmpDetails();
      }
    };
    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{ user, setUser, getEmpDetails, loader, setLoader }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default ContextProvider;
