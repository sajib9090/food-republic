import axios from "axios";
import { useEffect, useState } from "react";
import { MdDining } from "react-icons/md";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import { useCartContext } from "../../GlobalContext/CartContext";

const Sell = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { carts } = useCartContext();

  // console.log(carts);

  const uniqueTableNames =
    carts && carts?.length > 0
      ? [...new Set(carts?.map((item) => item?.table_name))]
      : [];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/tables`
        );
        setTableData(response.data.tables);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  return (
    <>
      {loading ? (
        <div className="min-h-[calc(100vh-120px)] flex justify-center items-center">
          <Loader />
        </div>
      ) : (
        <div>
          <h1 className="text-center font-bold text-3xl text-[#1677FF] my-4">
            Select a Table First
          </h1>
          <div className="grid grid-cols-4 gap-6">
            {tableData &&
              tableData?.map((table) => {
                const staffNamesForTable = carts
                  ?.filter((cart) => cart?.table_name === table?.name)
                  .map((cart) => cart?.staffName);

                const lastStaffName =
                  staffNamesForTable[staffNamesForTable.length - 1];

                return (
                  <Link
                    to={`${table?.name}`}
                    key={table._id}
                    className={`h-[200px] border border-gray-200 rounded-full shadow-xl flex flex-col justify-center items-center ${
                      uniqueTableNames?.includes(table?.name)
                        ? "bg-red-300"
                        : "hover:bg-[#1677ff1f] cursor-pointer hover:text-[#1677FF] duration-700"
                    }`}
                  >
                    <MdDining className="h-12 w-12 mb-2" />
                    <h1 className="text-lg font-bold capitalize">
                      {table.name}
                    </h1>
                    {lastStaffName && (
                      <p className="text-sm text-gray-600 capitalize mt-1">
                        Pending by{" "}
                        <span className="text-red-900 font-extrabold">
                          {lastStaffName}
                        </span>
                      </p>
                    )}
                  </Link>
                );
              })}
          </div>
        </div>
      )}
    </>
  );
};

export default Sell;
