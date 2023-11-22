import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const ItemsContext = createContext();

// eslint-disable-next-line react/prop-types
const ItemsProvider = ({ children }) => {
  const [productsKey, setProductsKey] = useState(0);
  const [drinksAndJuices, setDrinkAndJuices] = useState([]);
  const [fastFood, setFastFood] = useState([]);
  const [vegetablesAndRices, setVegetablesAndRices] = useState([]);
  const [tables, setTables] = useState([]);

  // ... other functions ...

  // Function to refetch products data
  const refetchItems = () => {
    setProductsKey((prevKey) => prevKey + 1);
  };

  const getDrinksAndJuicesItems = async (url) => {
    axios
      .get(url)
      .then((res) => {
        setDrinkAndJuices(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getFastFoodItems = async (url) => {
    try {
      const res = await axios.get(url);
      setFastFood(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getVegetablesAndRicesItems = async (url) => {
    try {
      const res = await axios.get(url);
      setVegetablesAndRices(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getTables = async (url) => {
    try {
      const res = await axios.get(url);
      setTables(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  //all products
  useEffect(() => {
    getDrinksAndJuicesItems(
      `${import.meta.env.VITE_API_URL}/api/get-drinks-juices`
    );
    getFastFoodItems(`${import.meta.env.VITE_API_URL}/api/get-fast-food`);
    getVegetablesAndRicesItems(
      `${import.meta.env.VITE_API_URL}/api/get-vegetables-rices`
    );
    getTables(`${import.meta.env.VITE_API_URL}/api/tables`);
  }, [productsKey]);

  return (
    <ItemsContext.Provider
      value={{
        refetchItems,
        drinksAndJuices,
        fastFood,
        vegetablesAndRices,
        tables,
      }}
    >
      {children}
    </ItemsContext.Provider>
  );
};

const useItemsContext = () => {
  return useContext(ItemsContext);
};

export { ItemsProvider, ItemsContext, useItemsContext };
