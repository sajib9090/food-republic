import { RotatingLines } from "react-loader-spinner";

const PrimaryLoader = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <RotatingLines
        strokeColor="navy"
        strokeWidth="5"
        animationDuration="0.75"
        width="96"
        visible={true}
      />
    </div>
  );
};

export default PrimaryLoader;
