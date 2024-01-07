/* eslint-disable react/prop-types */
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

const Chart = ({ data }) => {
  return (
    <div className="mt-[150px] mb-[70px]">
      <p className="text-center text-3xl mb-2">Sell & Discount Summary</p>
      <ResponsiveContainer width="100%" height={700}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray={"3 3"} />
          <XAxis dataKey={"_id"} />
          <YAxis />
          <Tooltip />
          <Bar dataKey={"daily_total_sell"} fill="#3D6870" />
          <Bar dataKey={"daily_total_discount"} fill="#E35436" />
          <Legend />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
