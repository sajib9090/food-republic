import { NavLink, Outlet } from "react-router-dom";

const StaffRecord = () => {
  const menu = [
    {
      id: 0,
      title: "Add Staff",
      link: "add-staff",
    },
  ];

  return (
    <div>
      <div className="min-h-[50px] w-full flex flex-wrap gap-2 items-center justify-center border-b border-blue-200 py-2">
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

export default StaffRecord;
