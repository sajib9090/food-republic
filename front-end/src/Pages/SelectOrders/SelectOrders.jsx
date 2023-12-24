import { useNavigate, useParams } from "react-router-dom";
import CurrencyFormatter from "../../components/CurrencyFormatter/CurrencyFormatter";
import CurrencyFormatter2 from "../../components/CurrencyFormatter2/CurrencyFormatter2";
import { useItemsContext } from "../../GlobalContext/ItemsContext";
import HyphenToSpaceConverter from "../../components/HyphenToSpaceConverter/HyphenToSpaceConverter";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { useCartContext } from "../../GlobalContext/CartContext";
import { MdDelete } from "react-icons/md";
import { MdCancel } from "react-icons/md";
import ReactToPrint from "react-to-print";
import DateFormatter from "../../components/DateFormatter/DateFormatter";
import Swal from "sweetalert2";
import axios from "axios";
import toast from "react-hot-toast";
import { RiLoader2Line } from "react-icons/ri";
import { CiCircleRemove } from "react-icons/ci";
import { FiLoader } from "react-icons/fi";

const SelectOrders = () => {
  const { name } = useParams();
  let [isOpen, setIsOpen] = useState(false);
  let [isModalOpen, setIsModalOpen] = useState(false);
  let [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  let [membership, setMembership] = useState(false);
  let [loading, setLoading] = useState(false);
  let [number, setNumber] = useState("");
  const [tableWiseCart, setTableWiseCart] = useState([]);
  const [member, setMember] = useState({});
  const [memberShipDiscount, setMemberShipDiscount] = useState(null);
  const [availableDiscount, setAvailableDiscount] = useState(false);
  const { categories, menuItems, staffs } = useItemsContext();
  const {
    handleAddToBill,
    carts,
    itemRemove,
    handleRemoveAllSoldCart,
    itemQuantityIncrease,
    itemQuantityDecrease,
  } = useCartContext();
  const componentRef = useRef();
  const navigate = useNavigate();

  const [searchInputValue, setSearchInputValue] = useState("");

  //quantity increase and decrease function
  const handleQuantityIncrease = (item) => {
    itemQuantityIncrease(item);
  };
  const handleQuantityDecrease = (item) => {
    itemQuantityDecrease(item);
  };
  //end

  //staff validation functions
  const [selectedStaff, setSelectedStaff] = useState("");
  const [triggerEffect, setTriggerEffect] = useState(false);
  const [staffValidation, setStaffValidation] = useState("");
  const [staffLoading, setStaffLoading] = useState(false);
  const [staff, setStaff] = useState({});
  const [isStaffSelected, setIsStaffSelected] = useState(false);

  const handleSelectChange = (event) => {
    setSelectedStaff(event.target.value);
  };

  const handleButtonClick = () => {
    if (selectedStaff && name) {
      setStaffLoading(true);
      const data = {
        staff_name: selectedStaff,
        table_code: name,
      };
      axios
        .post(`${import.meta.env.VITE_API_URL}/api/add-order-staff`, data)
        .then((res) => {
          if (res?.data?.result?.insertedId) {
            toast.success("Staff selected", { autoClose: 100 });
            setTriggerEffect(!triggerEffect);
            setIsStaffSelected(true);
          }
        })
        .catch((err) => {
          if (err) {
            toast.error("Something went wrong!", { autoClose: 100 });
          }
        })
        .finally(() => {
          setStaffLoading(false);
        });
    } else {
      toast.error("Please select a Staff", { autoClose: 100 });
    }
  };

  const handleStaffRemove = (tableCode) => {
    axios
      .delete(
        `${
          import.meta.env.VITE_API_URL
        }/api/delete-order?table_code=${tableCode}`
      )
      .then((res) => {
        if (res) {
          toast.success("Cleared", { autoClose: 100 });
          setTriggerEffect(!triggerEffect);
          setIsStaffSelected(false);
        }
      })
      .catch((err) => {
        if (err) {
          toast.error("Something went wrong", { autoClose: 100 });
        }
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (name) {
          const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/get-orders?table_code=${name}`
          );
          setStaffValidation(res.data.orders[0]?.staff_name);
          setStaff(res.data.orders);
          setIsStaffSelected(res.data.orders.length > 0);
        }
      } catch (error) {
        if (error) {
          toast.error("Select a staff", { autoClose: 100 });
        }
      }
    };

    fetchData();
  }, [name, triggerEffect]);
  //staff validation function end

  const handleSearchInputChange = (event) => {
    event.preventDefault();
    setSearchInputValue(event.target.value);
  };
  const filteredMenuItems = menuItems?.filter((item) =>
    item?.item_name?.toLowerCase().includes(searchInputValue.toLowerCase())
  );

  //carts items sum calculation
  const totalPrice = tableWiseCart?.reduce((sum, currentItem) => {
    const itemTotal =
      currentItem.item_price_per_unit * currentItem.item_quantity;
    return sum + itemTotal;
  }, 0);

  const handleMemberShip = () => {
    setNumber(number);
    if (number) {
      setLoading(true);
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/get-members?search=${number}`)
        .then((res) => {
          if (res.data.member.discountValue) {
            setMember(res.data.member);
            setMemberShipDiscount(res.data.member.discountValue);
            setAvailableDiscount(true);
          }
        })
        .catch((err) => {
          if (err) {
            setAvailableDiscount(false);
            setMemberShipDiscount(null);
            setTotalDiscount(0);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const [totalDiscount, setTotalDiscount] = useState(0);

  const handleApply = () => {
    if (availableDiscount && memberShipDiscount) {
      const discount = (totalPrice * memberShipDiscount) / 100;
      setTotalDiscount(discount);
    }
  };

  const handleSingleItemRemove = (item) => {
    if (carts.length === 1) {
      window.location.reload();
    }
    itemRemove(item);
  };

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

  const handleCart = (item, tableName, staffName) => {
    if (isStaffSelected) {
      handleAddToBill(item, tableName, staffName);
      toast.success(item.item_name + " added", {
        autoClose: 500,
      });
    } else {
      toast.error("Please select a staff");
    }
  };

  //
  // Updated handleCross function
  const handleCross = (item) => {
    const updatedTableWiseCart = tableWiseCart.map((cartItem) => {
      if (cartItem._id === item._id) {
        return { ...cartItem, showDeleteTag: !cartItem.showDeleteTag };
      }
      return cartItem;
    });

    setTableWiseCart(updatedTableWiseCart);
  };

  // handle sell
  const handleSell = (invoiceData, tableName) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Want to set payment done?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#001529",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        const soldItems = {
          table_name: tableName,
          served_by: staffValidation,
          items: invoiceData,
          total_bill: totalPrice,
          total_discount: totalDiscount,
        };
        axios
          .post(
            `${import.meta.env.VITE_API_URL}/api/post-sold-invoices`,
            soldItems
          )
          .then((res) => {
            if (res?.data?.insertedId) {
              Swal.fire({
                title: "Success!",
                html: `Items have been sold<br>ID: ${res.data.insertedId}`,
                icon: "success",
              });
              const memberData = {
                total_discount: parseFloat(totalDiscount),
              };
              if (totalDiscount && member) {
                axios
                  .patch(
                    `${import.meta.env.VITE_API_URL}/api/update-member/${
                      member?.mobile
                    }`,
                    memberData
                  )
                  .then((response) => {
                    if (response) {
                      handleRemoveAllSoldCart(tableName);
                      navigate(`${res.data.insertedId}`);

                      axios
                        .delete(
                          `${
                            import.meta.env.VITE_API_URL
                          }/api/delete-order?table_code=${name}`
                        )
                        .then((res) => {
                          if (res) {
                            setTriggerEffect(!triggerEffect);
                            setIsStaffSelected(false);
                          }
                        })
                        .catch((err) => {
                          if (err) {
                            toast.error("Something went wrong", {
                              autoClose: 100,
                            });
                          }
                        });
                    }
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              } else {
                handleRemoveAllSoldCart(tableName);
                navigate(`${res.data.insertedId}`);
                axios
                  .delete(
                    `${
                      import.meta.env.VITE_API_URL
                    }/api/delete-order?table_code=${name}`
                  )
                  .then((res) => {
                    if (res) {
                      setTriggerEffect(!triggerEffect);
                      setIsStaffSelected(false);
                    }
                  })
                  .catch((err) => {
                    if (err) {
                      toast.error("Something went wrong", { autoClose: 100 });
                    }
                  });
              }
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };

  useEffect(() => {
    filterTableData(name);
  }, [name, handleAddToBill, itemRemove, carts]);
  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="py-2 px-2 bg-slate-400 text-lg font-semibold rounded-md flex sticky top-6 z-50"
      >
        Check Invoice{" "}
        <p className="ml-2 px-2 bg-blue-300 rounded-full">{totalQuantity}</p>
      </button>
      <h1 className="capitalize font-bold text-center text-2xl mb-4 mt-0 text-[#001529]">
        Order For {name}
      </h1>

      <div className="mt-0">
        {!isStaffSelected ? (
          <div className="flex items-center">
            <label>Select Staff*</label>
            <select
              className="h-[40px] w-[150px] bg-gray-200 rounded text-black px-2"
              onChange={handleSelectChange}
              value={selectedStaff}
            >
              <option value="" disabled>
                Select Staff
              </option>
              {staffs?.map((item) => (
                <option
                  className="text-black font-semibold text-base capitalize"
                  key={item._id}
                  value={item?.name}
                >
                  {item?.name}
                </option>
              ))}
            </select>
            <button
              className="h-[40px] w-[100px] bg-blue-500 text-white rounded-r flex items-center justify-center"
              onClick={handleButtonClick}
              disabled={staffLoading}
            >
              Select{" "}
              {staffLoading ? (
                <FiLoader className="w-6 h-6 animate-spin text-white font-bold" />
              ) : null}
            </button>
          </div>
        ) : (
          <div className="flex items-center">
            <p className="capitalize">
              Order by:{" "}
              <span className="text-red-600 font-semibold ml-2">
                {staff ? staff[0]?.staff_name : null}
              </span>
            </p>
            <button
              onClick={() =>
                handleStaffRemove(staff ? staff[0]?.table_code : null)
              }
            >
              <CiCircleRemove className="w-6 h-6 text-red-600 cursor-pointer ml-3" />
            </button>
          </div>
        )}

        <form className="max-w-md mx-auto mb-6">
          <input
            value={searchInputValue}
            onChange={handleSearchInputChange}
            className="h-[50px] w-full border-2 border-gray-500 rounded px-2 text-2xl shadow-inner"
            type="search"
            name="searchInput"
            placeholder="Search menu item here..."
          />
        </form>
      </div>
      <div className="min-h-screen grid grid-cols-4 gap-2">
        {categories
          ?.sort((a, b) => a?.category?.localeCompare(b.category))
          .map((category, index) => (
            <div
              key={category._id}
              className="min-h-screen border border-gray-200 shadow-xl rounded-md"
            >
              <div
                className={`capitalize text-center rounded-md py-2 font-bold text-xl ${
                  index === 0
                    ? "bg-[#001529] bg-opacity-75 text-white"
                    : index === 1
                    ? "bg-[#aa5f34] bg-opacity-75 text-white"
                    : "bg-[#457322] bg-opacity-75 text-white"
                }`}
              >
                <HyphenToSpaceConverter inputString={category.category} />
              </div>

              {filteredMenuItems
                ?.filter((item) => item?.category === category.category)
                .map((item, i) => (
                  <div
                    key={item._id}
                    onClick={() => {
                      handleCart(item, name, staffValidation);
                    }}
                    className="flex justify-between items-center shadow-md mt-4 pb-2 px-2 border-b border-gray-300 cursor-pointer"
                  >
                    <div className="flex font-bold text-black text-lg">
                      <div>
                        <p className="mr-1">{i + 1}.</p>
                      </div>
                      <div>
                        <p className="wrapped-text capitalize">
                          <HyphenToSpaceConverter
                            inputString={item?.item_name}
                          />
                        </p>
                      </div>
                    </div>
                    <div>
                      <button
                        className={`hover:bg-opacity-70 px-2 py-1 text-white rounded-md ${
                          index == 0
                            ? "bg-[#001529]"
                            : index == 1
                            ? "bg-[#aa5f34]"
                            : "bg-[#457322]"
                        }`}
                      >
                        <CurrencyFormatter value={item?.item_price} />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          ))}
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
                <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-md bg-white text-left align-middle shadow-xl transition-all relative">
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
                        <>
                          <div className="min-h-[30px] border-b border-gray-200 flex items-center justify-between mb-2 font-bold">
                            <div>
                              <p className="ml-4">Items</p>
                            </div>
                            <div className="flex items-center mr-16">
                              <p className="mr-[5.4rem]">Quantity</p>
                              <p>Price</p>
                            </div>
                          </div>
                          <div>
                            {tableWiseCart
                              ?.sort((a, b) =>
                                a.item_name.localeCompare(b.item_name)
                              )
                              .map((item, index) => (
                                <div
                                  key={item._id}
                                  className="min-h-[50px] w-full border-b border-gray-300 shadow-md flex items-center justify-between py-2"
                                >
                                  <div className="flex items-center min-w-[65%]">
                                    <p>{index + 1}.</p>
                                    <div className="wrapped-text2 capitalize">
                                      <HyphenToSpaceConverter
                                        inputString={item.item_name}
                                      />
                                    </div>
                                  </div>
                                  <div className="flex items-center min-w-[35%]">
                                    <div className="min-w-[30%] flex justify-end">
                                      <button
                                        onClick={() =>
                                          handleQuantityDecrease(item)
                                        }
                                        className="bg-gray-300 px-2 rounded-l"
                                      >
                                        -
                                      </button>
                                      <p className="px-2 text-gray-500 flex">
                                        {item?.item_quantity}
                                      </p>
                                      <button
                                        onClick={() =>
                                          handleQuantityIncrease(item)
                                        }
                                        className="bg-gray-300 px-2 rounded-r"
                                      >
                                        +
                                      </button>
                                    </div>
                                    <div className="min-w-[50%] flex justify-end">
                                      <CurrencyFormatter
                                        value={
                                          item.item_price_per_unit *
                                          item.item_quantity
                                        }
                                      />
                                    </div>
                                    <div className="min-w-[20%] flex justify-end">
                                      <MdDelete
                                        onClick={() =>
                                          handleSingleItemRemove(item)
                                        }
                                        className="text-red-700 h-8 w-8 cursor-pointer mx-2"
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </>
                      ) : (
                        <div>
                          <h1 className="text-center mt-6">Empty...</h1>
                        </div>
                      )}
                    </div>
                    {tableWiseCart?.length > 0 ? (
                      <div>
                        <div>
                          <h1 className="flex justify-end font-medium text-lg mt-2 mb-2">
                            Total Bill:{" "}
                            <span className="ml-4">
                              <CurrencyFormatter value={totalPrice} />
                            </span>
                          </h1>
                          {availableDiscount ? (
                            <div className="flex justify-end space-x-4">
                              <button>{memberShipDiscount}%</button>
                              <button
                                onClick={handleApply}
                                className="bg-gray-200 px-2 "
                              >
                                Apply
                              </button>
                            </div>
                          ) : (
                            <div className="flex justify-end">
                              <p className="text-red-600">
                                No Membership found
                              </p>
                            </div>
                          )}
                          {availableDiscount && totalDiscount ? (
                            <div className="flex justify-end mt-2">
                              <h1 className="flex text-lg font-extrabold">
                                After Discount:{" "}
                                <span className="ml-4">
                                  <CurrencyFormatter
                                    value={totalPrice - totalDiscount}
                                  />
                                </span>
                              </h1>
                            </div>
                          ) : null}
                        </div>
                        <div>
                          <p
                            onClick={() => setMembership(!membership)}
                            className="underline cursor-pointer"
                          >
                            Membership offer
                          </p>
                          {membership ? (
                            <div className="flex mt-1">
                              <input
                                type="number"
                                value={number}
                                onChange={(e) => setNumber(e.target.value)}
                                className="h-[20px] w-[140px] border-2 border-gray-300"
                                placeholder="Enter mobile number"
                              />
                              <button
                                onClick={handleMemberShip}
                                className="h-[20px] w-[100px] bg-slate-200 flex items-center justify-center"
                              >
                                Check{" "}
                                {loading ? (
                                  <RiLoader2Line className="h-3 w-3 animate-spin text-black " />
                                ) : null}
                              </button>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    ) : null}
                  </div>
                  {tableWiseCart?.length > 0 ? (
                    <div className="text-center space-x-4 my-4">
                      <button
                        onClick={() => setIsModalOpen(!isModalOpen)}
                        className="h-[40px] w-[130px] bg-blue-500 rounded-md text-white"
                      >
                        Kitchen Copy
                      </button>
                      <button
                        onClick={() =>
                          setIsCustomerModalOpen(!isCustomerModalOpen)
                        }
                        className="h-[40px] w-[130px] bg-purple-800 rounded-md text-white"
                      >
                        Customer Copy
                      </button>
                      <button
                        onClick={() => handleSell(tableWiseCart, name)}
                        className="h-[40px] w-[130px] bg-red-600 rounded-md text-white"
                      >
                        Payment Done
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
                <Dialog.Panel className="w-full max-w-[310px] transform overflow-hidden rounded-md bg-white text-left align-middle shadow-xl transition-all relative">
                  <div ref={componentRef} className="p-4 min-h-[400px]">
                    <h1 className="text-center font-bold text-xl">
                      Food Republic
                    </h1>
                    <h1 className="text-center font-semibold text-base mb-1 capitalize">
                      {name}
                    </h1>

                    <div className="text-center text-[10px]">
                      <DateFormatter dateString={new Date()} />
                    </div>
                    <h1 className="text-center font-bold">Kitchen Copy</h1>
                    <div>
                      <div className="min-h-[30px] border-b border-black flex items-center justify-between text-xs mt-2">
                        <div>Items</div>
                        <div className="flex items-center">
                          <p>Quantity</p>
                          <p className="mr-1 ml-6">Price</p>
                        </div>
                      </div>
                      <div>
                        {tableWiseCart
                          ?.sort((a, b) =>
                            a.item_name.localeCompare(b.item_name)
                          )
                          .map((item, index) => (
                            <div
                              onClick={() => handleCross(item)}
                              key={item._id}
                              className="min-h-[30px] w-full border-b border-gray-500 flex items-center cursor-pointer justify-between text-[10px]"
                            >
                              <div className="flex items-center min-w-[70%]">
                                <p className="">{index + 1}.</p>
                                {item.showDeleteTag ? (
                                  <del className=" wrapped-text capitalize">
                                    <HyphenToSpaceConverter
                                      inputString={item.item_name}
                                    />
                                  </del>
                                ) : (
                                  <p className="wrapped-text capitalize">
                                    <HyphenToSpaceConverter
                                      inputString={item.item_name}
                                    />
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center min-w-[30%]">
                                <div className="ml-auto flex min-w-[30%]">
                                  <button className=" text-black">
                                    {item.item_quantity}
                                  </button>
                                  <button className="ml-2 text-black">-</button>
                                </div>
                                <div className="text-black min-w-[70%] flex justify-end">
                                  <CurrencyFormatter
                                    value={
                                      item.item_price_per_unit *
                                      item.item_quantity
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                      <div className="text-base font-semibold mt-1">
                        <h1 className="flex justify-end">
                          Total Price:{" "}
                          <span className="ml-2">
                            <CurrencyFormatter value={totalPrice} />
                          </span>
                        </h1>
                      </div>
                    </div>
                  </div>
                  <div className="text-center space-x-4 my-4">
                    <ReactToPrint
                      trigger={() => (
                        <button className="h-[40px] w-[160px] bg-blue-500 rounded-md text-white">
                          Print Kitchen Copy
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
      {/* third modal */}
      <Transition appear show={isCustomerModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsCustomerModalOpen(!isCustomerModalOpen)}
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
                <Dialog.Panel className="w-full max-w-[310px] transform overflow-hidden rounded-md bg-white text-left align-middle shadow-xl transition-all relative">
                  <div
                    ref={componentRef}
                    className="max-w-[310px] min-h-[300px] shadow-md mx-auto rounded-md pb-1"
                  >
                    <div className="text-center mt-6">
                      <div className="mx-auto w-full">
                        <img
                          src="https://i.ibb.co/CvZ6N5H/food-republic-bw-logo.png"
                          alt=""
                          className="h-[50px] text-center mx-auto"
                        />
                      </div>
                      <h1 className="text-2xl font-bold">Food Republic</h1>
                      <p className="text-[8.5px] -mt-0.5">
                        Mazhi Plaza 2nd floor, Naria, Shariatpur
                      </p>
                      <div className="text-[8.5px] flex justify-center space-x-1">
                        <p>+8801770 940333,</p>
                        <p>+8801903 390050</p>
                      </div>

                      <p className="text-xs mb-1">
                        <DateFormatter dateString={new Date()} />
                      </p>
                      <p className="capitalize text-xs">{name}</p>
                    </div>
                    <p className="text-[8px] pl-2">
                      Served by:{" "}
                      <span className="capitalize">{staffValidation}</span>
                    </p>
                    <div className="mt-2 px-1">
                      <div className="min-h-[30px] border-b border-black flex justify-between items-center px-3 text-[10px]">
                        <div>Items</div>
                        <div className="flex">
                          <div className="mr-8">Quantity</div>
                          <div>Price</div>
                        </div>
                      </div>
                      {tableWiseCart &&
                        tableWiseCart?.map((item, index) => (
                          <div
                            key={item._id}
                            className="min-h-[27px] w-full border-b border-gray-600 flex items-center justify-between text-[10px] pr-1"
                          >
                            <div className="flex items-center w-[70%]">
                              <p className="mr-1">{index + 1}.</p>
                              <p className="wrapped-text3 capitalize">
                                <HyphenToSpaceConverter
                                  inputString={item?.item_name}
                                />
                              </p>
                            </div>
                            <div className="flex items-center justify-end w-[30%]">
                              <div className="flex items-center w-[30%]">
                                <div className="mr-3">{item.item_quantity}</div>
                                <div>-</div>
                              </div>
                              <div className="ml-1 w-[70%] text-end">
                                <CurrencyFormatter
                                  value={
                                    item.item_price_per_unit *
                                    item.item_quantity
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                    <div className="w-[210px] flex flex-col justify-end ml-auto mt-2 pr-1">
                      <div className="flex justify-end text-sm font-medium min-w-full">
                        <p className="w-[50%] text-end">Total Bill:</p>
                        <div className="w-[50%] text-end">
                          <CurrencyFormatter2 value={totalPrice} />
                        </div>
                      </div>
                      <div className="min-w-[50%]">
                        {totalDiscount ? (
                          <>
                            <div className="flex justify-end text-sm font-medium w-full">
                              <p className="w-[50%] text-end">Discount:</p>
                              <div className="w-[50%] text-end">
                                <CurrencyFormatter2
                                  value={
                                    totalPrice - (totalPrice - totalDiscount)
                                  }
                                />
                              </div>
                            </div>
                            <div className="flex justify-end text-sm font-bold w-full">
                              <p className="w-[50%] text-end">Net Bill:</p>
                              <div className="w-[50%] text-end">
                                <CurrencyFormatter2
                                  value={totalPrice - totalDiscount}
                                />
                              </div>
                            </div>
                          </>
                        ) : null}
                      </div>
                    </div>
                    <div className="text-[7px] text-start ml-2 mt-2 font-medium">
                      Software Developed by Saif Sajib
                    </div>
                  </div>
                  <div className="text-center space-x-4 my-4">
                    <ReactToPrint
                      trigger={() => (
                        <button className="h-[40px] w-[160px] bg-blue-500 rounded-md text-white">
                          Print Customer Copy
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
