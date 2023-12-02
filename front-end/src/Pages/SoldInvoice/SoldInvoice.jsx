import { useNavigate, useParams } from "react-router-dom";
import CurrencyFormatter from "../../components/CurrencyFormatter/CurrencyFormatter";
import DateFormatter from "../../components/DateFormatter/DateFormatter";
import HyphenToSpaceConverter from "../../components/HyphenToSpaceConverter/HyphenToSpaceConverter";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import ReactToPrint from "react-to-print";
import { useCartContext } from "../../GlobalContext/CartContext";
import toast from "react-hot-toast";

const SoldInvoice = () => {
  const { id } = useParams();
  const [soldInvoice, setSoldInvoice] = useState({});
  const { handleRemoveAllSoldCart } = useCartContext();
  const componentRef = useRef();
  const navigate = useNavigate();

  let grandTotal =
    soldInvoice.items && Array.isArray(soldInvoice.items)
      ? soldInvoice.items.reduce(
          (sum, item) => sum + (item.total_price || 0),
          0
        )
      : 0;

  useEffect(() => {
    if (id !== undefined && id !== null) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/get-sold-invoices?id=${id}`)
        .then((res) => {
          setSoldInvoice(res.data.soldInvoice);
        })
        .catch((err) => {
          if (err) {
            toast.error("Something went wrong!");
          }
        });
    }
  }, [id]);

  const handleBackToSell = () => {
    handleRemoveAllSoldCart();
    navigate("/sell");
  };
  return (
    <div>
      <div
        ref={componentRef}
        className="max-w-[310px] min-h-[300px] shadow-md mx-auto rounded-md"
      >
        <div className="text-center mt-2 border-b border-gray-500">
          <h1 className="text-2xl font-bold">Food Republic</h1>
          <address className="text-xs mt-1">
            Majhi Plaza 2nd floor, Naria, Shariatpur
          </address>
          <p className="text-[10px] text-gray-600 mt-2">
            Invoice: <span className="ml-1">{soldInvoice?._id}</span>
          </p>
          <p className="text-xs mb-1">
            <DateFormatter dateString={soldInvoice?.createdDate} />
          </p>
          <p className="capitalize text-xs">{soldInvoice?.table_name}</p>
        </div>
        <div className="mt-2 px-1">
          {soldInvoice &&
            soldInvoice?.items?.map((item, index) => (
              <div
                key={item._id}
                className="min-h-[50px] w-full border-b border-gray-300 flex items-center justify-between text-xs"
              >
                <div className="flex items-center">
                  <p className="mr-1">{index + 1}.</p>
                  <p className="wrapped-text3">
                    <HyphenToSpaceConverter inputString={item?.item_name} />
                  </p>
                </div>
                <div className="flex items-center">
                  <p className="mr-1">
                    ({item.item_price_per_unit} * {item.item_quantity})
                  </p>
                  <p>-</p>
                  <div className="ml-1">
                    <CurrencyFormatter
                      value={item.item_price_per_unit * item.item_quantity}
                    />
                  </div>
                </div>
              </div>
            ))}
        </div>
        <div className="flex justify-end text-sm font-medium mt-2">
          <p className="mb-2">Total Bill:</p>
          <div className="mr-2 ml-4">
            <CurrencyFormatter value={grandTotal} />
          </div>
        </div>
        {soldInvoice?.total_discount && soldInvoice?.total_discount > 0 ? (
          <>
            <div className="flex justify-end text-sm font-medium">
              <p className="mb-2">Total Discount:</p>
              <div className="mr-2 ml-4">
                <CurrencyFormatter value={soldInvoice?.total_discount} />
              </div>
            </div>
            <div className="flex justify-end text-base font-bold">
              <p className="mb-2">Grand Total Bill:</p>
              <div className="mr-2 ml-4">
                <CurrencyFormatter
                  value={grandTotal - soldInvoice?.total_discount}
                />
              </div>
            </div>
          </>
        ) : null}
      </div>
      <div className="max-w-[310px] mx-auto text-right">
        <button
          onClick={handleBackToSell}
          className="mt-2 px-6 py-2 bg-black rounded-md text-white hover:bg-opacity-80 duration-500 transition-all mr-2"
        >
          Back to sell
        </button>
        <ReactToPrint
          trigger={() => (
            <button className="mt-2 px-6 py-2 bg-purple-800 rounded-md text-white hover:bg-opacity-80 duration-500 transition-all">
              Print
            </button>
          )}
          content={() => componentRef.current}
        />
      </div>
    </div>
  );
};

export default SoldInvoice;
