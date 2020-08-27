import React from "react";

const Popup = ({ feature }) => {
  const { vehicle_no, record_time } = feature.properties;

  return (
    <div id={`popup-${vehicle_no}`}>
      <h3>{record_time}</h3>
    </div>
  );
};

export default Popup;
