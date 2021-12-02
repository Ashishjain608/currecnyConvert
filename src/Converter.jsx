import React, { useState, useEffect } from "react";
import "./Converter.css";
import { Select, InputLabel, MenuItem, Input, Button } from "@mui/material";
import axios from "axios";

const Converter = () => {
  const [allCurrency, setAllCurrency] = useState([]);
  const [sourceCurrency, setSourceCurrency] = useState("USD");
  const [sourceValue, setSourceValue] = useState(1);

  const [destCurrency, setDestCurrency] = useState("INR");
  const [destValue, setDestValue] = useState();

  const [currentExchangeRate, setCurrentExchangeRate] = useState();
  const [currentSourceExchanges, setCurrentSourceExchanges] = useState();

  const [inputSourceError, setInputSourceError] = useState(false);

  useEffect(() => {
    axios.get("https://open.er-api.com/v6/latest/USD").then((res) => {
      console.log(res);
      setAllCurrency(Object.keys(res.data.rates));

      //setting default INR value
      setDestValue(res.data.rates["INR"]);
      setCurrentExchangeRate(res.data.rates["INR"]);
      setCurrentSourceExchanges(res.data.rates);
    });
  }, []);

  const fetchAllRates = (curr, tempDestinationCurr) => {
    axios.get(`https://open.er-api.com/v6/latest/${curr}`).then((res) => {
      const allRates = res.data.rates;
      setCurrentExchangeRate(allRates[tempDestinationCurr || destCurrency]);
      setDestValue(allRates[tempDestinationCurr || destCurrency] * sourceValue);
      setCurrentSourceExchanges(res.data.rates);
    });
  };

  const handleSourceCurrChange = (event) => {
    setSourceCurrency(event.target.value);

    fetchAllRates(event.target.value);
  };

  const onInputSourceChange = (event) => {
    if (event.target.value > 10000) {
      setInputSourceError(true);
      return;
    } else {
      setInputSourceError(false);
    }
    setSourceValue(event.target.value);
    setDestValue(currentExchangeRate * event.target.value);
  };

  const handleDestCurrChange = (e) => {
    setDestCurrency(e.target.value);
    setCurrentExchangeRate(currentSourceExchanges[e.target.value]);
    setDestValue(currentSourceExchanges[e.target.value] * sourceValue);
  };

  const flipConvert = () => {
    let tempDestCurrency = destCurrency;
    let tempSourceCurrency = sourceCurrency;
    setDestCurrency(sourceCurrency);
    setSourceCurrency(tempDestCurrency);

    setCurrentExchangeRate(1 / currentExchangeRate);

    fetchAllRates(tempDestCurrency, tempSourceCurrency);

    // setDestValue(sourceValue * setSourceValue);
  };

  const reset = () => {
    window.location.reload();
  };

  return (
    <>
      <div className="converter">
        <span className="source">
          <InputLabel id="demo-simple-select-label">Source Currency</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={sourceCurrency}
            label="Source Currency"
            onChange={handleSourceCurrChange}
          >
            {allCurrency.map((cur) => (
              <MenuItem value={cur}>{cur}</MenuItem>
            ))}
          </Select>
          <InputLabel id="source-value-label">Source Value</InputLabel>
          <div>
            <Input
              labelId="source-value-label"
              type="number"
              error={inputSourceError}
              placeholder="Enter Source Currency Value here"
              helperText="Value cannot be more than 10000"
              value={sourceValue}
              onChange={onInputSourceChange}
            ></Input>
            {inputSourceError && (
              <div>Source Value cannot be more than 10000 </div>
            )}
          </div>
        </span>
        <span>
          <Button variant="contained" onClick={flipConvert}>
            Flip Currency
          </Button>
        </span>

        <span className="destination">
          <InputLabel id="destination-select-label">
            Destination Currency
          </InputLabel>
          <Select
            labelId="destination-select-label"
            id="demo-destination-select"
            value={destCurrency}
            label="Destination Currency"
            onChange={handleDestCurrChange}
          >
            {allCurrency.map((cur) => (
              <MenuItem value={cur}>{cur}</MenuItem>
            ))}
          </Select>
          <InputLabel id="dest-value-label">Destination Value</InputLabel>
          <Input
            labelId="dest-value-label"
            type="number"
            disabled={true}
            value={destValue}
          ></Input>
        </span>
      </div>
      <div>
        <Button variant="contained" onClick={reset}>
          Reset
        </Button>
      </div>
    </>
  );
};

export default Converter;
