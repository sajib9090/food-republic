import { NavLink, Outlet } from "react-router-dom";
import { useUserContext } from "../../../GlobalContext/UserContext";
import { CgViewComfortable } from "react-icons/cg";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import { RiFolderReduceFill } from "react-icons/ri";
import { MdOutlineReduceCapacity } from "react-icons/md";
import { FaUserGraduate } from "react-icons/fa";

const Features = () => {
  const { singleUser } = useUserContext();

  const menu = [
    {
      id: 1,
      title: "Maintain Tables",
      link: "maintain-tables",
      icon: <CgViewComfortable className="h-6 w-6" />,
    },
    {
      id: 2,
      title: "Maintain Menu Items",
      link: "maintain-menu-items",
      icon: <MdOutlineRestaurantMenu className="h-6 w-6" />,
    },
    {
      id: 3,
      title: "Maintain Void",
      link: "maintain-void",
      icon: <RiFolderReduceFill className="h-6 w-6" />,
    },
    {
      id: 4,
      title: "Maintain Members",
      link: "maintain-members",
      icon: <MdOutlineReduceCapacity className="h-6 w-6" />,
    },
    {
      id: 5,
      title: "Maintain Users",
      link: "maintain-users",
      icon: <FaUserGraduate className="h-5 w-5" />,
    },
  ];

  const isAuthority =
    singleUser?.role === "admin" || singleUser?.role === "chairman" || false;

  return (
    <div>
      <div className="min-h-[50px] w-full flex flex-wrap gap-2 items-center justify-center border-b border-blue-200 py-2">
        {menu?.slice(0, isAuthority ? menu?.length : 2).map((item) => (
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

export default Features;
