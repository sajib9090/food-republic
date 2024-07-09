import { useContext, useEffect, useState } from "react";
import axios from "axios";
import CurrencyFormatter from "../../components/CurrencyFormatter/CurrencyFormatter";
import { AuthContext } from "../../GlobalContext/AuthProvider";
import Loader from "../../components/Loader/Loader";

const Payment = () => {
  const [subscription, setSubscription] = useState({});
  const { user } = useContext(AuthContext);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentInfoLoading, setPaymentInfoLoading] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    const day = e.target.day.value;
    const due = e.target.due_amount.value;

    const data = {
      day: day,
      total_due: due,
    };

    axios
      .patch(`${import.meta.env.VITE_API_URL}/api/update-subscription`, data)
      .then((res) => {
        console.log(res?.data);
        fetchSubscription();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setUpdateLoading(false);
      });
  };

  const handleSubmitForUpdate = (e) => {
    e.preventDefault();
    setPaymentInfoLoading(true);
    const method = e.target.method.value;
    const amount = e.target.amount.value;
    const account = e.target.account.value;

    const data = {
      method: method,
      amount: amount,
      account: account,
    };

    axios
      .patch(
        `${import.meta.env.VITE_API_URL}/api/update-subscription-payment-info`,
        data
      )
      .then((res) => {
        console.log(res?.data);
        fetchSubscription();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setPaymentInfoLoading(false);
      });
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-120px)] flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className=" p-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-xl border border-indigo-400 min-h-screen">
      <h2 className="text-4xl font-extrabold text-white mb-8 text-center drop-shadow-lg">
        Subscription Details
      </h2>
      <div className="mb-6">
        <span className="font-semibold text-lg text-white">Validity: </span>
        <span className="text-lg text-indigo-100">
          {new Date(subscription?.expiresAt).toLocaleDateString()}
        </span>
      </div>
      <div className="mb-6 flex items-center space-x-4">
        <span className="font-semibold text-lg text-white">Total Due: </span>
        <span className="text-lg text-indigo-100 flex items-center">
          <CurrencyFormatter value={subscription?.total_due} />{" "}
          <span className="ml-4">(Exclude current month)</span>
        </span>
      </div>
      <div className="mb-6 flex items-center space-x-4">
        <span className="font-semibold text-lg text-white">Monthly Bill: </span>
        <span className="text-lg text-indigo-100">
          <CurrencyFormatter value={subscription?.monthly_bill} />
        </span>
      </div>
      <div className="mb-6 flex items-center space-x-4">
        <span className="font-semibold text-lg text-white">
          Reference Code:{" "}
        </span>
        <span className="text-lg text-indigo-100">food-republic</span>
      </div>
      <div>
        <h3 className="text-3xl font-semibold text-white mb-4 drop-shadow-lg">
          Payment Methods:
        </h3>
        <ul className="list-disc list-inside bg-white bg-opacity-80 p-6 rounded-lg shadow-md backdrop-filter backdrop-blur-lg">
          {subscription?.payment_method?.map((method, index) => (
            <li key={index} className="mb-2">
              <span className="font-semibold text-indigo-900 capitalize">
                {method?.method}:{" "}
              </span>
              <span className="text-gray-800">
                {method?.account} (Personal)
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-6 bg-gray-100 rounded-lg shadow-md mt-6">
        <h1 className="text-2xl font-bold mb-4">Previous Payment Info</h1>
        <p className="mb-6 capitalize">
          Service starts at: {subscription?.service_start}
        </p>

        {subscription?.payment_info?.length > 0 ? (
          <div className="grid grid-cols-5 gap-6">
            {subscription.payment_info.map((info, index) => (
              <div
                key={index}
                className="p-4 bg-white rounded-lg shadow-md border border-gray-200"
              >
                <p className="text-lg font-semibold capitalize">
                  Method: {info?.type}
                </p>
                <p className="text-lg">Amount: {info?.amount} TK</p>
                <p className="text-lg">Account: {info?.account_no}</p>
                <span className="text-sm text-gray-500">
                  Date: {new Date(info?.createdAt).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p>No payment information available.</p>
        )}
      </div>

      {user?.email == "rayan@foodrepublic.com" && (
        <>
          <div>
            <form onSubmit={handleSubmit} className="flex flex-col mt-6">
              <label className="text-lg">Increase subscription day</label>
              <input
                type="text"
                name="day"
                placeholder="Day in number"
                className="px-4 py-2"
              />
              <label className="text-lg">Total due</label>
              <input
                type="number"
                name="due_amount"
                placeholder="amount"
                className="px-4 py-2"
              />
              <button
                disabled={updateLoading}
                className="bg-gray-400 py-2 mt-4"
              >
                {updateLoading ? "Loading..." : "Submit"}
              </button>
            </form>
          </div>
          <div>
            <form
              onSubmit={handleSubmitForUpdate}
              className="flex flex-col mt-6"
            >
              <label className="text-lg">Method</label>
              <input
                type="text"
                name="method"
                placeholder="Method"
                className="px-4 py-2"
              />
              <label className="text-lg">Amount</label>
              <input
                type="number"
                name="amount"
                placeholder="amount"
                className="px-4 py-2"
              />
              <label className="text-lg">Account</label>
              <input
                type="text"
                name="account"
                placeholder="account"
                className="px-4 py-2"
              />
              <button
                disabled={paymentInfoLoading}
                className="bg-gray-400 py-2 mt-4"
              >
                {paymentInfoLoading ? "Loading..." : "Submit"}
              </button>
            </form>
          </div>{" "}
        </>
      )}
    </div>
  );
};

export default Payment;
