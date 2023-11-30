import axios from "axios";
import { useItemsContext } from "../../../../GlobalContext/ItemsContext";
import DateFormatter from "../../../../components/DateFormatter/DateFormatter";
import { MdDelete } from "react-icons/md";
import { RiLoader2Line } from "react-icons/ri";
import { useState } from "react";

const MaintainTables = () => {
  const { tables, refetchItems } = useItemsContext();
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleAddTable = () => {
    setLoading(true);
    axios
      .post(`${import.meta.env.VITE_API_URL}/api/add-table`)
      .then((res) => {
        if (res) {
          refetchItems();
          setLoading(false);
        }
      })
      .catch((err) => {
        if (err) {
          setLoading(false);
        }
      });
  };
  const handleTableDelete = async (item) => {
    setDeleteLoading(true);
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/delete-table/${item.name}`
      );

      if (res) {
        refetchItems();
        setDeleteLoading(false);
      }
    } catch (err) {
      if (err) {
        setDeleteLoading(false);
      }
    }
  };

  return (
    <div>
      <div>
        <button
          disabled={loading}
          onClick={handleAddTable}
          className="bg-[#001529] h-[50px] w-[200px] text-white text-lg mt-4 rounded-md hover:bg-opacity-70 flex items-center justify-center"
        >
          Add New Table{" "}
          {loading ? (
            <RiLoader2Line className="animate-spin w-6 h-6 text-white ml-2" />
          ) : null}
        </button>
      </div>
      <div className="mt-6 mx-auto grid grid-cols-7 gap-2">
        {tables &&
          tables?.tables
            .slice()
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((item) => (
              <div
                title={item.name}
                key={item._id}
                className="h-[180px] shadow-md border border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-200 rounded-full"
              >
                {deleteLoading ? (
                  "Please wait..."
                ) : (
                  <>
                    <h1 className="capitalize">{item.name}</h1>
                    <p className="text-gray-500 text-xs">
                      <DateFormatter dateString={item.createdAt} />
                    </p>
                    <div className="mt-4">
                      <MdDelete
                        onClick={() => handleTableDelete(item)}
                        title={"remove"}
                        className="h-6 w-6 text-red-600 cursor-pointer"
                      />
                    </div>
                  </>
                )}
              </div>
            ))}
      </div>
    </div>
  );
};

export default MaintainTables;
