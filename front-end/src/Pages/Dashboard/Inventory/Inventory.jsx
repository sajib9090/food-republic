import CurrencyFormatter from "../../../components/CurrencyFormatter/CurrencyFormatter";
import DateFormatter from "../../../components/DateFormatter/DateFormatter";
import HyphenToSpaceConverter from "../../../components/HyphenToSpaceConverter/HyphenToSpaceConverter";

const Inventory = () => {
  return (
    <div>
      <div className="max-w-[310px] min-h-[300px] shadow-md mx-auto rounded-md">
        <div className="text-center mt-2 border-b border-gray-500">
          <h1 className="text-2xl font-bold">Food Republic</h1>
          <address className="text-xs mt-1">
            Majhi Plaza 2nd floor, Naria, Shariatpur
          </address>
          <p className="text-[10px] text-gray-600 mt-2">
            Invoice: <span className="ml-1">655d7b788597d0d3b0fd19f2</span>
          </p>
          <p className="text-xs mb-1">
            <DateFormatter dateString={new Date()} />
          </p>
        </div>
        <div className="mt-2 px-1">
          <div className="min-h-[50px] w-full border-b border-gray-300 flex items-center justify-between text-xs">
            <div className="flex items-center">
              <p className="mr-1">1.</p>
              <p className="wrapped-text3">
                <HyphenToSpaceConverter
                  inputString={"Namefffffffffffffffffffffffffffffffffff"}
                />
              </p>
            </div>
            <div className="flex items-center">
              <p className="mr-1">(1220 * 7)</p>
              <p>-</p>
              <div className="ml-1">
                <CurrencyFormatter value={12000} />
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end text-base font-semibold mt-2">
          <p>Grand Total:</p>
          <div className="mr-2 ml-4">
            <CurrencyFormatter value={12000} />
          </div>
        </div>
      </div>
      <div className="max-w-[310px] mx-auto text-right mt-2">
        <button className="px-6 py-2 bg-black rounded-md text-white hover:bg-opacity-80 duration-500 transition-all">
          Print
        </button>
      </div>
    </div>
  );
};

export default Inventory;
