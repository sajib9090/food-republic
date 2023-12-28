import axios from "axios";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { RiLoader2Line } from "react-icons/ri";
import CurrencyFormatter from "../../../../components/CurrencyFormatter/CurrencyFormatter";

const ExpenseHistory = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [findDataByMonth, setFindDataByMonth] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Update totalExpense whenever findDataByMonth changes
    const sum = findDataByMonth?.reduce(
      (acc, item) => acc + item?.totalExpenses,
      0
    );
    setTotalExpense(sum);
  }, [findDataByMonth]);

  const handleSearch = () => {
    setSelectedDate(selectedDate);
    if (selectedDate) {
      setLoading(true);
      axios
        .get(
          `${
            import.meta.env.VITE_API_URL
          }/api/get-expenses-by-month?month=${selectedDate}`
        )
        .then((res) => {
          setFindDataByMonth(res.data.result);
        })
        .catch((err) => {
          if (err) {
            toast.error("Something went wrong.");
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      toast.error("Select a date first");
    }
  };

  return (
    <div>
      <div className="max-w-[310px] mx-auto">
        <h1 className="text-base my-1">Pick a month</h1>
        <div className="flex">
          <input
            type="month"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="h-[30px] w-[70%] bg-blue-600 text-white px-2 rounded-l"
          />
          <button
            onClick={handleSearch}
            className="h-[30px] w-[30%] bg-blue-600 text-white border-l border-white rounded-r flex items-center justify-center"
          >
            Search{" "}
            {loading ? (
              <RiLoader2Line className="h-5 w-5 animate-spin text-white " />
            ) : null}
          </button>
        </div>
      </div>
      {loading ? (
        <h1 className="text-center font-semibold mt-4 text-lg">
          Please wait...
        </h1>
      ) : (
        <>
          {findDataByMonth && findDataByMonth?.length > 0 ? (
            <>
              <div className="mt-12">
                <table className="border-collapse w-full">
                  <thead>
                    <tr className="bg-blue-100">
                      <th className="w-[15%] border border-gray-400 p-[8px]">
                        Date
                      </th>
                      <th className="w-[70%] border border-gray-400 p-[8px]">
                        Details
                      </th>
                      <th className="w-[15%] border border-gray-400 p-[8px]">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {findDataByMonth?.map((data) => (
                      <tr key={data?._id}>
                        <td className="text-center bg-purple-50 font-bold text-lg border border-gray-400 p-[8px]">
                          {data?._id}
                        </td>
                        <td className="border border-gray-400 p-[8px]">
                          {data?.expenses?.map((expense, index) => (
                            <div
                              key={expense?._id}
                              className={`capitalize flex items-center justify-between py-2 px-8 bg-slate-200 ${
                                index === data?.expenses.length - 1
                                  ? ""
                                  : "border-b border-gray-300"
                              }`}
                            >
                              <p>{expense.title}</p>
                              <div>
                                {expense.expense_price} <span>tk.</span>
                              </div>
                            </div>
                          ))}
                        </td>
                        <td className="text-center bg-red-100 text-xl font-bold border border-gray-400 p-[8px]">
                          <CurrencyFormatter value={data.totalExpenses} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div>
                <div className="flex justify-end text-2xl mt-2 font-extrabold">
                  Total Expense:{" "}
                  <span className="ml-4">
                    <CurrencyFormatter value={totalExpense} />
                  </span>
                </div>
              </div>
            </>
          ) : (
            <h1 className="text-lg font-bold text-red-600 text-center mt-4">
              No data found.
            </h1>
          )}
        </>
      )}
    </div>
  );
};

export default ExpenseHistory;
