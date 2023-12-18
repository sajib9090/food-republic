import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { RiLoader2Line } from "react-icons/ri";
import CurrencyFormatter from "../../../../components/CurrencyFormatter/CurrencyFormatter";

const SellHistory = () => {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [findDataByMonth, setFindDataByMonth] = useState([]);
  const [allItemNames, setAllItemNames] = useState([]);
  const [totalDaysInMonth, setTotalDaysInMonth] = useState(0);
  const [sellData, setSellData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalBillByMonth, setTotalBillByMonth] = useState({});
  const [totalDiscountByMonth, setTotalDiscountByMonth] = useState({});

  useEffect(() => {
    const calculateTotals = () => {
      const totalBillResult = findDataByMonth?.reduce((acc, item) => {
        acc += item.total_bill;
        return acc;
      }, 0);

      const totalDiscountResult = findDataByMonth?.reduce((acc, item) => {
        acc += item.total_discount;
        return acc;
      }, 0);

      // Set the results as new states
      setTotalBillByMonth(totalBillResult);
      setTotalDiscountByMonth(totalDiscountResult);
    };

    calculateTotals();
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
          setLoading(false); // Set loading to false regardless of success or failure
        });
    } else {
      toast.error("Select a month first");
    }
  };

  useEffect(() => {
    const uniqueItemNames = [
      ...new Set(
        findDataByMonth.flatMap((invoice) =>
          invoice?.items?.map((item) => item.item_name)
        )
      ),
    ];
    setAllItemNames(uniqueItemNames);

    // Calculate total days in the selected month
    if (selectedMonth) {
      const [year, month] = selectedMonth.split("-");
      const lastDayOfMonth = new Date(year, month, 0).getDate();
      setTotalDaysInMonth(lastDayOfMonth);
    }

    // Create a data structure to hold sell quantities for each item and each day
    const sellDataStructure = uniqueItemNames.map((itemName) => ({
      itemName,
      sellQuantities: Array(totalDaysInMonth).fill(0),
    }));

    // Fill the sellDataStructure with actual sell quantities
    findDataByMonth?.forEach((invoice) => {
      const dayOfMonth = new Date(invoice.createdDate).getDate();
      invoice?.items?.forEach((item) => {
        const itemIndex = uniqueItemNames.indexOf(item?.item_name);
        if (itemIndex !== -1) {
          sellDataStructure[itemIndex].sellQuantities[dayOfMonth - 1] +=
            item?.item_quantity;
        }
      });
    });

    setSellData(sellDataStructure);
  }, [findDataByMonth, selectedMonth, totalDaysInMonth]);

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
      <>
        {loading ? (
          <h1 className="text-center font-semibold text-xl mt-6">
            Please wait...
          </h1>
        ) : (
          <div>
            <h1 className="text-center text-lg mt-4">{selectedMonth}</h1>
            <>
              {allItemNames ? (
                <>
                  {allItemNames?.length > 0 && (
                    <table className="mt-4 border-collapse border border-gray-300">
                      <thead>
                        <tr>
                          <th className="border border-gray-300 p-2"></th>
                          {[...Array(totalDaysInMonth).keys()].map((day) => (
                            <th
                              key={day + 1}
                              className="border border-gray-300 p-2 text-center font-bold bg-blue-100"
                            >
                              {day + 1}
                            </th>
                          ))}
                          <th className="border border-gray-300 p-2 text-center bg-blue-200">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {sellData &&
                          sellData?.map((sellDataRow, index) => (
                            <tr key={sellDataRow.itemName}>
                              <td className="border border-gray-300 p-2 bg-green-200 font-bold">
                                <span className="mr-1">{index + 1}.</span>
                                {sellDataRow.itemName}
                              </td>
                              {sellDataRow?.sellQuantities?.map(
                                (sellQuantity, index) => (
                                  <td
                                    key={index + 1}
                                    className="border border-gray-300 p-3 bg-slate-100"
                                  >
                                    {sellQuantity == 0 ? "-" : sellQuantity}
                                  </td>
                                )
                              )}
                              <td className="border border-gray-300 p-2 font-bold bg-purple-300">
                                {sellDataRow.sellQuantities.reduce(
                                  (sum, qty) => sum + qty,
                                  0
                                )}
                              </td>
                            </tr>
                          ))}

                        {/* Add a row for the totals */}
                        <tr>
                          <td className="border border-gray-300 p-2 font-bold bg-blue-200">
                            Daily Sell Quantity
                          </td>
                          {sellData &&
                            sellData[0]?.sellQuantities?.map((_, index) => (
                              <td
                                key={index + 1}
                                className="border border-gray-300 p-3 font-bold bg-blue-200"
                              >
                                {sellData.reduce(
                                  (sum, sellDataRow) =>
                                    sum + sellDataRow.sellQuantities[index],
                                  0
                                )}
                              </td>
                            ))}
                          <td className="border border-gray-300 p-2 font-bold bg-blue-300">
                            {sellData.reduce(
                              (sum, sellDataRow) =>
                                sum +
                                sellDataRow.sellQuantities.reduce(
                                  (qtySum, qty) => qtySum + qty,
                                  0
                                ),
                              0
                            )}
                          </td>
                        </tr>
                      </tbody>
                      <div className="space-y-2 mt-4 mb-2 ml-2 text-xl">
                        <div className="flex font-bold space-x-36">
                          <div>Total Sell: </div>
                          <div>
                            <CurrencyFormatter value={totalBillByMonth} />
                          </div>
                        </div>
                        <div className="flex font-bold space-x-[95px] text-red-600">
                          <div>Total Discount: </div>
                          <div>
                            <CurrencyFormatter value={totalDiscountByMonth} />
                          </div>
                        </div>
                        <div className="flex font-bold space-x-[157px] text-blue-700">
                          <div>Net Sell: </div>
                          <div className="text-2xl font-extrabold">
                            <CurrencyFormatter
                              value={totalBillByMonth - totalDiscountByMonth}
                            />
                          </div>
                        </div>
                      </div>
                    </table>
                  )}
                </>
              ) : (
                <h1 className="text-center font-semibold mt-6 text-red-600 text-2xl">
                  No data found
                </h1>
              )}
            </>
          </div>
        )}
      </>
    </div>
  );
};

export default SellHistory;
