import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "./AuthProvider";

const UserContext = createContext();

// eslint-disable-next-line react/prop-types
export const UserContextProvider = ({ children }) => {
  const [allUser, setAllUser] = useState([]);

  const [singleUser, setSingleUser] = useState({});
  const { user } = useContext(AuthContext);

  const fetchSingleUser = (allUser, user) => {
    const foundUser = allUser?.find((u) => u?.email == user?.email);
    setSingleUser(foundUser);
  };

  const fetchUsers = (url) => {
    axios
      .get(url)
      .then((res) => {
        setAllUser(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    fetchUsers(`${import.meta.env.VITE_API_URL}/api/get-users`);
    fetchSingleUser(allUser, user);
  }, [user]);

  //return value
  return (
    <UserContext.Provider
      value={{
        allUser,
        singleUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};
