import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const ItemsContext = createContext();

// eslint-disable-next-line react/prop-types
const ItemsProvider = ({ children }) => {
  const [productsKey, setProductsKey] = useState(0);
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [tables, setTables] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [menuItemsLoading, setMenuItemsLoading] = useState(false);

  // ... other functions ...
  // Function to refetch products data
  const refetchItems = () => {
    setProductsKey((prevKey) => prevKey + 1);
  };

  const getCategories = async (url) => {
    axios
      .get(url)
      .then((res) => {
        setCategories(res.data.categories);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getMenus = async (url) => {
    setMenuItemsLoading(true);
    axios
      .get(url)
      .then((res) => {
        setMenuItems(res.data.menuItems);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setMenuItemsLoading(false);
      });
  };

  const getTables = async (url) => {
    try {
      const res = await axios.get(url);
      setTables(res?.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getStaff = async (url) => {
    try {
      const res = await axios.get(url);
      setStaffs(res?.data?.staffData);
    } catch (err) {
      console.error(err);
    }
  };

  //all products
  useEffect(() => {
    getMenus(`${import.meta.env.VITE_API_URL}/api/get-menu-items`);
    getCategories(`${import.meta.env.VITE_API_URL}/api/get-categories`);
    getTables(`${import.meta.env.VITE_API_URL}/api/tables`);
    getStaff(`${import.meta.env.VITE_API_URL}/api/get-all-staff`);
  }, [productsKey]);

  return (
    <ItemsContext.Provider
      value={{
        refetchItems,
        categories,
        menuItems,
        tables,
        menuItemsLoading,
        staffs,
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
