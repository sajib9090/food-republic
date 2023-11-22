import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./Routes/Routes";
import "./index.css";
import { ItemsProvider } from "./GlobalContext/ItemsContext";
import { CartProvider } from "./GlobalContext/CartContext";
import AuthProvider from "./GlobalContext/AuthProvider";
import { Toaster } from "react-hot-toast";
import { UserContextProvider } from "./GlobalContext/UserContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Toaster />
    <AuthProvider>
      <UserContextProvider>
        <ItemsProvider>
          <CartProvider>
            <RouterProvider router={router}></RouterProvider>
          </CartProvider>
        </ItemsProvider>
      </UserContextProvider>
    </AuthProvider>
  </React.StrictMode>
);
