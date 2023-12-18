import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import DateFormatter from "../../../../components/DateFormatter/DateFormatter";
import toast from "react-hot-toast";
import { Dialog, Transition } from "@headlessui/react";
import { RiLoader2Line } from "react-icons/ri";

const MaintainMembers = () => {
  const [allMember, setAllMember] = useState([]);
  let [isOpen, setIsOpen] = useState(false);
  let [findEditData, setFindEditData] = useState({});
  let [loading, setLoading] = useState(false);
  let [memberLoading, setMemberLoading] = useState(true);

  // console.log(allMember);
  const handleSubmit = (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const discount = e.target.discount.value;
    const mobile = e.target.mobile.value;
    const data = {
      name: name,
      discountValue: parseFloat(discount),
    };

    if (data && mobile) {
      setLoading(true);
      axios
        .patch(
          `${import.meta.env.VITE_API_URL}/api/update-member/${mobile}`,
          data
        )
        .then((res) => {
          if (res.data.message) {
            setIsOpen(!isOpen);
            toast.success(res.data.message);
          }
        })
        .catch((err) => {
          if (err) {
            toast.error("Something went wrong");
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
  // console.log(findEditData);
  const handleEdit = (editMember) => {
    if (editMember) {
      setFindEditData(editMember);
      setIsOpen(!isOpen);
    }
  };

  const handleDelete = (mobile) => {
    if (mobile) {
      axios
        .delete(
          `${import.meta.env.VITE_API_URL}/api/delete-member?mobile=${mobile}`
        )
        .then((res) => {
          if (res) {
            toast.success("Deleted");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/get-members`
        );
        setAllMember(response.data.members);
        setMemberLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setMemberLoading(false);
      }
    };

    fetchData();
  }, [allMember]);
  return (
    <div className="flex w-full gap-4">
      <div className="w-[50%] min-h-screen shadow-md px-4">
        <h1 className="text-lg font-bold mb-2">Members List</h1>
        {memberLoading ? (
          <div className="text-center mt-4 text-base">Please wait...</div>
        ) : (
          <div>
            {allMember &&
              allMember
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((item, index) => (
                  <div
                    key={item._id}
                    className="w-full min-h-[40px] border-b border-gray-300 flex justify-between items-center"
                  >
                    <div className="flex items-center text-xs text-gray-500 font-bold w-[240px]">
                      <p className="mr-1">{index + 1}.</p>
                      <p className="capitalize">{item.name}</p>
                    </div>
                    <div className="text-xs text-gray-500">
                      <p>{item.mobile}</p>
                      <div>
                        {/* Assuming DateFormatter is a component that formats the date */}
                        <DateFormatter dateString={item.createdDate} />
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      <p>Discount Value</p>
                      <p>{item.discountValue}%</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div>
                        <FaEdit
                          onClick={() => handleEdit(item)}
                          className="h-4 w-4 cursor-pointer text-blue-600"
                          title="Edit"
                        />
                      </div>
                      <div>
                        <MdDelete
                          onClick={() => handleDelete(item.mobile)}
                          className="h-5 w-5 cursor-pointer text-red-600"
                          title="Delete"
                        />
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        )}
      </div>
      <div className="w-[50%] min-h-screen shadow-md px-4">
        {/* <h1 className="text-lg font-bold">Search Member</h1>
        <div>
          <input
            type="text"
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
            placeholder="Mobile number or Name"
            className="h-[35px] w-[250px] px-2 border-2 border-gray-300 rounded-l"
          />
          <button
            onClick={handleSearch}
            className="h-[35px] w-[100px] px-2 bg-blue-600 text-white rounded-r"
          >
            Search
          </button>
        </div>
        <div>
          <div></div>
        </div> */}
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
                <Dialog.Panel className="w-full min-h-[200px] max-w-xs transform overflow-hidden rounded-md bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <form onSubmit={handleSubmit}>
                    <label className="text-gray-400">Name (editable)</label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={findEditData.name}
                      placeholder={findEditData.name}
                      className="w-full h-[30px] border-2 border-gray-300 rounded px-2"
                    />
                    <label className="text-gray-400">
                      Discount value (editable)
                    </label>
                    <input
                      type="number"
                      name="discount"
                      defaultValue={findEditData.discountValue}
                      placeholder={findEditData.discountValue}
                      className="w-full h-[30px] border-2 border-gray-300 rounded px-2"
                    />
                    <label className="text-gray-400">
                      Mobile Number (not editable)
                    </label>
                    <input
                      type="number"
                      name="mobile"
                      defaultValue={findEditData.mobile}
                      placeholder={findEditData.mobile}
                      disabled
                      className="w-full h-[30px] border-2 border-gray-300 rounded px-2"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="h-[30px] w-full bg-blue-600 text-white rounded mt-2 flex items-center justify-center"
                    >
                      Submit{" "}
                      {loading ? (
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

export default MaintainMembers;
