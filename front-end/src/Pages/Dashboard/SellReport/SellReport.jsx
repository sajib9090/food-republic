import { NavLink, Outlet } from "react-router-dom";

const SellReport = () => {
  const menu = [
    {
      id: 1,
      title: "Sell Calculation",
      link: "sell-calculation",
    },
    {
      id: 2,
      title: "Find Sell Invoice",
      link: "find-sell-invoice",
    },

    {
      id: 4,
      title: "Find Void Invoice",
      link: "find-void-invoice",
    },
  ];

  return (
    <div>
      <div className="h-[50px] w-full flex items-center justify-center border-b border-blue-200 space-x-4">
        {menu.map((item) => (
          <NavLink
            to={item.link}
            key={item.id}
            className={({ isActive }) =>
              isActive
                ? "bg-blue-600 border border-blue-600 px-2 rounded-md text-white text-base"
                : "bg-white border border-blue-600 px-2 rounded-md text-blue-600 text-base hover:bg-blue-600 hover:text-white transition-all duration-500"
            }
          >
            {item.title}
          </NavLink>
        ))}
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default SellReport;
