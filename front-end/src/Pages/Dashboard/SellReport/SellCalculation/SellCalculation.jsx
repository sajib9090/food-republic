import axios from "axios";
import { useEffect, useState } from "react";
import SellReportTable from "../../../../components/SellReportTable/SellReportTable";
import CurrencyFormatter from "../../../../components/CurrencyFormatter/CurrencyFormatter";
import toast from "react-hot-toast";
import { RiLoader2Line } from "react-icons/ri";

const SellCalculation = () => {
  const [allSoldData, setAllSoldData] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [totalBillSum, setTotalBillSum] = useState(0);
  const [totalDiscountSum, setTotalDiscountSum] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    if (selectedDate) {
      setLoading(true);
      axios
        .get(
          `${
            import.meta.env.VITE_API_URL
          }/api/get-sold-invoices?date=${selectedDate}`
        )
        .then((res) => {
          setAllSoldData(res.data.soldInvoices);

          // Calculate the sum of total_bill values
          const totalBillSum = res.data?.soldInvoices?.reduce(
            (total, invoice) => total + invoice.total_bill,
            0
          );
          setTotalBillSum(totalBillSum);

          // Calculate the sum of total_discount values
          const totalDiscountSum = res.data?.soldInvoices?.reduce(
            (total, invoice) => total + invoice.total_discount,
            0
          );
          setTotalDiscountSum(totalDiscountSum);
        })
        .catch((err) => {
          if (err) {
            toast.error("Something went wrong");
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      toast.error("Select a date first");
    }
  };

  useEffect(() => {
    // Sum total_bill and total_discount values when allSoldData changes
    const totalBillSum = allSoldData.reduce(
      (total, invoice) => total + invoice.total_bill,
      0
    );
    setTotalBillSum(totalBillSum);

    const totalDiscountSum = allSoldData.reduce(
      (total, invoice) => total + invoice.total_discount,
      0
    );
    setTotalDiscountSum(totalDiscountSum);
  }, [allSoldData]);

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-center font-semibold text-lg mt-4">
        Select a date first
      </h1>
      <div className="flex justify-center">
        <input
          type="date"
          className="h-[40px] w-[200px] bg-blue-500 px-4 rounded-l-md text-white"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        <button
          className="h-[40px] w-[100px] bg-blue-500 rounded-r-md flex items-center justify-center text-white  border-l border-white"
          onClick={handleSearch}
        >
          Search{" "}
          {loading ? <RiLoader2Line className="h-5 w-5 animate-spin" /> : null}
        </button>
      </div>
      <div className="mb-6">
        <h1 className="text-center text-xl font-semibold mt-4">
          Total Invoice Found: <span>{allSoldData && allSoldData?.length}</span>
        </h1>
      </div>
      <h1 className="text-base font-bold text-center">Date: {selectedDate}</h1>

      <>
        {allSoldData && allSoldData?.length > 0 ? (
          <>
            {allSoldData &&
              allSoldData?.map((item, index) => (
                <SellReportTable
                  key={item._id}
                  index={index}
                  id={item._id}
                  tableName={item.table_name}
                  items={item.items}
                  totalBill={item.total_bill}
                  totalDiscount={item.total_discount}
                />
              ))}

            <div className="max-w-sm ml-auto">
              <h1 className="text-lg text-bold flex mt-3 justify-end border-b border-gray-300 pr-2">
                Total Sell:{" "}
                <span className="ml-auto">
                  <CurrencyFormatter value={totalBillSum} />
                </span>
              </h1>
              <h1 className="text-lg text-bold flex justify-end mt-1 border-b border-gray-300 pr-2">
                Total Discount:{" "}
                <span className="ml-auto">
                  <CurrencyFormatter value={totalDiscountSum} />
                </span>
              </h1>
              <h1 className="text-xl text-bold flex justify-end mt-1 border-b border-gray-300 pr-2">
                Grand Total:{" "}
                <span className="ml-auto">
                  <CurrencyFormatter value={totalBillSum - totalDiscountSum} />
                </span>
              </h1>
            </div>
          </>
        ) : (
          <h1 className="text-center font-semibold text-lg text-red-600 mt-4">
            No data found.
          </h1>
        )}
      </>
    </div>
  );
};

export default SellCalculation;
