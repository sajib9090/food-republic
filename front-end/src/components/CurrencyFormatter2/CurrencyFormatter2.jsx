/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";

function CurrencyFormatter({ value }) {
  const [formattedPrice, setFormattedPrice] = useState("");

  useEffect(() => {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
    });

    setFormattedPrice(formatter.format(value).replace("BDT", ""));
  }, [value]);

  return <div>{formattedPrice}</div>;
}

export default CurrencyFormatter;
