/* eslint-disable react/prop-types */
import { useRef } from "react";
import CurrencyFormatter from "../CurrencyFormatter/CurrencyFormatter";
import toast from "react-hot-toast";
import DateFormatter from "../DateFormatter/DateFormatter";

const SellReportTable = ({
  index,
  id,
  tableName,
  totalDiscount,
  totalBill,
  date,
  serial,
}) => {
  const invoiceIdRef = useRef(null);

  const handleCopyClick = () => {
    if (invoiceIdRef.current) {
      const tempTextarea = document.createElement("textarea");
      tempTextarea.value = invoiceIdRef.current.textContent;
      document.body.appendChild(tempTextarea);

      // Select and copy the text
      tempTextarea.select();
      document.execCommand("copy");

      // Remove the temporary textarea
      document.body.removeChild(tempTextarea);

      toast.success(`${tempTextarea.value} Copied`, {
        autoClose: 100,
      });
    }
  };

  return (
    <div className="min-h-[55px] w-full border border-gray-200 rounded-sm shadow-md mb-1 flex items-center px-4">
      <div className="flex w-[50%] text-left">
        <p className="mr-2">{index + 1}.</p>
        <p>
          invoice id:{" "}
          <span
            onClick={handleCopyClick}
            ref={invoiceIdRef}
            className="bg-gray-200 py-1 px-2 cursor-pointer font-bold text-base shadow"
            title="Click to copy"
          >
            {id}
          </span>
        </p>
      </div>
      <div className="w-[12%] text-left">
        <span className="text-xs text-gray-500">Invoice Serial</span>
        <p className="capitalize font-semibold text-xs">{serial}</p>
      </div>
      <div className="w-[15%] text-left">
        <span className="text-xs text-gray-500">
          <DateFormatter dateString={date} />
        </span>
        <p className="capitalize font-semibold">{tableName}</p>
      </div>
      <div className="w-[10%] text-right">
        <p className="text-xs">Discount</p>
        <div className="text-red-600 text-xs">
          <CurrencyFormatter value={totalDiscount} />
        </div>
      </div>
      <div className="w-[13%] text-right">
        <div className="font-bold">
          <CurrencyFormatter value={totalBill} />
        </div>
      </div>
    </div>
  );
};

export default SellReportTable;
