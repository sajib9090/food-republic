const CartReducer = (state, action) => {
  if (action.type === "ADD_TO_BILL") {
    let { item, tableName, staffName, orderTime } = action.payload;

    // Check if the item already exists in the cart
    const existingCartItemIndex = state.carts.findIndex(
      (cartItem) =>
        cartItem._id === item._id && cartItem.table_name === tableName
    );

    if (existingCartItemIndex !== -1) {
      // If the item already exists, update its quantity
      const updatedCarts = [...state.carts];
      updatedCarts[existingCartItemIndex].item_quantity += 1;

      return {
        ...state,
        carts: updatedCarts,
      };
    } else {
      // If the item doesn't exist, add it to the cart
      let cartItem = {
        _id: item._id,
        item_name: item.item_name,
        item_price_per_unit: item.item_price,
        item_quantity: 1,
        table_name: tableName,
        staffName: staffName,
        orderTime: orderTime,
        discount: item.discount,
      };

      return {
        ...state,
        carts: [...state.carts, cartItem],
      };
    }
  }

  if (action.type === "DECREASE_ITEM_QUANTITY") {
    const { _id, table_name } = action.payload;

    const existingCartItemIndex = state.carts.findIndex(
      (cartItem) => cartItem._id === _id && cartItem.table_name === table_name
    );

    if (existingCartItemIndex !== -1) {
      // If the item exists and quantity is greater than 1, update its quantity
      const updatedCarts = [...state.carts];
      if (updatedCarts[existingCartItemIndex].item_quantity > 1) {
        updatedCarts[existingCartItemIndex].item_quantity -= 1;
      }

      return {
        ...state,
        carts: updatedCarts,
      };
    }
  }

  if (action.type === "INCREASE_ITEM_QUANTITY") {
    const { _id, table_name } = action.payload;

    const existingCartItemIndex = state.carts.findIndex(
      (cartItem) => cartItem._id === _id && cartItem.table_name === table_name
    );

    if (existingCartItemIndex !== -1) {
      // If the item exists with the matching table_name, update its quantity
      const updatedCarts = [...state.carts];
      updatedCarts[existingCartItemIndex].item_quantity += 1;

      return {
        ...state,
        carts: updatedCarts,
      };
    }
  }

  //
  if (action.type === "REMOVE_SINGLE_ITEM") {
    const { table_name, _id } = action.payload;

    let updatedCart = state?.carts
      ?.map((cart) => {
        if (cart?.table_name === table_name && cart?._id === _id) {
          // Skip the item with the matching table_name and _id
          return null;
        } else {
          return cart;
        }
      })
      .filter(Boolean);

    return {
      ...state,
      carts: updatedCart,
    };
  }

  if (action.type === "REMOVE_CART") {
    const { tableCode } = action.payload;

    // Remove items that match the tableCode
    const updatedCart = state?.carts?.filter(
      (cartItem) => cartItem.table_name !== tableCode
    );

    return {
      ...state,
      carts: updatedCart,
    };
  }

  return state;
};

export default CartReducer;
