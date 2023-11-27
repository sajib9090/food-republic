import axios from "axios";
import { useEffect, useState } from "react";
import { RiLoader2Fill } from "react-icons/ri";
import HyphenToSpaceConverter from "../../../../components/HyphenToSpaceConverter/HyphenToSpaceConverter";
import toast from "react-hot-toast";
const MaintainVoid = () => {
  const [loading, setLoading] = useState(false);
  const [voidLoading, setVoidLoading] = useState(false);
  const [findInvoice, setFindInvoice] = useState({});
  const [id, setId] = useState("");

  const fetchData = async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/get-sold-invoices?id=${id}`
      );
      setFindInvoice(response.data.soldInvoice);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const newId = e.target.id.value;
    setId(newId);
  };

  const handleVoid = (e, findInvoice, item) => {
    setVoidLoading(true);
    e.preventDefault();
    if (findInvoice._id) {
      const inputQuantity = e.target.quantity.value;
      const quantity = parseInt(inputQuantity);
      const voidData = {
        invoiceId: findInvoice._id,
        itemId: item._id,
        newQuantity: quantity,
      };
      axios
        .patch(
          `${
            import.meta.env.VITE_API_URL
          }/api/patch-sold-invoices-update-item-quantity`,
          voidData
        )
        .then((res) => {
          if (res) {
            const voidInvoice = {
              sold_invoice_id: findInvoice._id,
              table_name: findInvoice.table_name,
              item: item,
              previous_quantity: item.item_quantity,
              void_quantity: quantity,
            };
            axios
              .post(
                `${import.meta.env.VITE_API_URL}/api/post-void-invoice`,
                voidInvoice
              )
              .then((res) => {
                if (res) {
                  setVoidLoading(false);
                  toast.success("Void done");
                  refetchData();
                }
              })
              .catch((err) => {
                console.log(err);
                setVoidLoading(false);
              });
          }
        })
        .catch((err) => {
          if (err) {
            setVoidLoading(false);
            toast.error("Something wrong!");
          }
        });
    }
  };

  const refetchData = () => {
    fetchData(id);
  };

  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id]);

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
      <div className="max-w-4xl min-h-[300px] mx-auto rounded mt-6 space-y-1">
        <div>
          <p className="text-center font-semibold text-lg capitalize">
            {findInvoice && findInvoice?.table_name}
          </p>
        </div>
        {findInvoice &&
          findInvoice?.items?.map((item, index) => (
            <div
              key={item._id}
              className="min-h-[50px] w-full border border-gray-200 shadow-md rounded flex items-center justify-between px-2"
            >
              <div className="flex items-center">
                <p>{index + 1}.</p>
                <p className="wrapped-text4 ml-1">
                  <HyphenToSpaceConverter inputString={item.item_name} />
                </p>
              </div>

              <form
                onSubmit={(e) => handleVoid(e, findInvoice, item)}
                className="flex items-center space-x-8"
              >
                <p>
                  sell quantity: <span>{item.item_quantity}</span>
                </p>
                <input
                  type="number"
                  name="quantity"
                  min="0"
                  required
                  disabled={voidLoading}
                  defaultValue={item.item_quantity}
                  className="h-[30px] w-[80px] border-2 border-gray-400 px-2 rounded"
                />
                <button className="h-[30px] w-[80px] bg-blue-500 hover:bg-opacity-80 text-white rounded flex items-center justify-center">
                  Void{" "}
                  {voidLoading ? (
                    <RiLoader2Fill className="h-4 w-4 animate-spin ml-1" />
                  ) : null}
                </button>
              </form>
            </div>
          ))}
      </div>
    </div>
  );
};

export default MaintainVoid;
