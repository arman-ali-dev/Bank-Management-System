import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "./UserContext";
import axios from "axios";

const StatementContext = createContext();

export const useStatement = () => {
  return useContext(StatementContext);
};

export const StatmentProvider = ({ children }) => {
  const { user } = useUser();
  const [statements, setStatements] = useState([]);

  const fetchStatments = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:8000/transections/statements/${user?.accountNumber}`
      );

      setStatements(data.statements);
    } catch (error) {
      if (error.response) {
        console.log(error.response.data.error);
      } else {
        console.log(error.message);
      }
    }
  };

  useEffect(() => {
    if (user) {
      fetchStatments();
    }
  }, [user]);
  return (
    <StatementContext.Provider value={statements}>
      {children}
    </StatementContext.Provider>
  );
};
