/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import Main from "../Layout/Main";
import Home from "../Pages/Home/Home";
import Login from "../Pages/Login/Login";
import PrivateRoute from "./PrivateRoute";
const Sell = lazy(() => import("../Pages/Sell/Sell"));
const SelectOrders = lazy(() => import("../Pages/SelectOrders/SelectOrders"));
const Dashboard = lazy(() => import("../Pages/Dashboard/Dashboard"));
const Inventory = lazy(() => import("../Pages/Dashboard/Inventory/Inventory"));
const SellReport = lazy(() =>
  import("../Pages/Dashboard/SellReport/SellReport")
);
const Features = lazy(() => import("../Pages/Dashboard/Features/Features"));
const MaintainTables = lazy(() =>
  import("../Pages/Dashboard/Features/MaintainTables/MaintainTables")
);
const MaintainFastFood = lazy(() =>
  import("../Pages/Dashboard/Features/MaintainFastFood/MaintainFastFood")
);
const MaintainUsers = lazy(() =>
  import("../Pages/Dashboard/Features/MaintainUsers/MaintainUsers")
);
const MaintainDrinksAndJuices = lazy(() =>
  import(
    "../Pages/Dashboard/Features/MaintainDrinksAndJuices/MaintainDrinksAndJuices"
  )
);
const MaintainVegetablesAndRices = lazy(() =>
  import(
    "../Pages/Dashboard/Features/MaintainVegetablesAndRices/MaintainVegetablesAndRices"
  )
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute>
        <Main />
      </PrivateRoute>
    ),
    errorElement: <h1>Error</h1>,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/sell",
        element: (
          <Suspense fallback={<h1 className="text-center">Loading...</h1>}>
            <Sell />
          </Suspense>
        ),
      },
      {
        path: "/sell/:name",
        element: (
          <Suspense fallback={<h1 className="text-center">Loading...</h1>}>
            <SelectOrders />
          </Suspense>
        ),
      },
      {
        path: "/dashboard",
        element: (
          <Suspense fallback={<h1 className="text-center">Loading...</h1>}>
            <Dashboard />
          </Suspense>
        ),
        children: [
          {
            path: "inventory",
            element: (
              <Suspense fallback={<h1 className="text-center">Loading...</h1>}>
                <Inventory />
              </Suspense>
            ),
          },
          {
            path: "sell-report",
            element: (
              <Suspense fallback={<h1 className="text-center">Loading...</h1>}>
                <SellReport />
              </Suspense>
            ),
          },
          {
            path: "features",
            element: (
              <Suspense fallback={<h1 className="text-center">Loading...</h1>}>
                <Features />
              </Suspense>
            ),
            children: [
              {
                path: "maintain-tables",
                element: (
                  <Suspense
                    fallback={<h1 className="text-center">Loading...</h1>}
                  >
                    <MaintainTables />
                  </Suspense>
                ),
              },
              {
                path: "maintain-fast-food",
                element: (
                  <Suspense
                    fallback={<h1 className="text-center">Loading...</h1>}
                  >
                    <MaintainFastFood />
                  </Suspense>
                ),
              },
              {
                path: "maintain-drinks-and-juices",
                element: (
                  <Suspense
                    fallback={<h1 className="text-center">Loading...</h1>}
                  >
                    <MaintainDrinksAndJuices />
                  </Suspense>
                ),
              },
              {
                path: "maintain-vegetables-and-Rice",
                element: (
                  <Suspense
                    fallback={<h1 className="text-center">Loading...</h1>}
                  >
                    <MaintainVegetablesAndRices />
                  </Suspense>
                ),
              },
              {
                path: "maintain-users",
                element: (
                  <Suspense
                    fallback={<h1 className="text-center">Loading...</h1>}
                  >
                    <MaintainUsers />
                  </Suspense>
                ),
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);
