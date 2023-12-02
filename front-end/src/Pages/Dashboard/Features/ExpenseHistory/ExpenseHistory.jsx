import axios from "axios";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { RiLoader2Line } from "react-icons/ri";
import CurrencyFormatter from "../../../../components/CurrencyFormatter/CurrencyFormatter";
import DateFormatter from "../../../../components/DateFormatter/DateFormatter";

const ExpenseHistory = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [findDataByMonth, setFindDataByMonth] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Update totalExpense whenever findDataByMonth changes
    const sum = findDataByMonth.reduce(
      (acc, item) => acc + item.expense_price,
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
          }/api/get-expenses?month=${selectedDate}`
        )
        .then((res) => {
          setFindDataByMonth(res.data.expenses);
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
              <div className="mt-4 mx-auto grid grid-cols-3 gap-2">
                {findDataByMonth &&
                  findDataByMonth
                    .sort(
                      (a, b) =>
                        new Date(a.createdDate) - new Date(b.createdDate)
                    )
                    .map((item, index) => (
                      <div
                        key={item._id}
                        className="min-h-[40px] border-b border-r border-l border-gray-300 flex items-center justify-between px-2"
                      >
                        <div className="flex items-center text-xs">
                          <p>{index + 1}.</p>
                          <p className="wrapped-text">{item.title}</p>
                        </div>
                        <div className="flex items-center text-xs">
                          <div>
                            <p>{item.creator}</p>
                            <div className="text-[8px] text-gray-400">
                              <DateFormatter dateString={item.createdDate} />
                            </div>
                          </div>
                          <div className="ml-4">
                            <CurrencyFormatter value={item.expense_price} />
                          </div>
                        </div>
                      </div>
                    ))}
              </div>

              <div>
                <div className="flex mt-2 font-extrabold">
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
