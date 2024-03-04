import { useEffect, useState } from "react";
import axios from "axios";
import DateFormatter from "../../../../components/DateFormatter/DateFormatter";
import CurrencyFormatter from "../../../../components/CurrencyFormatter/CurrencyFormatter";
import { RiLoader2Line } from "react-icons/ri";

const UnsuccessfulSell = () => {
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const totalPrice = data?.reduce((sum, currentItem) => {
    const itemTotal = currentItem?.items?.reduce((itemSum, item) => {
      const itemPrice = item?.item_price_per_unit || 0;
      const itemQuantity = item?.item_quantity || 0;
      return itemSum + itemPrice * itemQuantity;
    }, 0);

    return sum + (itemTotal || 0);
  }, 0);

  const totalSum = data?.reduce((sum, currentItem) => {
    const itemTotal = currentItem?.items?.reduce((itemSum, item) => {
      const itemPrice = item?.item_price_per_unit || 0;
      const itemQuantity = item?.item_quantity || 0;
      return itemSum + itemPrice * itemQuantity;
    }, 0);

    return sum + (itemTotal || 0);
  }, 0);

  useEffect(() => {
    if (date) {
      setLoading(true);
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/comments?date=${date}`)
        .then((res) => {
          setData(res?.data?.data);
        })
        .catch((err) => {
          setError(err?.response?.data?.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [date]);

  const [searchData, setSearchData] = useState({});
  const [searchError, setSearchError] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    const id = e.target.id.value;
    if (id) {
      setLoading(true);
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/comments?id=${id}`)
        .then((res) => {
          setSearchData(res?.data?.data);
        })
        .catch((err) => {
          setSearchError(err?.response?.data?.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
  return (
    <div className="w-full min-h-[77vh] grid grid-cols-2">
      <div className="w-full min-h-[77vh] border-r">
        <div className="flex items-center justify-center mt-4">
          <div>
            <div>{date ? date : <p>Select a date</p>}</div>
            <input
              value={date}
              onChange={(e) => setDate(e.target.value)}
              type="date"
              className="h-[40px] w-[200px] px-3 text-white rounded bg-blue-600"
            />
          </div>
        </div>
        <div className="mt-4 px-2">
          {data?.map((d, i) => (
            <div
              key={i}
              className="min-h-[70px] w-full px-1 bg-slate-50 border border-gray-300 my-2 rounded flex items-center"
            >
              <div className="flex items-center w-[35%]">
                <p className="mr-2">{i + 1}.</p>
                <p className="bg-gray-200 py-1 px-2 cursor-pointer font-bold text-base shadow">
                  {d?._id}
                </p>
              </div>
              <div className="w-[55%] pr-4 py-1">
                <p className="text-[14px] break-words">{d?.comment}</p>
              </div>
              <div className="w-[10%]">
                <p className="capitalize text-green-600">{d?.staff}</p>
                <div>
                  <CurrencyFormatter value={totalPrice} />
                </div>
                <div className="text-[10px] text-gray-400">
                  <DateFormatter dateString={d?.createdAt} />
                </div>
              </div>
            </div>
          ))}
          <>
            {data?.length > 0 ? (
              <div className="flex items-center justify-end text-lg">
                Total:{" "}
                <span className="ml-4">
                  <CurrencyFormatter value={totalSum} />
                </span>
              </div>
            ) : null}
          </>
        </div>
        <p className="text-red-600 text-center mt-2">{error}</p>
        <div className="text-center">{loading ? "Loading..." : null}</div>
      </div>
      <div className="w-full min-h-[77vh]">
        <div className="flex items-center justify-center mt-4">
          <div>
            <p>Find invoice by id and see the details</p>
            <form onSubmit={handleSearch} className="flex flex-col ">
              <input
                type="text"
                required
                name="id"
                placeholder="only id expected..."
                className="h-[40px] w-[300px] border-2 border-blue-600 rounded px-2"
              />
              <p className="text-red-600">{searchError}</p>
              <button className="flex items-center justify-center h-[40px] w-[300px] bg-blue-600 rounded text-white mt-1">
                Search{" "}
                {loading ? (
                  <RiLoader2Line className="h-6 w-6 animate-spin" />
                ) : null}
              </button>
            </form>
          </div>
        </div>

        <div className="px-4 mt-6">
          <div>
            <p>
              Table Name: <span>{searchData?.table}</span>
            </p>
            <p className="break-words">Reason: {searchData?.comment}</p>
            <p>Items:</p>
            {searchData?.items?.map((d, i) => (
              <div key={i} className="flex items-center">
                <p className="w-[5%]"></p>
                <p className="w-[75%] capitalize">{d?.item_name}</p>
                <div className="w-[10%]">Qty: {d?.item_quantity}</div>
                <div className="w-[10%]">
                  <CurrencyFormatter value={d?.item_price_per_unit} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnsuccessfulSell;
