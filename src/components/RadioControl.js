import React, { useState } from "react";
import { Box, RadioButton } from "grommet";
import styled from "styled-components";

const StyledBox = styled(Box)`
  z-index: 1000;
  margin: 10px auto auto 10px;
`;

const RadioControl = ({ currentRoute, availableRoutes, updateBusRoute }) => {
  const [selected, setSelected] = useState(currentRoute);

  return (
    <Box align="start">
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
    </Box>
  );
};

export default RadioControl;
