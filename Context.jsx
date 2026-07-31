import { createContext, useEffect, useState } from "react";
import { api } from "./src/api";

export const UserContext = createContext();

const ContextProvider = ({ children }) => {
  const [user, setUser] = useState();

  const getEmpDetails = async () => {
    try {
      const response = await api.get("AuthController/getUserById");
      console.log(response);
      if (response?.status === 200) {
        setUser(response?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  
  const logged = localStorage.getItem("LoggedIn");

  useEffect(() => {
    const fetchUser = async () => {
      if (logged) {
        await getEmpDetails();
      }
    };
    fetchUser();
  }, [logged]);

  return (
    <UserContext.Provider value={{ user, setUser, getEmpDetails }}>
      {children}
    </UserContext.Provider>
  );
};

export default ContextProvider;
