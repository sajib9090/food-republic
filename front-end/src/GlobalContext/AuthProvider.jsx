/* eslint-disable react/prop-types */
import { createContext, useEffect } from "react";

import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { useState } from "react";
import { app } from "../firebase/firebase.config";

export const AuthContext = createContext(null);
const auth = getAuth(app);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // create user with email and password
  const createNewUserWithEmail = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // sign in with email and password
  const signInWithEmail = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // logout
  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  // on auth state changed
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (loggedInUser) => {
      setUser(loggedInUser);
      setLoading(false);
    });
    return () => {
      return unSubscribe();
    };
  }, []);

  //auth info
  const authInfo = {
    user,
    loading,
    setLoading,
    createNewUserWithEmail,
    logOut,
    signInWithEmail,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
