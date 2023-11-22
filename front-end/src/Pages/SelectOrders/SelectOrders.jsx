import { useParams } from "react-router-dom";
import CurrencyFormatter from "../../components/CurrencyFormatter/CurrencyFormatter";
import { useItemsContext } from "../../GlobalContext/ItemsContext";
import HyphenToSpaceConverter from "../../components/HyphenToSpaceConverter/HyphenToSpaceConverter";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { useCartContext } from "../../GlobalContext/CartContext";
import { MdDelete } from "react-icons/md";
import { MdCancel } from "react-icons/md";
import ReactToPrint from "react-to-print";

const SelectOrders = () => {
  const { name } = useParams();
  let [isOpen, setIsOpen] = useState(false);
  let [isModalOpen, setIsModalOpen] = useState(false);
  const [tableWiseCart, setTableWiseCart] = useState([]);
  const { drinksAndJuices, fastFood, vegetablesAndRices } = useItemsContext();
  const { handleAddToBill, carts, itemRemove } = useCartContext();
  const componentRef = useRef();

  const totalQuantity =
    tableWiseCart?.length > 0
      ? tableWiseCart.reduce(
          (total, currentItem) => total + currentItem.item_quantity,
          0
        )
      : 0;

  const filterTableData = (name) => {
    if (carts?.length > 0) {
      const data = carts?.filter((item) => item.table_name == name);
      setTableWiseCart(data);
    }
  };

  const handleCart = (item, tableName) => {
    handleAddToBill(item, tableName);
  };

  // handle sell
  const handleSell = (invoiceData) => {
    console.log(invoiceData);
  };

  useEffect(() => {
    filterTableData(name);
  }, [name, handleAddToBill, itemRemove]);
  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="py-1 px-2 bg-slate-300 text-lg font-semibold rounded-md flex"
      >
        Click Invoice{" "}
        <p className="ml-2 px-2 bg-blue-300 rounded-full">{totalQuantity}</p>
      </button>
      <h1 className="capitalize font-bold text-center text-2xl mb-4 mt-0 text-[#001529]">
        Order For {name}
      </h1>

      <div className="min-h-screen grid grid-cols-3 gap-2">
        <div className="min-h-screen border border-gray-200 shadow-xl rounded-md">
          <div>
            <h1 className="text-center rounded-md py-2 bg-[#001529] bg-opacity-75 text-white font-bold text-xl">
              Drinks & Juices
            </h1>
          </div>
          {drinksAndJuices &&
            drinksAndJuices?.items?.map((item, index) => (
              <div
                key={item?._id}
                className="flex justify-between items-center shadow-md mt-4 pb-2 px-2 border-b border-gray-300"
              >
                <div className="flex font-bold text-black text-lg">
                  <div>
                    <p className="mr-1">{index + 1}.</p>
                  </div>
                  <div>
                    <p className="">
                      <HyphenToSpaceConverter inputString={item?.item_name} />
                    </p>
                  </div>
                </div>
                <div>
                  <button
                    onClick={() => {
                      handleCart(item, name);
                    }}
                    className="bg-[#001529] hover:bg-opacity-70 px-2 py-1 text-white rounded-md"
                  >
                    <CurrencyFormatter value={item?.item_price} />
                  </button>
                </div>
              </div>
            ))}
        </div>
        <div className="min-h-screen border border-gray-200 shadow-xl rounded-md">
          <div>
            <h1 className="text-center rounded-md py-2 bg-[#aa5f34] bg-opacity-75 text-white font-bold text-xl">
              Fast Food
            </h1>
          </div>
          {fastFood &&
            fastFood?.items?.map((item, index) => (
              <div
                key={item._id}
                className="flex justify-between items-center mt-4 pb-2 shadow-md px-2 border-b border-gray-300"
              >
                <div className="flex font-bold text-black text-lg">
                  <div>
                    <p className="mr-1">{index + 1}.</p>
                  </div>
                  <div>
                    <p className="capitalize">
                      <HyphenToSpaceConverter inputString={item?.item_name} />
                    </p>
                  </div>
                </div>
                <div>
                  <button
                    onClick={() => {
                      handleCart(item, name);
                    }}
                    className="bg-[#714226] hover:bg-opacity-70 px-2 py-1 text-white rounded-md"
                  >
                    <CurrencyFormatter value={item?.item_price} />
                  </button>
                </div>
              </div>
            ))}
        </div>
        <div className="min-h-screen border border-gray-200 shadow-xl rounded-md">
          <div>
            <h1 className="text-center rounded-md py-2 bg-[#457322] bg-opacity-75 text-white font-bold text-xl">
              Vegetables & Rice
            </h1>
          </div>
          {vegetablesAndRices &&
            vegetablesAndRices?.items?.map((item, index) => (
              <div
                key={item._id}
                className="flex justify-between items-center mt-4 pb-2 shadow-md px-2 border-b border-gray-300"
              >
                <div className="flex font-bold text-black text-lg">
                  <div>
                    <p className="mr-1">{index + 1}.</p>
                  </div>
                  <div>
                    <p className="capitalize">
                      <HyphenToSpaceConverter inputString={item.item_name} />
                    </p>
                  </div>
                </div>
                <div>
                  <button
                    onClick={() => {
                      handleCart(item, name);
                    }}
                    className="bg-[#416622] hover:bg-opacity-70 px-2 py-1 text-white rounded-md"
                  >
                    <CurrencyFormatter value={item.item_price} />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
      {/* modal */}
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
            <div className="fixed inset-0 bg-black/50" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-2 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-md bg-white text-left align-middle shadow-xl transition-all relative">
                  <div className="absolute right-0">
                    <MdCancel
                      onClick={() => setIsOpen(!isOpen)}
                      className="h-8 w-8 cursor-pointer"
                    />
                  </div>
                  <div className="p-4 min-h-[400px]">
                    <h1 className="text-center font-bold text-3xl">
                      Food Republic
                    </h1>
                    <h1 className="text-center font-semibold text-2xl mb-4 capitalize">
                      {name}
                    </h1>
                    <div>
                      {tableWiseCart?.length > 0 ? (
                        <div>
                          {tableWiseCart
                            ?.sort((a, b) =>
                              a.item_name.localeCompare(b.item_name)
                            )
                            .map((item, index) => (
                              <div
                                key={item._id}
                                className="h-[50px] w-full border-b border-gray-300 shadow-md flex items-center"
                              >
                                <p>{index + 1}.</p>
                                <p>
                                  <HyphenToSpaceConverter
                                    inputString={item.item_name}
                                  />
                                </p>
                                <div className="ml-auto mr-4">
                                  <button className="px-2 text-gray-500">
                                    {item.item_quantity} piece
                                  </button>
                                </div>
                                <div className="px-4">
                                  <CurrencyFormatter
                                    value={
                                      item.item_price_per_unit *
                                      item.item_quantity
                                    }
                                  />
                                </div>
                                <div className="">
                                  <MdDelete
                                    onClick={() => itemRemove(item)}
                                    className="text-red-700 h-6 w-6 cursor-pointer mx-4"
                                  />
                                </div>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <div>
                          <h1 className="text-center mt-6">Empty...</h1>
                        </div>
                      )}
                    </div>
                  </div>
                  {tableWiseCart?.length > 0 ? (
                    <div className="text-center space-x-4 my-4">
                      <button
                        onClick={() => setIsModalOpen(!isModalOpen)}
                        className="h-[40px] w-[130px] bg-blue-500 rounded-md text-white"
                      >
                        Demo Invoice
                      </button>
                      <button
                        onClick={() => handleSell(tableWiseCart)}
                        className="h-[40px] w-[130px] bg-purple-800 rounded-md text-white"
                      >
                        Final Invoice
                      </button>
                    </div>
                  ) : null}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      {/* second modal */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsModalOpen(!isModalOpen)}
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
            <div className="flex min-h-full items-center justify-center p-2 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-md bg-white text-left align-middle shadow-xl transition-all relative">
                  <div ref={componentRef} className="p-4 min-h-[400px]">
                    <h1 className="text-center font-bold text-xl">
                      Food Republic
                    </h1>
                    <h1 className="text-center font-semibold text-base mb-4 capitalize">
                      {name}
                    </h1>
                    <div>
                      <div>
                        {tableWiseCart
                          ?.sort((a, b) =>
                            a.item_name.localeCompare(b.item_name)
                          )
                          .map((item, index) => (
                            <div
                              key={item._id}
                              className="h-[50px] w-full border-b border-gray-300 flex items-center"
                            >
                              <p className="text-xs">{index + 1}.</p>
                              <p className="text-xs">
                                <HyphenToSpaceConverter
                                  inputString={item.item_name}
                                />
                              </p>
                              <div className="ml-auto mr-4">
                                <button className="px-2 text-gray-500 text-xs">
                                  {item.item_quantity} piece
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-center space-x-4 my-4">
                    <ReactToPrint
                      trigger={() => (
                        <button className="h-[40px] w-[130px] bg-blue-500 rounded-md text-white">
                          Print Demo
                        </button>
                      )}
                      content={() => componentRef.current}
                    />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default SelectOrders;

// Swal.fire({
//   title: "Are you sure?",
//   text: "You won't be able to revert this!",
//   icon: "warning",
//   showCancelButton: true,
//   confirmButtonColor: "#3085d6",
//   cancelButtonColor: "#d33",
//   confirmButtonText: "Yes, delete it!"
// }).then((result) => {
//   if (result.isConfirmed) {
//     Swal.fire({
//       title: "Deleted!",
//       text: "Your file has been deleted.",
//       icon: "success"
//     });
//   }
// });
