import axios from "axios";
import { useEffect, useState, Fragment } from "react";
import { MdDining } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import { useCartContext } from "../../GlobalContext/CartContext";
import LiveTimeCounter from "../../components/LiveTimeCounter/LiveTimeCounter";

import { Dialog, Transition } from "@headlessui/react";
import CurrencyFormatter from "../../components/CurrencyFormatter/CurrencyFormatter";

const Sell = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableError, setTableError] = useState("");
  const { carts } = useCartContext();

  let [isOpen, setIsOpen] = useState(false); // Default to false
  const navigate = useNavigate();

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

        setTableData(response?.data?.tables);

        setLoading(false);
      } catch (error) {
        setTableError(error?.response?.data);

        if (
          error?.response?.data?.message === "Your subscription is expired."
        ) {
          setIsOpen(true); // Open modal only on payment issue
        }
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
                const staffOrdersForTable = carts
                  ?.filter((cart) => cart?.table_name === table?.name)
                  .map((cart) => ({
                    staffName: cart?.staffName,
                    orderTime: cart?.orderTime,
                  }));

                const lastStaffOrder =
                  staffOrdersForTable[staffOrdersForTable.length - 1];

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
                    {lastStaffOrder && (
                      <div className="text-sm text-gray-600 mt-1">
                        <p className="capitalize text-center">
                          Pending by{" "}
                          <span className="text-purple-900 font-extrabold">
                            {lastStaffOrder.staffName}
                          </span>
                        </p>
                        <div className="text-center text-xs text-red-900 font-medium">
                          <LiveTimeCounter
                            startTime={new Date(lastStaffOrder.orderTime)}
                          />
                        </div>
                      </div>
                    )}
                  </Link>
                );
              })}
          </div>
        </div>
      )}

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsOpen(true)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-red-600"
                  >
                    Warning! Payment Required!
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-gray-600 mb-2">Dear User,</p>
                    <p className="mb-4 text-orange-800">
                      {tableError?.message}
                    </p>
                    <div className="text-gray-600 font-bold mb-4 flex items-center gap-4">
                      Total Due:{" "}
                      <CurrencyFormatter value={tableError?.dueAmount} />
                    </div>
                  </div>

                  <div className="mt-4">
                    <button
                      onClick={() => navigate("/payment")}
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    >
                      Make Payment
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Sell;
