import { NavLink, Outlet } from "react-router-dom";
import { TbCoinTakaFilled } from "react-icons/tb";
import { MdOutlineImageSearch } from "react-icons/md";
import { RiDatabaseLine } from "react-icons/ri";

const ExpenseReport = () => {
  const menu = [
    {
      id: 1,
      title: "Add Daily Expenses",
      link: "add-daily-expenses",
      icon: <TbCoinTakaFilled className="w-6 h-6" />,
    },
    {
      id: 2,
      title: "Find Expenses",
      link: "find-expenses",
      icon: <MdOutlineImageSearch className="w-6 h-6" />,
    },
    {
      id: 3,
      title: "Expense History",
      link: "expense-history",
      icon: <RiDatabaseLine className="w-6 h-6" />,
    },
  ];
  return (
    <div>
      <div className="h-[50px] w-full flex items-center justify-center border-b border-blue-200 space-x-4">
        {menu.map((item) => (
          <NavLink
            to={item.link}
            title={item.title}
            key={item.id}
            className={({ isActive }) =>
              isActive
                ? "bg-blue-600 border border-blue-600 px-2 rounded-md text-white text-base flex items-center"
                : "bg-white border border-blue-600 px-2 rounded-md text-blue-600 text-base hover:bg-blue-600 hover:text-white transition-all duration-500 flex items-center"
            }
          >
            <div className="mr-1">{item.icon}</div>
            <div>{item.title}</div>
          </NavLink>
        ))}
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default ExpenseReport;
