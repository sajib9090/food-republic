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

  const [detailsData, setDetailsData] = useState({});
  console.log(detailsData);
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
          if (res) {
            setFindDataByMonth(res.data.soldInvoices);
            axios
              .get(
                `${
                  import.meta.env.VITE_API_URL
                }/api/get-sold-invoices-by-month-details?month=${selectedMonth}`
              )
              .then((response) => {
                setDetailsData(response.data);
              })
              .catch((error) => {
                console.log(error);
              })
              .finally(() => {
                setLoading(false);
              });
          }
        })
        .catch((err) => {
          if (err) {
            toast.error("Something went wrong");
          }
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
                    <>
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
                                <td className="border border-gray-300 p-2 bg-green-200 font-bold capitalize">
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
                      </table>
                      <div className="space-y-2 mt-4 mb-2 ml-2 text-xl w-[600px] flex flex-col">
                        <div className="flex items-center font-bold w-full">
                          <div className="w-[70%] text-left">Total Sell: </div>
                          <div className="w-[30%] text-left">
                            <CurrencyFormatter value={totalBillByMonth} />
                          </div>
                        </div>
                        <hr />
                        <div className="flex items-center font-bold text-yellow-700 w-full">
                          <div className="w-[70%] text-left">
                            Average Daily Sell:{" "}
                          </div>
                          <div className="w-[30%] text-left">
                            <CurrencyFormatter
                              value={totalBillByMonth / totalDaysInMonth}
                            />
                          </div>
                        </div>
                        <hr />
                        <div className="flex items-center w-full font-bold text-red-600">
                          <div className="w-[70%] text-left">
                            Total Discount:{" "}
                          </div>
                          <div className="w-[30%] text-left">
                            <CurrencyFormatter value={totalDiscountByMonth} />
                          </div>
                        </div>
                        <hr />
                        <div className="flex items-center font-bold text-green-600">
                          <div className="w-[70%] text-left">
                            Average Discount (%):{" "}
                          </div>
                          <div className="w-[30%] text-left">
                            {totalDiscountByMonth !== undefined &&
                            totalDiscountByMonth !== null
                              ? (
                                  (totalDiscountByMonth /
                                    (totalBillByMonth - totalDiscountByMonth)) *
                                  100
                                ).toFixed(2) + "%"
                              : "N/A"}
                          </div>
                        </div>
                        <hr />
                        <div className="flex items-center font-bold text-orange-500">
                          <div className="w-[70%] text-left flex items-center">
                            Minimum Sell Day:
                            <div className="ml-2 text-gray-500 text-base">
                              <span>
                                ({selectedMonth}-{detailsData?.minTotalDate})
                              </span>
                            </div>
                          </div>
                          <div className="w-[30%] text-left">
                            <CurrencyFormatter value={detailsData?.minTotal} />
                          </div>
                        </div>
                        <hr />
                        <div className="flex items-center font-bold text-fuchsia-500">
                          <div className="w-[70%] text-left flex items-center">
                            Maximum Sell Day:
                            <div className="ml-2 text-gray-500 text-base">
                              <span>
                                ({selectedMonth}-{detailsData?.maxTotalDate})
                              </span>
                            </div>
                          </div>
                          <div className="w-[30%] text-left">
                            <CurrencyFormatter value={detailsData?.maxTotal} />
                          </div>
                        </div>
                        <hr />
                        <div className="flex items-center font-bold text-blue-700">
                          <div className="w-[70%] text-left">Net Sell: </div>
                          <div className="text-2xl font-extrabold w-[30%] text-left">
                            <CurrencyFormatter
                              value={totalBillByMonth - totalDiscountByMonth}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mb-8 mt-16">
                        <h1 className="text-center text-xl mt-8 mb-2 text-blue-600">
                          Details Sell Report day by day
                        </h1>
                        {/* Table */}
                        <table className="border-collapse w-full">
                          <tr>
                            <th className="border border-gray-100 p-2 bg-slate-400">
                              Date
                            </th>

                            {detailsData?.dailyTotals?.map((item) => (
                              <th
                                className="border border-gray-100 p-2 bg-slate-300"
                                key={item._id}
                              >
                                {item._id}
                              </th>
                            ))}
                          </tr>
                          <tr>
                            <td className="border border-gray-100 text-center p-2 bg-blue-400">
                              Sell
                            </td>

                            {detailsData?.dailyTotals?.map((item) => (
                              <td
                                className="border border-gray-100 text-center p-2 bg-blue-300"
                                key={item._id}
                              >
                                {item.total_bill}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="border border-gray-100 text-center p-2 bg-orange-400">
                              Discount
                            </td>
                            {detailsData?.dailyTotals?.map((item) => (
                              <td
                                className="border border-gray-100 text-center p-2 bg-orange-300"
                                key={item._id}
                              >
                                {item.total_discount}
                              </td>
                            ))}
                          </tr>
                        </table>
                      </div>
                    </>
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
      {/* <div>
        <div>
          {findDataByMonth?.map((item, index) => (
            <SellReportTableForDelete
              key={item._id}
              index={index}
              id={item._id}
              tableName={item.table_name}
              items={item.items}
              totalBill={item.total_bill}
              totalDiscount={item.total_discount}
            />
          ))}
        </div>
      </div> */}
    </div>
  );
};

export default SellHistory;
