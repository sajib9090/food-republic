import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import { RiLoader2Fill } from "react-icons/ri";
import HyphenToSpaceConverter from "../../../../components/HyphenToSpaceConverter/HyphenToSpaceConverter";
import CurrencyFormatter from "../../../../components/CurrencyFormatter/CurrencyFormatter";
import { useRef, useState } from "react";
import ReactToPrint from "react-to-print";

const FindVoidInvoice = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [dataByDate, setDataByDate] = useState([]);
  const componentRef = useRef();

  // handle search by date
  const handleSearchByDate = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/get-void-invoices?date=${selectedDate}`
      );
      const data = await response.json();
      setDataByDate(data.voidInvoices);
      setLoading(false);
    } catch (err) {
      if (err) {
        setLoading(false);
      }
    }
  };

  const dateWiseDataSum = dataByDate.reduce((total, item) => {
    if (item.void_quantity && item.item && item.item.item_price_per_unit) {
      total += item.void_quantity * item.item.item_price_per_unit;
    }
    return total;
  }, 0);

  return (
    <div>
      <div className="max-w-sm mx-auto mt-4">
        <div className="w-full px-4">
          <div className="mx-auto w-full max-w-md rounded-2xl bg-white p-2">
            <Disclosure as="div" className="mt-1">
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex w-full justify-between rounded-lg bg-purple-100 px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500/75">
                    <span>Want to find void invoice by date?</span>
                    <ChevronUpIcon
                      className={`${
                        open ? "rotate-180 transform" : ""
                      } h-5 w-5 text-purple-500`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-2 pb-2 pt-4 text-sm text-gray-500">
                    <div>
                      <div className="flex flex-col">
                        <label className="">Select date*</label>
                        <div className="flex">
                          <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="h-[30px] w-[70%] bg-blue-600 rounded-l text-white px-2"
                          />
                          <button
                            onClick={handleSearchByDate}
                            className="h-[30px] w-[30%] bg-blue-600 text-white rounded-r border-l border-white flex justify-center items-center"
                          >
                            Search{" "}
                            {loading ? (
                              <RiLoader2Fill className="w-4 h-4 animate-spin text-white" />
                            ) : null}
                          </button>
                        </div>
                      </div>
                      {/* result */}
                      <div ref={componentRef}>
                        {dataByDate &&
                          dataByDate?.map((item, index) => (
                            <div
                              key={item._id}
                              className="min-h-[50px] w-full border-b border-gray-300 flex items-center justify-between text-xs"
                            >
                              <div className="flex items-center">
                                <p className="mr-1">{index + 1}.</p>
                                <div className="wrapped-text5">
                                  <HyphenToSpaceConverter
                                    inputString={item?.item?.item_name}
                                  />
                                  <p>
                                    Sold invoice id: {item?.sold_invoice_id}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <p className="mr-1">
                                  ({item?.void_quantity} *{" "}
                                  {item?.item?.item_price_per_unit})
                                </p>
                                <p>-</p>
                                <div className="ml-1">
                                  <CurrencyFormatter
                                    value={
                                      item?.void_quantity *
                                      item?.item?.item_price_per_unit
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          ))}

                        {dataByDate && dataByDate?.length > 0 ? (
                          <div>
                            <h1 className="flex justify-end">
                              Total Void:{" "}
                              <span className="ml-4">
                                <CurrencyFormatter value={dateWiseDataSum} />
                              </span>
                            </h1>
                          </div>
                        ) : (
                          <h1 className="text-red-600">No data found.</h1>
                        )}
                      </div>
                      {dataByDate && dataByDate?.length > 0 ? (
                        <div className="text-right mt-2">
                          <ReactToPrint
                            trigger={() => (
                              <button className="px-4 py-1 rounded bg-purple-600 text-white">
                                Print
                              </button>
                            )}
                            content={() => componentRef.current}
                          />
                        </div>
                      ) : null}
                    </div>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
            {/* <Disclosure as="div" className="mt-1">
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex w-full justify-between rounded-lg bg-purple-100 px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500/75">
                    <span>Want to find void invoice by table id?</span>
                    <ChevronUpIcon
                      className={`${
                        open ? "rotate-180 transform" : ""
                      } h-5 w-5 text-purple-500`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pb-2 pt-4 text-sm text-gray-500">
                    No.
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
            <Disclosure as="div" className="mt-1">
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex w-full justify-between rounded-lg bg-purple-100 px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500/75">
                    <span>Want to find void invoice by sold invoice id?</span>
                    <ChevronUpIcon
                      className={`${
                        open ? "rotate-180 transform" : ""
                      } h-5 w-5 text-purple-500`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pb-2 pt-4 text-sm text-gray-500">
                    No.
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindVoidInvoice;
