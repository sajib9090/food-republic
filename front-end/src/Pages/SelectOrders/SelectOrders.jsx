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
import { PiBagFill } from "react-icons/pi";
import { differenceInDays } from "date-fns";

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

  const totalPriceWithOutDiscount = tableWiseCart?.reduce(
    (sum, currentItem) => {
      if (!currentItem.discount) {
        const itemTotal =
          currentItem.item_price_per_unit * currentItem.item_quantity;
        return sum + itemTotal;
      }
      return sum;
    },
    0
  );

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
      const discount =
        ((totalPrice - totalPriceWithOutDiscount) * memberShipDiscount) / 100;
      setTotalDiscount(discount);
    }
  };

  //money back ang get function and state
  const [gotMoney, setGotMoney] = useState("");
  const [backMoney, setBackMoney] = useState("");

  const handleGotMoney = (e) => {
    const value = e.target.value;
    setGotMoney(value);
    if (totalDiscount) {
      setBackMoney(parseFloat(value) - (totalPrice - totalDiscount));
    } else {
      setBackMoney(parseFloat(value) - totalPrice);
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

  const handleCart = (item, tableName, staffName, orderTime) => {
    if (isStaffSelected) {
      handleAddToBill(item, tableName, staffName, orderTime);
      toast.success(item.item_name + " added", {
        autoClose: 500,
      });
    } else {
      toast.error("Please select a staff");
    }
  };

  const [temporaryRemovedItems, setTemporaryRemovedItems] = useState([]);
  const [originalTableWiseCart, setOriginalTableWiseCart] = useState([]);
  const [filteredTableWiseCart, setFilteredTableWiseCart] = useState([]);

  useEffect(() => {
    setOriginalTableWiseCart(tableWiseCart);
    setFilteredTableWiseCart(tableWiseCart);
  }, [tableWiseCart]);

  const handleCross = (item) => {
    setTemporaryRemovedItems((prevItems) => [...prevItems, item]);
  };

  useEffect(() => {
    const updatedFilteredCart = originalTableWiseCart.filter(
      (item) => !temporaryRemovedItems.includes(item)
    );
    setFilteredTableWiseCart(updatedFilteredCart);
  }, [temporaryRemovedItems, originalTableWiseCart]);

  const kitchenTotalPrice = filteredTableWiseCart?.reduce(
    (sum, currentItem) => {
      const itemTotal =
        currentItem.item_price_per_unit * currentItem.item_quantity;
      return sum + itemTotal;
    },
    0
  );

  const handleReload = () => {
    setTemporaryRemovedItems([]);
    setFilteredTableWiseCart(originalTableWiseCart);
  };

  const handleKitchenDecrease = (item) => {
    if (item?.item_quantity > 1) {
      const updatedCart = filteredTableWiseCart?.map((cartItem) => {
        if (cartItem?._id === item?._id) {
          return {
            ...cartItem,
            item_quantity: cartItem?.item_quantity - 1,
          };
        }
        return cartItem;
      });
      setFilteredTableWiseCart(updatedCart);
    }
  };
  const handleKitchenIncrease = (item) => {
    const updatedCart = filteredTableWiseCart?.map((cartItem) => {
      if (cartItem?._id === item?._id) {
        return {
          ...cartItem,
          item_quantity: cartItem?.item_quantity + 1,
        };
      }
      return cartItem;
    });
    setFilteredTableWiseCart(updatedCart);
  };

  // handle sell
  const [sellLoading, setSellLoading] = useState(false);
  const handleSell = async (invoiceData, tableName) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Want to set payment done?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#001529",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    });

    if (result.isConfirmed) {
      setSellLoading(true);

      try {
        const soldItems = {
          table_name: tableName,
          member: memberShipDiscount ? member.mobile : null,
          served_by: staffValidation,
          items: invoiceData,
          total_bill: totalPrice,
          total_discount: totalDiscount,
        };

        const sellResponse = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/post-sold-invoices`,
          soldItems
        );

        if (sellResponse?.data?.insertedId) {
          setSellLoading(false);

          await Swal.fire({
            title: "Success!",
            html: `Items have been sold<br>ID: ${sellResponse.data.fr_id}`,
            icon: "success",
          });

          const memberData = {
            total_discount: parseFloat(totalDiscount),
            total_spent: parseFloat(totalPrice),
            invoices_code: sellResponse?.data?.insertedId,
          };

          if (totalDiscount && member) {
            const updateMemberResponse = await axios.patch(
              `${import.meta.env.VITE_API_URL}/api/update-member/${
                member?.mobile
              }`,
              memberData
            );

            if (updateMemberResponse) {
              handleRemoveAllSoldCart(tableName);
              navigate(`${sellResponse.data.fr_id}`);

              const deleteOrderResponse = await axios.delete(
                `${
                  import.meta.env.VITE_API_URL
                }/api/delete-order?table_code=${name}`
              );

              if (deleteOrderResponse) {
                setTriggerEffect(!triggerEffect);
                setIsStaffSelected(false);
              }
            }
          } else {
            handleRemoveAllSoldCart(tableName);
            navigate(`${sellResponse.data.fr_id}`);

            const deleteOrderResponse = await axios.delete(
              `${
                import.meta.env.VITE_API_URL
              }/api/delete-order?table_code=${name}`
            );

            if (deleteOrderResponse) {
              setTriggerEffect(!triggerEffect);
              setIsStaffSelected(false);
            }
          }
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Something went wrong", { autoClose: 100 });
      }
    }
  };

  const [isOpenInputField, setIsOpenInputField] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [commentError, setCommentError] = useState("");
  const [commentLength, setCommentLength] = useState(0);
  const [commentLoading, setCommentLoading] = useState(false);

  const handleComment = async (data) => {
    const commentData = {
      comment: commentInput,
      staff: staff[0]?.staff_name,
      table: name,
      items: data,
    };

    setCommentLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/comment/add`,
        commentData
      );

      if (response) {
        handleRemoveAllSoldCart(name);
        navigate("/sell");
        const deleteOrderResponse = await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/delete-order?table_code=${name}`
        );
        if (deleteOrderResponse) {
          setTriggerEffect(!triggerEffect);
          setIsStaffSelected(false);
        }
      }
    } catch (error) {
      setCommentError(error?.response?.data);
    } finally {
      setCommentLoading(false);
    }
  };

  const [subscription, setSubscription] = useState({});
  const fetchSubscription = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/subscription`
      );
      setSubscription(response?.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const currentDate = new Date();
  const expiresAt = new Date(subscription?.expiresAt);
  const difference = differenceInDays(expiresAt, currentDate);

  useEffect(() => {
    fetchSubscription();
  }, []);

  useEffect(() => {
    filterTableData(name);
  }, [name, handleAddToBill, itemRemove, carts]);

  if (difference < 1) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-pink-500 to-orange-300">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h1 className="text-4xl font-bold text-pink-500 mb-6">
            Subscription Expired
          </h1>
          <p className="text-lg mb-8">
            Your subscription has expired. Please make a payment to continue
            using our services.
          </p>
          <button
            className="bg-pink-500 text-white py-3 px-6 rounded-lg text-lg transition duration-300 ease-in-out hover:bg-orange-400"
            onClick={() => navigate("/payment")}
          >
            Make Payment
          </button>
        </div>
      </div>
    );
  }
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
                    : index === 2
                    ? "bg-[#457322] bg-opacity-75 text-white"
                    : "bg-pink-700 bg-opacity-75 text-white"
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
                      handleCart(
                        item,
                        name,
                        staffValidation,
                        staff[0]?.createdDate
                      );
                    }}
                    className="flex justify-between items-center py-4 shadow-md px-2 border-b border-gray-300 cursor-pointer hover:shadow-md hover:bg-gray-200 hover:text-red-700"
                  >
                    <div className="flex font-bold text-black hover:text-red-700 text-lg">
                      <div>
                        <p className="mr-1">{i + 1}.</p>
                      </div>
                      <div>
                        <p className="wrapped-text capitalize hover:text-red-700">
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
                            : index == 2
                            ? "bg-[#457322]"
                            : "bg-pink-700"
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
                                  title={item.item_name}
                                  className={`min-h-[50px] w-full border-b border-gray-300 flex items-center justify-between pl-2 py-2 ${
                                    item?.discount
                                      ? "bg-white"
                                      : "bg-purple-100"
                                  }`}
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
                                        title="remove"
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
                          <button
                            onClick={() =>
                              setIsOpenInputField(!isOpenInputField)
                            }
                            title="Remove all"
                            className="my-2 rounded p-2 flex items-center bg-gradient-to-r from-red-600 to-yellow-600 text-white"
                          >
                            Remove all
                            <PiBagFill className="ml-2 h-5 w-5 text-gray-200" />
                          </button>
                          {isOpenInputField ? (
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                handleComment(tableWiseCart);
                              }}
                              className="flex flex-col items-start"
                            >
                              <textarea
                                required
                                onChange={(e) => {
                                  setCommentInput(e.target.value);
                                  setCommentError(commentInput?.length > 199);
                                  setCommentLength(commentInput?.length + 1);
                                }}
                                value={commentInput}
                                className={`px-2 py-1 h-[150px] w-[350px] rounded border-2 border-gray-300 ${
                                  commentError ? "border-2 border-red-600" : ""
                                }`}
                                type="text"
                                placeholder="write comment"
                              />
                              <p className="text-gray-400 text-[12px]">
                                characters: {commentLength}{" "}
                                <span className="text-red-600">(max: 200)</span>
                              </p>
                              <p className="text-red-600">{commentError}</p>
                              <button
                                type="submit"
                                disabled={
                                  commentError ||
                                  !commentInput ||
                                  commentLoading
                                }
                                className={`bg-gray-300 flex items-center justify-center text-black rounded mt-1 h-[40px] w-[120px] ${
                                  commentError ||
                                  !commentInput ||
                                  commentLoading
                                    ? "bg-red-600 text-white cursor-not-allowed"
                                    : ""
                                }`}
                              >
                                {commentLoading ? (
                                  <RiLoader2Line className="animate-spin w-6 h-5" />
                                ) : (
                                  "Submit"
                                )}
                              </button>
                            </form>
                          ) : null}
                          <div className="max-w-[28.5rem] ml-auto flex justify-end font-medium text-lg mt-2 mb-2">
                            <span className="w-[65%] text-right">
                              Got Money from Customer ৳:
                            </span>
                            <span className="w-[35%] flex items-center justify-end">
                              <input
                                onChange={handleGotMoney}
                                value={gotMoney}
                                type="number"
                                className="h-[30px] w-[100px] border-2 border-red-300 rounded px-2"
                              />
                            </span>
                          </div>
                          <div className="max-w-xs ml-auto flex items-center my-2 text-lg font-semibold text-black">
                            <span className="w-[50%] text-right">
                              Total Bill:
                            </span>
                            <span className="w-[50%] text-right">
                              <CurrencyFormatter value={totalPrice} />
                            </span>
                          </div>

                          {availableDiscount ? (
                            <div className="flex justify-end space-x-4">
                              <button>{memberShipDiscount}%</button>
                              <button
                                onClick={handleApply}
                                className="bg-gray-200 px-2 hover:bg-gray-800 hover:text-white"
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
                            <>
                              <div className="max-w-xs ml-auto flex items-center mt-1 text-base text-purple-600">
                                <span className="w-[50%] text-right">
                                  No Discount Amount:
                                </span>
                                <span className="w-[50%] text-right">
                                  <CurrencyFormatter
                                    value={totalPriceWithOutDiscount}
                                  />
                                </span>
                              </div>
                              <div className="max-w-xs ml-auto flex items-center mt-1 text-base text-blue-600">
                                <span className="w-[50%] text-right">
                                  Total Discount:
                                </span>
                                <span className="w-[50%] text-right">
                                  <CurrencyFormatter
                                    value={
                                      totalPrice - (totalPrice - totalDiscount)
                                    }
                                  />
                                </span>
                              </div>
                              <div className="max-w-xs ml-auto flex items-center mt-1 text-lg font-extrabold">
                                <span className="w-[50%] text-right">
                                  After Discount:
                                </span>
                                <span className="w-[50%] text-right">
                                  <CurrencyFormatter
                                    value={totalPrice - totalDiscount}
                                  />
                                </span>
                              </div>
                            </>
                          ) : null}

                          <div
                            className={`max-w-xs ml-auto flex items-center justify-end text-lg font-bold ${
                              backMoney < 0
                                ? "text-red-600 border-t-2 border-red-600"
                                : "border-t-2 border-green-600 text-green-600"
                            } `}
                          >
                            <span className="w-[50%] text-right">
                              Customer will get:
                            </span>
                            <span className="w-[50%] text-right">
                              <CurrencyFormatter value={backMoney} />
                            </span>
                          </div>
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
                        onMouseEnter={handleReload}
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
                        disabled={backMoney < 0 || sellLoading}
                        onClick={() => handleSell(tableWiseCart, name)}
                        className={`h-[40px] w-[130px] bg-red-600 rounded-md text-white ${
                          backMoney < 0 ? "cursor-not-allowed" : ""
                        }`}
                      >
                        {sellLoading ? (
                          <div className="flex justify-center items-center">
                            Please Wait..
                            <RiLoader2Line className="h-6 w-6 animate-spin text-white" />
                          </div>
                        ) : (
                          "Payment Done"
                        )}
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
                        {filteredTableWiseCart
                          ?.sort((a, b) =>
                            a.item_name.localeCompare(b.item_name)
                          )
                          .map((item, index) => (
                            <div
                              key={item._id}
                              className="min-h-[30px] w-full border-b border-gray-500 flex items-center cursor-pointer justify-between text-[10px]"
                            >
                              <div
                                onClick={() => handleCross(item)}
                                className="flex items-center min-w-[65%]"
                              >
                                <p className="">{index + 1}.</p>
                                <p className="wrapped-text capitalize">
                                  <HyphenToSpaceConverter
                                    inputString={item.item_name}
                                  />
                                </p>
                              </div>
                              <div className="flex items-center min-w-[35%]">
                                <div className="ml-auto flex min-w-[40%]">
                                  <button
                                    onClick={() => handleKitchenDecrease(item)}
                                    className="px-1 bg-gray-200"
                                  >
                                    -
                                  </button>
                                  <button className=" text-black px-1">
                                    {item?.item_quantity}
                                  </button>
                                  <button
                                    onClick={() => handleKitchenIncrease(item)}
                                    className="px-1 bg-gray-200"
                                  >
                                    +
                                  </button>
                                </div>
                                <div className="text-black min-w-[60%] flex justify-end">
                                  <CurrencyFormatter
                                    value={
                                      item?.item_price_per_unit *
                                      item?.item_quantity
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
                            <CurrencyFormatter value={kitchenTotalPrice} />
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
