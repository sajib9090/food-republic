import { useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { RiLoader2Line } from "react-icons/ri";
import axios from "axios";
import toast from "react-hot-toast";
import { MdDelete } from "react-icons/md";
import ReactToPrint from "react-to-print";
import { AuthContext } from "../../../../GlobalContext/AuthProvider";
import CurrencyFormatter from "../../../../components/CurrencyFormatter/CurrencyFormatter";

const AddDailyExpenses = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [dataByDate, setDataByDate] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const currentDate = new Date().toISOString().split("T")[0];
  let [deleteLoading, setDeleteLoading] = useState(false);
  const componentRef = useRef();
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/get-expenses?date=${currentDate}`
      );
      setDataByDate(response.data.expenses);

      // Calculate the total expense
      const total = response.data.expenses.reduce(
        (accumulator, expense) => accumulator + expense.expense_price,
        0
      );
      setTotalExpense(total);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = (data) => {
    if (data.price > 0) {
      if (user?.email) {
        setLoading(true);
        const expenseData = {
          title: data.name,
          expense_price: parseFloat(data.price),
          creator: user?.email,
        };
        axios
          .post(`${import.meta.env.VITE_API_URL}/api/post-expense`, expenseData)
          .then((res) => {
            if (res) {
              toast.success("Success");
              setLoading(false);
              fetchData();
              reset();
            }
          })
          .catch((err) => {
            if (err) {
              toast.error("Something wrong! try again");
              setLoading(false);
            }
          });
      }
    }
  };

  //maintain delete
  const handleDelete = (item) => {
    if (item._id) {
      setDeleteLoading(true);
      axios
        .delete(
          `${import.meta.env.VITE_API_URL}/api/delete-expense?id=${item._id}`
        )
        .then((res) => {
          if (res) {
            toast.success("Deleted");
            fetchData();
            setDeleteLoading(false);
          }
        })
        .catch((err) => {
          if (err) {
            toast.error("Something wrong!");
            setDeleteLoading(false);
          }
        });
    }
  };
  return (
    <div>
      <div className="max-w-[310px] mx-auto mt-4">
        <div ref={componentRef} className="max-w-[310px] mx-auto">
          <p className="text-center text-lg my-2 font-semibold">
            {currentDate}
          </p>
          {dataByDate &&
            dataByDate?.map((item, index) => (
              <div
                key={item?._id}
                className="min-h-[35px] w-full flex items-center justify-between px-2 border-b border-gray-400"
              >
                <div className="flex items-center">
                  <p>{index + 1}.</p>
                  <p className="capitalize ml-2 wrapped-text">{item?.title}</p>
                </div>
                <div className="flex items-center">
                  <div>
                    <CurrencyFormatter value={item.expense_price} />
                  </div>

                  <button disabled={deleteLoading} className="ml-2">
                    <MdDelete
                      onClick={() => handleDelete(item)}
                      title="remove"
                      className="text-red-600 cursor-pointer w-6 h-6"
                    />
                  </button>
                </div>
              </div>
            ))}
          <div className="flex justify-end font-semibold text-lg mt-2">
            Total Expense:{" "}
            <span className="ml-8">
              <CurrencyFormatter value={totalExpense} />
            </span>
          </div>
        </div>
        <>
          {dataByDate?.length > 0 ? (
            <div>
              <ReactToPrint
                trigger={() => (
                  <button className=" px-4 py-1 bg-purple-600 text-white rounded hover:bg-opacity-80">
                    Print
                  </button>
                )}
                content={() => componentRef.current}
              />
            </div>
          ) : null}
        </>
      </div>
      <div className="max-w-xs mx-auto mt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          <div>
            <label>Item Name with details*</label>
            <input
              className="h-[40px] w-full border-2 border-purple-900 rounded-md px-2"
              type="text"
              placeholder="Alu 1 kg"
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
              min="0"
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
      </div>
    </div>
  );
};

export default AddDailyExpenses;
