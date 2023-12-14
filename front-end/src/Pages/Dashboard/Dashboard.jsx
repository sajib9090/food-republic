import { NavLink, Outlet } from "react-router-dom";
import { useUserContext } from "../../GlobalContext/UserContext";

const Dashboard = () => {
  const { singleUser } = useUserContext();
  // console.log(singleUser);

  return (
    <div>
      {singleUser ? (
        singleUser?.role == "admin" || singleUser?.role == "chairman" ? (
          <div className="h-[40px] w-full flex items-center justify-center space-x-4 border-b border-gray-200">
            <NavLink
              to={"inventory"}
              className={({ isActive }) =>
                isActive
                  ? "text-lg font-bold hover:underline text-blue-600"
                  : "text-lg font-bold"
              }
            >
              {"Inventory"}
            </NavLink>
            <NavLink
              to={"sell-report"}
              className={({ isActive }) =>
                isActive
                  ? "text-lg font-bold hover:underline text-blue-600"
                  : "text-lg font-bold"
              }
            >
              {"Sell Report"}
            </NavLink>
            <NavLink
              to={"features"}
              className={({ isActive }) =>
                isActive
                  ? "text-lg font-bold hover:underline text-blue-600"
                  : "text-lg font-bold"
              }
            >
              {"Features"}
            </NavLink>
          </div>
        ) : (
          <div className="h-[40px] w-full flex items-center justify-center space-x-4 border-b border-gray-200">
            <NavLink
              to={"inventory"}
              className={({ isActive }) =>
                isActive
                  ? "text-lg font-bold hover:underline text-blue-600"
                  : "text-lg font-bold"
              }
            >
              {"Inventory"}
            </NavLink>
            <NavLink
              to={"sell-report"}
              className={({ isActive }) =>
                isActive
                  ? "text-lg font-bold hover:underline text-blue-600"
                  : "text-lg font-bold"
              }
            >
              {"Sell Report"}
            </NavLink>
          </div>
        )
      ) : null}
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
