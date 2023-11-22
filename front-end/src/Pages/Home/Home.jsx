import Typewriter from "../../components/TypeWriter/TypeWriter";

const Home = () => {
  return (
    <div className="w-full h-full home">
      <div className="w-full h-full bg-[#001529] bg-opacity-75 flex flex-col justify-center items-center text-white">
        <h1 className="font-bold text-5xl text-white">
          Welcome To <Typewriter text="Food Republic" delay={200} infinite />
        </h1>
      </div>
    </div>
  );
};

export default Home;
