/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import Main from "../Layout/Main";
import Home from "../Pages/Home/Home";
import Login from "../Pages/Login/Login";
import PrivateRoute from "./PrivateRoute";
import PrimaryLoader from "../components/PrimaryLoader/PrimaryLoader";
import Error from "../Pages/Error/Error";
import ExpenseReport from "../Pages/Dashboard/ExpenseReport/ExpenseReport";
const Sell = lazy(() => import("../Pages/Sell/Sell"));
const SelectOrders = lazy(() => import("../Pages/SelectOrders/SelectOrders"));
const Dashboard = lazy(() => import("../Pages/Dashboard/Dashboard"));
const SellReport = lazy(() =>
  import("../Pages/Dashboard/SellReport/SellReport")
);
const Features = lazy(() => import("../Pages/Dashboard/Features/Features"));
const MaintainTables = lazy(() =>
  import("../Pages/Dashboard/Features/MaintainTables/MaintainTables")
);
const MaintainUsers = lazy(() =>
  import("../Pages/Dashboard/Features/MaintainUsers/MaintainUsers")
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
const AddDailyExpenses = lazy(() =>
  import("../Pages/Dashboard/ExpenseReport/AddDailyExpenses/AddDailyExpenses")
);
const FindExpenses = lazy(() =>
  import("../Pages/Dashboard/ExpenseReport/FindExpenses/FindExpenses")
);
const SellHistory = lazy(() =>
  import("../Pages/Dashboard/SellReport/SellHistory/SellHistory")
);
const ExpenseHistory = lazy(() =>
  import("../Pages/Dashboard/ExpenseReport/ExpenseHistory/ExpenseHistory")
);
const MaintainMembers = lazy(() =>
  import("../Pages/Dashboard/Features/MaintainMembers/MaintainMembers")
);
const MaintainMenuItems = lazy(() =>
  import("../Pages/Dashboard/Features/MaintainMenuItems/MaintainMenuItems")
);
const StaffRecord = lazy(() =>
  import("../Pages/Dashboard/StaffRecord/StaffRecord")
);
const AddStaff = lazy(() =>
  import("../Pages/Dashboard/StaffRecord/AddStaff/AddStaff")
);
const StaffSellRecord = lazy(() =>
  import("../Pages/Dashboard/StaffRecord/StaffSellRecord/StaffSellRecord")
);
const SellSummary = lazy(() =>
  import("../Pages/Dashboard/SellReport/SellSummary/SellSummary")
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute>
        <Main />
      </PrivateRoute>
    ),
    errorElement: <Error />,
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
            path: "staff-record",
            element: (
              <Suspense fallback={<PrimaryLoader />}>
                <StaffRecord />
              </Suspense>
            ),
            children: [
              {
                path: "add-staff",
                element: (
                  <Suspense fallback={<PrimaryLoader />}>
                    <AddStaff />
                  </Suspense>
                ),
              },
              {
                path: "staff-sell-record",
                element: (
                  <Suspense fallback={<PrimaryLoader />}>
                    <StaffSellRecord />
                  </Suspense>
                ),
              },
            ],
          },
          {
            path: "expense-report",
            element: (
              <Suspense fallback={<PrimaryLoader />}>
                <ExpenseReport />
              </Suspense>
            ),
            children: [
              {
                path: "add-daily-expenses",
                element: (
                  <Suspense fallback={<PrimaryLoader />}>
                    <AddDailyExpenses />
                  </Suspense>
                ),
              },
              {
                path: "find-expenses",
                element: (
                  <Suspense fallback={<PrimaryLoader />}>
                    <FindExpenses />
                  </Suspense>
                ),
              },
              {
                path: "expense-history",
                element: (
                  <Suspense fallback={<PrimaryLoader />}>
                    <ExpenseHistory />
                  </Suspense>
                ),
              },
            ],
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
                path: "sell-history",
                element: (
                  <Suspense fallback={<PrimaryLoader />}>
                    <SellHistory />
                  </Suspense>
                ),
              },
              {
                path: "sell-summary",
                element: (
                  <Suspense fallback={<PrimaryLoader />}>
                    <SellSummary />
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
              {
                path: "maintain-members",
                element: (
                  <Suspense fallback={<PrimaryLoader />}>
                    <MaintainMembers />
                  </Suspense>
                ),
              },
              {
                path: "maintain-menu-items",
                element: (
                  <Suspense fallback={<PrimaryLoader />}>
                    <MaintainMenuItems />
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
