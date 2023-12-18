import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { RiLoader2Line } from "react-icons/ri";
import CurrencyFormatter from "../../../../components/CurrencyFormatter/CurrencyFormatter";

const StaffSellRecord = () => {
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [findDataByMonth, setFindDataByMonth] = useState([]);
  const [uniqueServedByNames, setUniqueServedByNames] = useState([]);

  useEffect(() => {
    const result =
      findDataByMonth
        ?.map((entry) => entry?.served_by)
        ?.filter(Boolean)
        ?.filter((name) => name !== undefined)
        ?.filter((name, index, array) => array.indexOf(name) === index) ?? [];

    setUniqueServedByNames(result);
  }, [findDataByMonth]);

  const handleSelectDate = () => {
    setSelectedMonth(selectedMonth);
    if (selectedMonth) {
      setLoading(true);
      axios
        .get(
          `${
            import.meta.env.VITE_API_URL
          }/api/get-sold-invoices?month=${selectedMonth}`
        )
        .then((res) => {
          setFindDataByMonth(res.data.soldInvoices);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      toast.error("Pick a month first");
    }
  };

  // Prepare data for the table
  const tableData = uniqueServedByNames.map((name) => {
    const filteredData = findDataByMonth?.filter(
      (entry) => entry?.served_by === name
    );

    const totalBillSum = filteredData?.reduce(
      (sum, entry) => sum + entry?.total_bill,
      0
    );

    return {
      servedBy: name,
      totalBillSum: totalBillSum?.toFixed(2),
    };
  });

  return (
    <div>
      <h1 className="text-center my-2 font-semibold">Pick a month</h1>
      <div className="max-w-xs mx-auto flex">
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="h-[30px] w-[70%] bg-blue-600 rounded-l text-white px-2"
        />
        <button
          onClick={handleSelectDate}
          disabled={loading}
          className="h-[30px] w-[30%] border-l border-white text-white bg-blue-600 rounded-r flex items-center justify-center"
        >
          Search{" "}
          {loading ? (
            <RiLoader2Line className="h-5 w-5 animate-spin text-white " />
          ) : null}
        </button>
      </div>

      {/* Display the table */}
      {tableData?.length > 0 ? (
        <table className="table-auto my-4 mx-auto">
          <thead>
            <tr>
              <th className="border px-4 py-2">Served By</th>
              <th className="border px-4 py-2">Total Sell</th>
            </tr>
          </thead>
          <tbody>
            {tableData?.map((row, index) => (
              <tr key={index}>
                <td className="border px-6 py-4 capitalize">{row?.servedBy}</td>
                <td className="border px-6 py-4">
                  <CurrencyFormatter value={row.totalBillSum} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </div>
  );
};

export default StaffSellRecord;
