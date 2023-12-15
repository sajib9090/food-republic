import { useNavigate } from "react-router-dom";

const Error = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="h-screen w-full flex items-center justify-center flex-col">
        <h1 className="text-7xl text-purple-950 font-bold">
          Oops Something went wrong!
        </h1>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-purple-600 mt-6 font-semibold text-2xl text-white rounded"
        >
          Go Back To Home
        </button>
      </div>
    </div>
  );
};

export default Error;
