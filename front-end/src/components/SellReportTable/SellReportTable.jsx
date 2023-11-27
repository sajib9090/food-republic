/* eslint-disable react/prop-types */
import CurrencyFormatter from "../CurrencyFormatter/CurrencyFormatter";

const SellReportTable = ({ index, id, tableName, items }) => {
  const totalSum = items?.reduce(
    (sum, item) => sum + item?.item_quantity * item?.item_price_per_unit,
    0
  );

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
          <CurrencyFormatter value={totalSum} />
        </p>
      </div>
    </div>
  );
};

export default SellReportTable;
