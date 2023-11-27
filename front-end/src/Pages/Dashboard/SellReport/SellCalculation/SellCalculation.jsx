import axios from "axios";
import { useEffect, useState } from "react";
import SellReportTable from "../../../../components/SellReportTable/SellReportTable";
import CurrencyFormatter from "../../../../components/CurrencyFormatter/CurrencyFormatter";

const SellCalculation = () => {
  const [allSoldData, setAllSoldData] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [filteredDataByDate, setFilteredDataByDate] = useState([]);
  const [totalSell, setTotalSell] = useState();

  const handleSearch = () => {
    //
    const filteredData = allSoldData?.filter((item) => {
      const itemDate = new Date(item.createdDate).toISOString().split("T")[0];
      return itemDate === selectedDate;
    });

    setFilteredDataByDate(filteredData);

    const totalPriceSum = filteredData.reduce((outerSum, obj) => {
      const innerSum = obj.items.reduce((sum, item) => {
        const product =
          (item.item_quantity || 0) * (item.item_price_per_unit || 0);

        return sum + product;
      }, 0);
      return outerSum + innerSum;
    }, 0);

    setTotalSell(totalPriceSum);
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/get-sold-invoices`)
      .then((res) => {
        setAllSoldData(res.data.allSoldInvoices);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <div className="max-w-3xl mx-auto relative">
      <h1 className="text-center font-semibold text-lg mt-4">
        Select a date first
      </h1>
      <div className="text-center">
        <input
          type="date"
          className="h-[40px] w-[200px] bg-blue-500 px-4 rounded-l-md text-white"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        <button
          className="h-[40px] w-[100px] bg-blue-500 rounded-r-md text-white  border-l border-white"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
      <div className="mb-6">
        <h1 className="text-center text-xl font-semibold mt-4">
          Total Invoice Found: <span>{filteredDataByDate.length}</span>
        </h1>
      </div>
      <h1 className="text-base font-bold">Date: {selectedDate}</h1>
      {filteredDataByDate &&
        filteredDataByDate?.map((item, index) => (
          <SellReportTable
            key={item._id}
            index={index}
            id={item._id}
            tableName={item.table_name}
            items={item.items}
          />
        ))}
      <div className=" absolute right-4">
        <h1 className="text-xl text-bold flex mt-3">
          Total Sell:{" "}
          <span className="ml-12">
            <CurrencyFormatter value={totalSell} />
          </span>
        </h1>
      </div>
      {/* <div>
        <button className="px-2 py-1 bg-purple-800 text-white mt-2 rounded-md hover:bg-opacity-80">
          Want to print?
        </button>
      </div> */}
    </div>
  );
};

export default SellCalculation;
