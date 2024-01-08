/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";

const LiveTimeCounter = ({ startTime }) => {
  const [elapsedTime, setElapsedTime] = useState("");

  useEffect(() => {
    const updateElapsedTime = () => {
      const currentTime = new Date();
      const startTimeDate = new Date(startTime);
      const timeDifference = currentTime - startTimeDate;
      const seconds = Math.floor(timeDifference / 1000);

      const hours = Math.floor(seconds / 3600);
      const remainingMinutes = Math.floor((seconds % 3600) / 60);
      const remainingSeconds = seconds % 60;

      let formattedTime = "";

      if (hours > 0) {
        formattedTime += `${hours} ${hours === 1 ? "hour" : "hours"}`;
        if (remainingMinutes > 0 || remainingSeconds > 0) {
          formattedTime += " - ";
        }
      }

      if (remainingMinutes > 0) {
        formattedTime += `${remainingMinutes} ${
          remainingMinutes === 1 ? "minute" : "minutes"
        }`;
        if (remainingSeconds > 0) {
          formattedTime += " - ";
        }
      }

      if (remainingSeconds > 0 || formattedTime === "") {
        formattedTime += `${remainingSeconds} ${
          remainingSeconds === 1 ? "second" : "seconds"
        }`;
      }

      setElapsedTime(formattedTime.trim());
    };

    updateElapsedTime();

    // Update the time every second
    const intervalId = setInterval(updateElapsedTime, 1000);

    return () => clearInterval(intervalId);
  }, [startTime]);

  return <span>{elapsedTime}</span>;
};

export default LiveTimeCounter;
