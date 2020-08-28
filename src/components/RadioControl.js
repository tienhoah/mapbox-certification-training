import React, { useState } from "react";
import { Box, RadioButton } from "grommet";
import styled from "styled-components";

const StyledBox = styled(Box)`
  z-index: 1000;
  margin: 10px;
`;

const ButtonWrapper = styled(Box)`
  position: absolute;
  z-index: 1000;
  border: 1px solid;
  border-radius: 5px;
  background: #BFD5DF;
  align-items: center;
  flex-direction: row;
  bottom: 17px;
  right: 10px;
`;

const RadioControl = ({ currentRoute, availableRoutes, updateBusRoute }) => {
  const [selected, setSelected] = useState(currentRoute);

  return (
    <ButtonWrapper>
      {availableRoutes.map((label) => (
        <StyledBox key={label} margin={{ vertical: "small" }}>
          <RadioButton
            name="prop"
            checked={selected === label}
            label={`Bus ${label}`}
            onChange={(e) => {
              setSelected(label);
              updateBusRoute(label);
            }}
          />
        </StyledBox>
      ))}
    </ButtonWrapper>
  );
};

export default RadioControl;
