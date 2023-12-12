import axios from "axios";
import { useRef, useState } from "react";
import { RiLoader2Fill } from "react-icons/ri";
import CurrencyFormatter from "../../../../components/CurrencyFormatter/CurrencyFormatter";
import HyphenToSpaceConverter from "../../../../components/HyphenToSpaceConverter/HyphenToSpaceConverter";
import DateFormatter from "../../../../components/DateFormatter/DateFormatter";
import ReactToPrint from "react-to-print";

const FindSellInvoice = () => {
  const [loading, setLoading] = useState(false);
  const [soldInvoice, setSoldInvoice] = useState({});
  // console.log(Object.keys(soldInvoice).length);
  const componentRef = useRef();

  const handleSearch = (e) => {
    setLoading(true);
    e.preventDefault();
    const id = e.target.id.value;
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/get-sold-invoices?id=${id}`)
      .then((res) => {
        if (res) {
          setSoldInvoice(res.data.soldInvoice);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (err) {
          setLoading(false);
        }
      });
  };

  // const totalSum = soldInvoice?.items?.reduce((sum, currentItem) => {
  //   const itemTotal =
  //     currentItem.item_price_per_unit * currentItem.item_quantity;
  //   return sum + itemTotal;
  // }, 0);

  return (
    <div>
      <div className="max-w-md mx-auto mt-6">
        <p className="text-lg font-bold my-1">Find invoice by id</p>
        <form onSubmit={handleSearch}>
          <input
            className="h-[40px] w-full border-2 border-blue-600 rounded px-2"
            type="text"
            name="id"
            placeholder="Enter id"
            required
          />
          <button
            type="submit"
            className="h-[40px] w-full bg-blue-600 mt-2 rounded text-white flex items-center justify-center"
          >
            Search{" "}
            {loading ? (
              <RiLoader2Fill className="w-6 h-6 animate-spin text-white ml-2" />
            ) : null}
          </button>
        </form>
      </div>
      {/* invoice */}

      {Object.keys(soldInvoice)?.length > 0 ? (
        <div className="mt-12">
          <div
            ref={componentRef}
            className="max-w-[310px] min-h-[300px] shadow-md mx-auto rounded-md"
          >
            <div className="text-center mt-2 border-b border-gray-800">
              <h1 className="text-2xl font-bold">Food Republic</h1>
              <p className="text-[9px] mt-1">
                Majhi Plaza 2nd floor, Naria, Shariatpur
              </p>
              <p className="text-[10px] text-black mt-2">
                Invoice: <span className="ml-1">{soldInvoice?._id}</span>
              </p>
              <p className="text-xs mb-1">
                <DateFormatter dateString={soldInvoice?.createdDate} />
              </p>
              <p className="capitalize text-xs">{soldInvoice?.table_name}</p>
            </div>
            <div className="mt-2 px-1">
              <div className="min-h-[30px] text-xs flex justify-between items-center border-b border-gray-600">
                <div>Items</div>
                <div className="flex mr-1">
                  <p className="mr-6">Quantity</p>
                  <p>Price</p>
                </div>
              </div>
              {soldInvoice &&
                soldInvoice?.items?.map((item, index) => (
                  <div
                    key={item._id}
                    className="min-h-[30px] w-full border-b border-gray-600 flex items-center justify-between text-xs"
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
            <div className="flex justify-end text-base font-medium mt-2">
              <p className="mb-1 mt-2">Total Bill:</p>
              <div className="mb-1 mr-2 ml-4 mt-2">
                <CurrencyFormatter value={soldInvoice?.total_bill} />
              </div>
            </div>
            {soldInvoice?.total_discount > 0 ? (
              <>
                <div className="flex justify-end text-base font-medium">
                  <p className="">Total Discount:</p>
                  <div className="mr-2 ml-4">
                    <CurrencyFormatter value={soldInvoice?.total_discount} />
                  </div>
                </div>
                <div className="flex justify-end text-lg font-bold">
                  <p className="">Grand Total:</p>
                  <div className="mr-2 ml-4">
                    <CurrencyFormatter
                      value={
                        soldInvoice?.total_bill - soldInvoice?.total_discount
                      }
                    />
                  </div>
                </div>
              </>
            ) : null}
          </div>
          <div className="max-w-[310px] mx-auto text-right">
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
      ) : (
        <div>
          <h1 className="text-center font-bold text-red-600 text-lg mt-4">
            No data found.
          </h1>
        </div>
      )}
    </div>
  );
};

export default FindSellInvoice;
