import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import { useForm } from "react-hook-form";
import { MdDelete, MdEditSquare } from "react-icons/md";
import CurrencyFormatter from "../../../../components/CurrencyFormatter/CurrencyFormatter";
import { useItemsContext } from "../../../../GlobalContext/ItemsContext";
import toast from "react-hot-toast";
import axios from "axios";
import HyphenToSpaceConverter from "../../../../components/HyphenToSpaceConverter/HyphenToSpaceConverter";
import { useState } from "react";
import { RiLoader2Line } from "react-icons/ri";

const MaintainVegetablesAndRices = () => {
  const { vegetablesAndRices, refetchItems } = useItemsContext();
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

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
        item_price: parseFloat(data.price),
      };

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/add-vegetables-rices`,
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

  const handleDelete = async (item) => {
    try {
      setDeleteLoading(true);

      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/delete-vegetables-rices/${
          item._id
        }`
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
  return (
    <div>
      <div className="w-full px-4 pt-4">
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
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                    <div>
                      <label>Item Name with details*</label>
                      <input
                        className="h-[40px] w-full border-2 border-purple-900 rounded-md px-2"
                        type="text"
                        placeholder="Fried rice"
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
      <div className="mt-6">
        <div className="grid grid-cols-2 gap-2">
          {vegetablesAndRices &&
            vegetablesAndRices?.items?.map((item, index) => (
              <div
                key={item._id}
                className="min-h-[60px] rounded-sm shadow-md flex items-center justify-between hover:bg-slate-200"
              >
                <div className="flex ml-2 font-semibold">
                  <p>{index + 1}.</p>
                  <p>
                    <HyphenToSpaceConverter inputString={item.item_name} />
                  </p>
                </div>
                <div className="flex">
                  <p className="mr-4">
                    <CurrencyFormatter value={item.item_price} />
                  </p>
                  <MdEditSquare
                    title="edit"
                    className="cursor-pointer h-6 w-6 text-blue-600 "
                  />
                  <MdDelete
                    onClick={() => handleDelete(item)}
                    title="remove"
                    disabled={deleteLoading}
                    className="ml-4 mr-2 cursor-pointer h-6 w-6 text-red-600 "
                  />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MaintainVegetablesAndRices;
