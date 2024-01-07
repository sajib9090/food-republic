import { DatePicker, Space } from "antd";
import { useEffect, useState } from "react";
const { RangePicker } = DatePicker;
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import CurrencyFormatter from "../../../../components/CurrencyFormatter/CurrencyFormatter";
import toast from "react-hot-toast";

const SellSummary = () => {
  const [formattedDateRange, setFormattedDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const [findData, setFindData] = useState([]);
  const [findDetailsData, setFindDetailsData] = useState({});
  const [loading, setLoading] = useState(false);
  // console.log(findDetailsData);
  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const handleDateChange = (dates) => {
    if (dates && dates.length === 2) {
      const [startDate, endDate] = dates;
      setFormattedDateRange({
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
      });
    } else {
      setFormattedDateRange({ startDate: null, endDate: null });
    }
  };

  useEffect(() => {
    if (formattedDateRange?.startDate && formattedDateRange?.endDate) {
      setLoading(true);
      axios
        .get(
          `${
            import.meta.env.VITE_API_URL
          }/api/get-sold-invoices-by-date-details?startDate=${
            formattedDateRange?.startDate
          }&endDate=${formattedDateRange?.endDate}`
        )
        .then((res) => {
          setFindData(res.data.dailyTotals);
          setFindDetailsData(res.data);
        })
        .catch((err) => {
          if (err) {
            toast.error("Something went wrong!");
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [formattedDateRange]);
  return (
    <div>
      <div className="text-center mt-4">
        <h1>Select Start & End Date</h1>
        <Space
          className="border border-black rounded-md"
          direction="vertical"
          size={12}
        >
          <RangePicker onChange={handleDateChange} />
        </Space>
      </div>
      {loading ? (
        <h1 className="text-center mt-8 text-base">Please wait....</h1>
      ) : (
        <>
          {findData && findData?.length > 0 ? (
            <div className="mt-[70px] mb-[10px]">
              <p className="text-center text-3xl mb-2">
                Sell & Discount Summary
              </p>
              <div className="w-full flex flex-col items-center">
                <p className="text-base font-semibold">
                  <span className="font-extrabold">{findData?.length}</span>{" "}
                  Days Summary Available
                </p>
                <div>
                  <span className="mr-2 text-blue-700">
                    Start Date: {formattedDateRange?.startDate}
                  </span>
                  <span className="text-red-600">
                    End Date: {formattedDateRange?.endDate}
                  </span>
                </div>
                <div className="mt-4">
                  <div className="flex items-center text-lg">
                    Maximum Sell:{" "}
                    <span className="mx-2 text-green-600 font-bold">
                      <CurrencyFormatter value={findDetailsData?.maxTotal} />
                    </span>
                    <span className="text-xs">
                      ({findDetailsData?.maxTotalDate})
                    </span>
                  </div>
                  <div className="flex items-center text-lg">
                    Minimum Sell:{" "}
                    <span className="mx-2 text-red-600 font-bold">
                      <CurrencyFormatter value={findDetailsData?.minTotal} />
                    </span>
                    <span className="text-xs">
                      ({findDetailsData?.minTotalDate})
                    </span>
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={700}>
                <BarChart data={findData}>
                  <CartesianGrid strokeDasharray={"3 3"} />
                  <XAxis dataKey={"_id"} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey={"daily_total_sell"} fill="#007588" />
                  <Bar dataKey={"daily_total_discount"} fill="#E6A947" />
                  <Legend />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
};

export default SellSummary;
