/* eslint-disable react/prop-types */
import CurrencyFormatter from "../CurrencyFormatter/CurrencyFormatter";

const SellReportTable = ({
  index,
  id,
  tableName,
  totalDiscount,
  totalBill,
}) => {
  return (
    <div className="min-h-[50px] w-full border border-gray-200 rounded-sm shadow-md mb-1 flex items-center justify-between px-4">
      <div className="flex">
        <p className="mr-2">{index + 1}.</p>
        <p>
          invoice id: <span>{id}</span>
        </p>
        <p className="ml-24 capitalize">-{tableName}</p>
      </div>
      <div>
        <p>
          <CurrencyFormatter value={totalBill - totalDiscount} />
        </p>
      </div>
    </div>
  );
};

export default SellReportTable;
