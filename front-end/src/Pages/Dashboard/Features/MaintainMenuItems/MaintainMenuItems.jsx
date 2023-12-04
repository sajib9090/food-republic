import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import { useForm } from "react-hook-form";
import { MdDelete, MdEditSquare } from "react-icons/md";
import CurrencyFormatter from "../../../../components/CurrencyFormatter/CurrencyFormatter";
import { useItemsContext } from "../../../../GlobalContext/ItemsContext";
import toast from "react-hot-toast";
import axios from "axios";
import HyphenToSpaceConverter from "../../../../components/HyphenToSpaceConverter/HyphenToSpaceConverter";
import { Fragment, useState } from "react";
import { RiLoader2Line } from "react-icons/ri";
import PrimaryLoader from "../../../../components/PrimaryLoader/PrimaryLoader";
import { Dialog, Transition } from "@headlessui/react";

const MaintainMenuItems = () => {
  const { refetchItems, categories, menuItems, menuItemsLoading } =
    useItemsContext();
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  let [isOpen, setIsOpen] = useState(false);
  let [editItem, setEditItem] = useState({});
  let [itemId, setitemId] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      if (data.price == 0) {
        toast.error("Price cannot be 0");
        return;
      }

      if (data.price < 0) {
        toast.error("Price cannot be negative");
        return;
      }

      setLoading(true);

      const itemDetails = {
        item_name: data.name,
        category: data.category,
        item_price: parseFloat(data.price),
      };

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/add-menu-item`,
        itemDetails
      );

      if (res) {
        toast.success("Item added Successfully");
        refetchItems();
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      if (err.response && err.response.data) {
        toast.error(err.response.data);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      setDeleteLoading(true);

      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/delete-menu-item/${id}`
      );

      if (res) {
        refetchItems();
        toast.success("Item deleted!");
        setDeleteLoading(false);
      }
    } catch (err) {
      if (err) {
        toast.error("Something went wrong!");
        setDeleteLoading(false);
      }
    }
  };

  const handleEdit = (item) => {
    setEditItem(item);
    if (item) {
      setIsOpen(!isOpen);
      setitemId(item._id);
    } else {
      toast.error("Something went wrong");
    }
  };

  const handleOnsubmitForEdit = (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const price = e.target.price.value;
    if ((name && price > 0) || price == 0) {
      setEditLoading(true);
      const data = {
        item_name: name,
        item_price: parseFloat(price),
      };

      axios
        .patch(
          `${import.meta.env.VITE_API_URL}/api/edit-menu-item/${itemId}`,
          data
        )
        .then((res) => {
          if (res) {
            toast.success("Edited");
          }
        })
        .catch((err) => {
          if (err) {
            toast.error("Something went wrong");
          }
        })
        .finally(() => {
          refetchItems();
          setIsOpen(!isOpen);
          setEditLoading(false);
        });
    } else if (price < 0) {
      toast.error("Negative price not allowed");
    }
  };

  return (
    <div>
      {menuItemsLoading ? (
        <PrimaryLoader />
      ) : (
        <>
          <div className="w-full px-1 pt-4">
            <div className="mx-auto w-full max-w-md rounded-2xl bg-white p-2 shadow-md">
              <Disclosure>
                {({ open }) => (
                  <>
                    <Disclosure.Button className="flex w-full justify-between rounded-lg bg-purple-100 px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500/75">
                      <span>Want to add new item?</span>
                      <ChevronUpIcon
                        className={`${
                          open ? "rotate-180 transform" : ""
                        } h-5 w-5 text-purple-500`}
                      />
                    </Disclosure.Button>
                    <Disclosure.Panel className="px-4 pb-2 pt-4 text-sm text-gray-500">
                      <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-2"
                      >
                        <div>
                          <label>Item Name with details*</label>
                          <input
                            className="h-[40px] w-full border-2 border-purple-900 rounded-md px-2"
                            type="text"
                            placeholder="Item name with details"
                            {...register("name", {
                              required: "Warning! Name is required",
                            })}
                            aria-invalid={errors.name ? "true" : "false"}
                          />
                          {errors.name && (
                            <p className="text-red-700" role="alert">
                              {errors.name?.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <label>Select Category*</label>
                          <select
                            className="h-[40px] w-full border-2 border-purple-900 rounded-md px-2"
                            {...register("category", {
                              required: "Warning! Category is required",
                            })}
                            aria-invalid={errors.category ? "true" : "false"}
                          >
                            <option value="" selected disabled>
                              Select a category
                            </option>
                            {categories?.map((item) => (
                              <option
                                className="text-purple-600 font-semibold text-base"
                                key={item._id}
                                value={item.category}
                              >
                                <HyphenToSpaceConverter
                                  inputString={item.category}
                                />
                              </option>
                            ))}
                          </select>
                          {errors.category && (
                            <p className="text-red-700" role="alert">
                              {errors.category?.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <label>Price*</label>
                          <input
                            className="h-[40px] w-full border-2 border-purple-900 rounded-md px-2"
                            type="number"
                            placeholder="Price"
                            {...register("price", {
                              required: "Warning! Price is required",
                            })}
                            aria-invalid={errors.price ? "true" : "false"}
                          />
                          {errors.price && (
                            <p className="text-red-700" role="alert">
                              {errors.price?.message}
                            </p>
                          )}
                        </div>

                        <div className="">
                          <button
                            disabled={loading}
                            type="submit"
                            className="h-[40px] w-full bg-purple-900 hover:bg-opacity-80 text-white rounded-md flex items-center justify-center"
                          >
                            Add Item{" "}
                            {loading ? (
                              <RiLoader2Line className="w-6 h-6 animate-spin ml-2" />
                            ) : null}
                          </button>
                        </div>
                      </form>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            </div>
          </div>
          <div className="min-h-screen grid grid-cols-3 gap-0.5 mt-6">
            {categories
              ?.sort((a, b) => a?.category?.localeCompare(b.category))
              .map((category) => (
                <div
                  key={category._id}
                  className="min-h-screen border border-gray-200 shadow-xl rounded-md"
                >
                  <div
                    className="capitalize text-center rounded py-2 font-bold text-lg
                  bg-[#001529] bg-opacity-75 text-white"
                  >
                    <HyphenToSpaceConverter inputString={category.category} />
                  </div>

                  {menuItems
                    ?.filter((item) => item?.category === category.category)
                    .map((item, i) => (
                      <div
                        key={item._id}
                        className="flex justify-between items-center mt-4 pb-2 px-2 border-b border-gray-300 cursor-pointer"
                      >
                        <div className="flex font-bold text-black text-sm">
                          <div>
                            <p className="mr-1">{i + 1}.</p>
                          </div>
                          <div>
                            <p className="wrapped-text">
                              <HyphenToSpaceConverter
                                inputString={item?.item_name}
                              />
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div>
                            <button
                              className="hover:bg-opacity-70 text-[11px] px-1 py-0.5 text-black rounded-md
                          "
                            >
                              <CurrencyFormatter value={item?.item_price} />
                            </button>
                          </div>
                          <div className="ml-8 flex items-center space-x-4">
                            <MdEditSquare
                              onClick={() => handleEdit(item)}
                              title="Edit"
                              className="h-5 w-5 text-blue-600 cursor-pointer"
                            />

                            {deleteLoading ? (
                              <RiLoader2Line className="w-5 h-5 animate-spin text-black" />
                            ) : (
                              <MdDelete
                                onClick={() => handleDelete(item._id)}
                                title="Delete"
                                className="h-6 w-6 text-red-600 cursor-pointer"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ))}
          </div>
        </>
      )}

      {/* modal for edit */}
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
            <div className="fixed inset-0 bg-black/75" />
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
                <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-md bg-white p-4 text-left align-middle shadow-xl transition-all">
                  <form
                    onSubmit={handleOnsubmitForEdit}
                    className="min-h-[160px] space-y-2"
                  >
                    <div className="flex flex-col">
                      <label>Item Name (Editable)</label>
                      <input
                        className="w-full h-[30px] border-2 border-purple-600 rounded px-2"
                        type="text"
                        name="name"
                        defaultValue={editItem?.item_name}
                        placeholder={editItem?.item_name}
                      />
                    </div>
                    <div className="flex flex-col">
                      <label>Item Price (Editable)</label>
                      <input
                        className="w-full h-[30px] border-2 border-purple-600 rounded px-2"
                        type="text"
                        name="price"
                        defaultValue={editItem.item_price}
                        placeholder={"TK" + " " + editItem?.item_price}
                      />
                    </div>
                    <div>
                      <button
                        type="submit"
                        className="flex items-center justify-center w-full h-[30px] bg-purple-600 rounded text-white px-2"
                      >
                        Submit{" "}
                        {editLoading ? (
                          <RiLoader2Line className="w-5 h-5 animate-spin text-white" />
                        ) : null}
                      </button>
                    </div>
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

export default MaintainMenuItems;
