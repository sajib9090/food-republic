/* eslint-disable react/prop-types */
import { useRef } from "react";
import CurrencyFormatter from "../CurrencyFormatter/CurrencyFormatter";
import toast from "react-hot-toast";

const SellReportTable = ({
  index,
  id,
  tableName,
  totalDiscount,
  totalBill,
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
    <div className="min-h-[50px] w-full border border-gray-200 rounded-sm shadow-md mb-1 flex items-center justify-between px-4">
      <div className="flex">
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
