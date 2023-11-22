/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";

const Typewriter = ({ text, delay, infinite }) => {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let timeout;

    if (currentIndex <= text.length) {
      timeout = setTimeout(() => {
        setCurrentText((prevText) => prevText + text[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, delay);
    } else if (infinite) {
      // ADD THIS CHECK
      setCurrentIndex(0);
      setCurrentText("");
    }

    return () => clearTimeout(timeout);
  }, [currentIndex, delay, infinite, text]);

  return <span className="text-[#B01400]">{currentText}</span>;
};

export default Typewriter;
