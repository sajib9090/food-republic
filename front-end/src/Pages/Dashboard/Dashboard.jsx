import { NavLink, Outlet } from "react-router-dom";
import { FaSellsy } from "react-icons/fa";
import { LiaUserSecretSolid } from "react-icons/lia";
import { MdOutlineStorefront } from "react-icons/md";
import { FaUserFriends } from "react-icons/fa";
import { GiNuclearWaste } from "react-icons/gi";

const Dashboard = () => {
  return (
    <div>
      <div className="h-[40px] w-full flex items-center justify-center space-x-4 border-b border-gray-200">
        <NavLink
          title="Staff Record"
          to={"staff-record"}
          className={({ isActive }) =>
            isActive
              ? "text-lg font-bold hover:underline text-blue-600 flex items-center"
              : "text-lg font-bold flex items-center"
          }
        >
          <FaUserFriends className="w-6 h-6 mr-1" />
          {"Staff Record"}
        </NavLink>
        <NavLink
          title="Expense Report"
          to={"expense-report"}
          className={({ isActive }) =>
            isActive
              ? "text-lg font-bold hover:underline text-blue-600 flex items-center"
              : "text-lg font-bold flex items-center"
          }
        >
          <GiNuclearWaste className="w-6 h-6 mr-1" />
          {"Expense Report"}
        </NavLink>
        <NavLink
          title="Inventory"
          to={"inventory"}
          className={({ isActive }) =>
            isActive
              ? "text-lg font-bold hover:underline text-blue-600 flex items-center"
              : "text-lg font-bold flex items-center"
          }
        >
          <MdOutlineStorefront className="w-6 h-6 mr-1" />
          {"Inventory"}
        </NavLink>
        <NavLink
          title="Sell Report"
          to={"sell-report"}
          className={({ isActive }) =>
            isActive
              ? "text-lg font-bold hover:underline text-blue-600 flex items-center"
              : "text-lg font-bold flex items-center"
          }
        >
          <FaSellsy className="w-6 h-6 mr-1" />
          {"Sell Report"}
        </NavLink>
        <NavLink
          title="Features"
          to={"features"}
          className={({ isActive }) =>
            isActive
              ? "text-lg font-bold hover:underline text-blue-600 flex items-center"
              : "text-lg font-bold flex items-center"
          }
        >
          <LiaUserSecretSolid className="w-6 h-6 mr-1" />
          {"Features"}
        </NavLink>
      </div>

      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
