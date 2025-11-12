import React from "react";

const Loader = ({ size = 20, color = "#7C42F0" , border = 3 }) => {
  return (
    <div
      className="animate-spin rounded-full"
      style={{
        width: size,
        height: size,
        border: `${border}px solid ${color}`,
        borderTopColor: "transparent",
      }}
    ></div>
  );
};

export default Loader;
