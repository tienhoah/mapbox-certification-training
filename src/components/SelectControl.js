/* eslint-disable no-use-before-define */
import React, { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  option: {
    fontSize: 15,
    "& > span": {
      marginRight: 10,
      fontSize: 18,
    },
  },
  autoCompleteStyle: {
    backGround: "red",
    position: "absolute",
    zIndex: 1000,
    background: "#bfd5df",
    top: 20,
    right: 20,
  },
});

const SelectControl = ({ currentRoute, allRoutes, updateBusRoute }) => {
  const classes = useStyles();
  const [value, setValue] = useState(currentRoute);
  const [options, setOptions] = useState(allRoutes);

  useEffect(() => {
    if (allRoutes.length > 0) setOptions(allRoutes);
  }, [allRoutes]);

  return (
    <div className={classes.autoCompleteStyle}>
      <Autocomplete
        id="bus-select"
        style={{ width: 300 }}
        options={options}
        value={value}
        classes={{
          option: classes.option,
        }}
        autoHighlight
        onChange={(event, val) => {
          if (val === null) updateBusRoute("");
          else updateBusRoute(val.label);
          setValue(val);
        }}
        getOptionLabel={(option) => (option === "" ? "" : option.label)}
        renderOption={(option) => {
          return <span>{option.label}</span>;
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Active bus"
            variant="outlined"
            inputProps={{
              ...params.inputProps,
              autoComplete: "new-password", // disable autocomplete and autofill
            }}
          />
        )}
      />
    </div>
  );
};

export default SelectControl;
