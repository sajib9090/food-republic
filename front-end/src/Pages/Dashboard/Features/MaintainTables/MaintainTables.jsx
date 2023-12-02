import axios from "axios";
import { useItemsContext } from "../../../../GlobalContext/ItemsContext";
import DateFormatter from "../../../../components/DateFormatter/DateFormatter";
import { MdDelete } from "react-icons/md";
import { RiLoader2Line } from "react-icons/ri";
import { Fragment, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { Dialog, Transition } from "@headlessui/react";
import toast from "react-hot-toast";

const MaintainTables = () => {
  const { tables, refetchItems } = useItemsContext();
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  let [isOpen, setIsOpen] = useState(false);
  let [tableData, setTableData] = useState({});
  let [editLoading, setEditLoading] = useState(false);

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

  const handleTableEdit = (item) => {
    setTableData(item);
    if (item) {
      setIsOpen(!isOpen);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const data = {
      name: name,
    };
    if (data) {
      setEditLoading(true);
      axios
        .patch(
          `${import.meta.env.VITE_API_URL}/api/table/${tableData?._id}`,
          data
        )
        .then((res) => {
          if (res) {
            refetchItems();
            toast.success("Edited");
            setIsOpen(!isOpen);
          }
        })
        .catch((err) => {
          if (err) {
            toast.error("Something went wrong");
          }
        })
        .finally(() => {
          setEditLoading(false);
        });
    }
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
                    <div className="mt-4 flex space-x-4">
                      <FaEdit
                        onClick={() => handleTableEdit(item)}
                        title={"remove"}
                        className="h-5 w-5 text-blue-600 cursor-pointer"
                      />
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
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsOpen(!isOpen)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full min-h-[150px] flex items-center justify-center max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <form onSubmit={handleSubmit}>
                    <label>Name (editable)</label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={tableData.name}
                      className="h-[30px] w-full border-2 border-gray-300 rounded"
                    />
                    <button
                      type="submit"
                      className="h-[30px] text-white w-full bg-blue-600 rounded mt-2 flex items-center justify-center"
                    >
                      Submit{" "}
                      {editLoading ? (
                        <RiLoader2Line className="h-5 w-5 animate-spin text-white" />
                      ) : null}
                    </button>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default MaintainTables;
