import axios from "axios";
import { useRef, useState } from "react";
import { RiLoader2Line } from "react-icons/ri";
import toast from "react-hot-toast";
import ReactToPrint from "react-to-print";
import CurrencyFormatter from "../../../../components/CurrencyFormatter/CurrencyFormatter";

const FindExpenses = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [singleDateData, setSingleDateData] = useState("");
  const [totalExpense, setTotalExpense] = useState(0);
  const [loading, setLoading] = useState(false);
  const componentRef = useRef();

  const HandleSearch = async () => {
    if (selectedDate) {
      setLoading(true);
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/api/get-expenses?date=${selectedDate}`
        );

        setSingleDateData(response.data.expenses);

        // Calculate the total expense
        const total = response.data.expenses.reduce(
          (accumulator, expense) => accumulator + expense.expense_price,
          0
        );
        setTotalExpense(total);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    } else {
      toast.error("Select a date");
    }
  };

  return (
    <div>
      <div className="max-w-[310px] mx-auto mt-4">
        <div className="flex">
          <input
            value={selectedDate}
            type="date"
            className="h-[30px] w-[70%] bg-blue-600 rounded-l text-white px-2"
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <button
            onClick={HandleSearch}
            className="h-[30px] w-[30%] bg-blue-600 text-white border-l border-white rounded-r  flex justify-center items-center"
          >
            Search{" "}
            {loading ? (
              <RiLoader2Line className="w-5 h-5 animate-spin" />
            ) : null}
          </button>
        </div>
        {/* invoice */}
        <div ref={componentRef}>
          <div>
            <p className="text-center text-2xl font-semibold">Expense</p>
            <p className="text-center">{selectedDate}</p>
          </div>
          {singleDateData &&
            singleDateData?.map((item, index) => (
              <div
                key={item._id}
                className="min-h-[35px] w-full border-b border-gray-500 flex items-center justify-between px-2"
              >
                <div className="flex items-center">
                  <p>{index + 1}.</p>
                  <p className="ml-1 capitalize">{item.title}</p>
                </div>
                <div>
                  <CurrencyFormatter value={item.expense_price} />
                </div>
              </div>
            ))}
          {singleDateData && singleDateData?.length > 0 ? (
            <div>
              <div className="text-lg font-bold flex justify-end my-1 mr-1">
                Total Expense:{" "}
                <span className="ml-4">
                  <CurrencyFormatter value={totalExpense} />
                </span>
              </div>
            </div>
          ) : (
            <h1 className="text-center my-2 text-lg">No data found...</h1>
          )}
        </div>
        {singleDateData && singleDateData?.length > 0 ? (
          <div className="text-right mt-2">
            <ReactToPrint
              trigger={() => (
                <button className="px-4 py-1 bg-purple-600 text-white rounded hover:bg-opacity-80">
                  Print
                </button>
              )}
              content={() => componentRef.current}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default FindExpenses;
