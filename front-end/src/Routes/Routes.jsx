/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import Main from "../Layout/Main";
import Home from "../Pages/Home/Home";
import Login from "../Pages/Login/Login";
import PrivateRoute from "./PrivateRoute";
import PrimaryLoader from "../components/PrimaryLoader/PrimaryLoader";
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
const SoldInvoice = lazy(() => import("../Pages/SoldInvoice/SoldInvoice"));
const MaintainVoid = lazy(() =>
  import("../Pages/Dashboard/Features/MaintainVoid/MaintainVoid")
);
const SellCalculation = lazy(() =>
  import("../Pages/Dashboard/SellReport/SellCalculation/SellCalculation")
);

const FindSellInvoice = lazy(() =>
  import("../Pages/Dashboard/SellReport/FindSendInvoice/FindSellInvoice")
);
const FindVoidInvoice = lazy(() =>
  import("../Pages/Dashboard/SellReport/FindVoidInvoice/FindVoidInvoice")
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
          <Suspense fallback={<PrimaryLoader />}>
            <Sell />
          </Suspense>
        ),
      },
      {
        path: "/sell/:name",
        element: (
          <Suspense fallback={<PrimaryLoader />}>
            <SelectOrders />
          </Suspense>
        ),
      },
      {
        path: "/sell/:name/:id",
        element: (
          <Suspense fallback={<PrimaryLoader />}>
            <SoldInvoice />
          </Suspense>
        ),
      },
      {
        path: "/dashboard",
        element: (
          <Suspense fallback={<PrimaryLoader />}>
            <Dashboard />
          </Suspense>
        ),
        children: [
          {
            path: "inventory",
            element: (
              <Suspense fallback={<PrimaryLoader />}>
                <Inventory />
              </Suspense>
            ),
          },
          {
            path: "sell-report",
            element: (
              <Suspense fallback={<PrimaryLoader />}>
                <SellReport />
              </Suspense>
            ),
            children: [
              {
                path: "sell-calculation",
                element: (
                  <Suspense fallback={<PrimaryLoader />}>
                    <SellCalculation />
                  </Suspense>
                ),
              },
              {
                path: "find-sell-invoice",
                element: (
                  <Suspense fallback={<PrimaryLoader />}>
                    <FindSellInvoice />
                  </Suspense>
                ),
              },
              {
                path: "find-void-invoice",
                element: (
                  <Suspense fallback={<PrimaryLoader />}>
                    <FindVoidInvoice />
                  </Suspense>
                ),
              },
            ],
          },
          {
            path: "features",
            element: (
              <Suspense fallback={<PrimaryLoader />}>
                <Features />
              </Suspense>
            ),
            children: [
              {
                path: "maintain-tables",
                element: (
                  <Suspense fallback={<PrimaryLoader />}>
                    <MaintainTables />
                  </Suspense>
                ),
              },
              {
                path: "maintain-fast-food",
                element: (
                  <Suspense fallback={<PrimaryLoader />}>
                    <MaintainFastFood />
                  </Suspense>
                ),
              },
              {
                path: "maintain-drinks-and-juices",
                element: (
                  <Suspense fallback={<PrimaryLoader />}>
                    <MaintainDrinksAndJuices />
                  </Suspense>
                ),
              },
              {
                path: "maintain-vegetables-and-Rice",
                element: (
                  <Suspense fallback={<PrimaryLoader />}>
                    <MaintainVegetablesAndRices />
                  </Suspense>
                ),
              },
              {
                path: "maintain-users",
                element: (
                  <Suspense fallback={<PrimaryLoader />}>
                    <MaintainUsers />
                  </Suspense>
                ),
              },
              {
                path: "maintain-void",
                element: (
                  <Suspense fallback={<PrimaryLoader />}>
                    <MaintainVoid />
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
