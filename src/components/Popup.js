import React from "react";
import styled from "styled-components";

const ItemStyle = styled.span`
  text-decoration: underline;
`;

const Popup = ({ feature }) => {
  const {
    vehicle_no,
    destination,
    direction,
    record_time,
    route_no,
  } = feature.properties;

  const hrefNextBus = `https://new.translink.ca/next-bus/results/#/text/route/${route_no}/direction/${direction.toLowerCase()}`;

  return (
    <div id={`popup-${vehicle_no}`}>
      <h3>Vehicle Number-{vehicle_no}</h3>
      <div>
        <ItemStyle>Bus No:</ItemStyle> <strong>{route_no}</strong>
      </div>
      <div>
        <ItemStyle>Destination:</ItemStyle> {destination}
      </div>
      <div>
        <ItemStyle>Direction:</ItemStyle> {direction}
      </div>
      <div>
        <ItemStyle>Record Time:</ItemStyle> {record_time}
      </div>
      <div>
        <a target="_" href={hrefNextBus}>
          <span>Click to track next {route_no} bus</span>{" "}
        </a>
      </div>
    </div>
  );
};

export default Popup;
