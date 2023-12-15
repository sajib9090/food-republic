/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "./AuthProvider";

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [allUser, setAllUser] = useState([]);
  const [singleUser, setSingleUser] = useState({});
  const { user } = useContext(AuthContext);

  const fetchSingleUser = (users, currentUser) => {
    const foundUser = users?.find((u) => u?.email === currentUser?.email);
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

  const refetchUsers = () => {
    // Trigger a new fetch for user data
    fetchUsers(`${import.meta.env.VITE_API_URL}/api/get-users`);
  };

  useEffect(() => {
    // Fetch users when the component mounts
    fetchUsers(`${import.meta.env.VITE_API_URL}/api/get-users`);
  }, []); // Only fetch users once when the component mounts

  useEffect(() => {
    // Update singleUser when allUser or user changes
    fetchSingleUser(allUser, user);
  }, [allUser, user]);

  // Return value
  return (
    <UserContext.Provider
      value={{
        allUser,
        singleUser,
        refetchUsers,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};
