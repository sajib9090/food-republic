import { NavLink, Outlet } from "react-router-dom";
import { TbCoinTakaFilled } from "react-icons/tb";
import { MdOutlineImageSearch } from "react-icons/md";
import { LiaFunnelDollarSolid } from "react-icons/lia";
import { MdOutlineManageHistory } from "react-icons/md";

const SellReport = () => {
  const menu = [
    {
      id: 1,
      title: "Sell Calculation",
      link: "sell-calculation",
      icon: <TbCoinTakaFilled className="w-6 h-6" />,
    },
    {
      id: 2,
      title: "Find Sell Invoice",
      link: "find-sell-invoice",
      icon: <MdOutlineImageSearch className="w-6 h-6" />,
    },
    {
      id: 3,
      title: "Sell History",
      link: "sell-history",
      icon: <LiaFunnelDollarSolid className="w-6 h-6" />,
    },
    // {
    //   id: 4,
    //   title: "Sell Summary",
    //   link: "sell-summary",
    //   icon: <MdOutlineManageHistory className="w-6 h-6" />,
    // },
    {
      id: 5,
      title: "Find Void Invoice",
      link: "find-void-invoice",
      icon: <MdOutlineImageSearch className="w-6 h-6" />,
    },
  ];

  return (
    <div>
      <div className="h-[50px] w-full flex items-center justify-center border-b border-blue-200 space-x-4">
        {menu.map((item) => (
          <NavLink
            title={item.title}
            to={item.link}
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

export default SellReport;
