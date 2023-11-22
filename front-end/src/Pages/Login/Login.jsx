import { useContext } from "react";
import { AuthContext } from "../../GlobalContext/AuthProvider";
import { useNavigate } from "react-router-dom";
import useCurrentDateTime from "../../Hooks/Time/Time";
import toast from "react-hot-toast";
import { TbLoader } from "react-icons/tb";

const Login = () => {
  const { signInWithEmail, setLoading, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const { currentDateTime, greeting } = useCurrentDateTime();

  const handleLogin = async (e) => {
    // setLoading(true);
    e.preventDefault();
    const email = e.target.email.value + "@foodrepublic.com";
    const password = e.target.password.value;

    try {
      const userCredential = await signInWithEmail(email, password);
      const user = userCredential.user;
      if (user) {
        setLoading(false);

        navigate("/");
      }
    } catch (error) {
      const errorMessage = error.message;
      if (errorMessage) {
        toast.error("Wrong! Contact with authority");
      }
      setLoading(false);
    }
  };
  return (
    <div>
      <div className="max-w-md mx-auto shadow-2xl min-h-screen flex flex-col justify-center px-4">
        <div>
          <h1 className="text-center font-bold text-2xl">{greeting}</h1>
          <p className="text-center">{currentDateTime}</p>
          <h1 className="text-3xl text-center font-bold my-6 text-purple-800">
            Food Republic
          </h1>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label className="font-bold">Username *</label>
            <input
              className="w-[100%] h-[40px] px-2 border-2 border-purple-900 rounded focus:rounded-3xl duration-500"
              type="text"
              name="email"
              placeholder="Enter Username"
              required
            />
          </div>

          <div className="flex flex-col space-y-2 relative">
            <label className="font-bold">Password *</label>
            <input
              className="w-[100%] h-[40px] px-2 border-2 border-purple-900 rounded focus:rounded-3xl duration-500"
              type="password"
              name="password"
              placeholder="Enter Password"
              required
            />
          </div>
          <div>
            <button
              className="bg-purple-900 text-white w-full h-[40px] font-bold rounded hover:rounded-3xl duration-500"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <TbLoader className="animate-spin w-6 h-6 mx-auto" />
              ) : (
                "Login"
              )}
            </button>
          </div>
          <div>
            <p className="text-center">No Chance to Create Account</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
