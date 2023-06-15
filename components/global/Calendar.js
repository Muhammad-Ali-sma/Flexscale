import React, { useEffect, useState } from 'react';
import 'react-responsive-datepicker/dist/index.css';
import { FormHelperText, TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const Calendar = ({ label, setValue, name, defaultVal, isSubmitted, required, minDate, variant }) => {

  const [inputVal, setInputVal] = useState(null);
  const [error, setError] = useState(false);


  useEffect(() => {
    if (isSubmitted && required && !inputVal) {
      setInputVal('');
      setError(true);
    } else {
      // setInputVal();
      setError(false);
    }
  }, [isSubmitted, inputVal])

  useEffect(() => {
    if (defaultVal) {
      setInputVal(defaultVal);
    }
  }, [defaultVal])

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DesktopDatePicker
        label={label}
        inputFormat="MM-DD-YYYY"
        value={inputVal}
        onChange={(e) => {
          let item = {
            target: {
              name,
              value: e?.format('MM-DD-YYYY')
            }
          }
          setValue(item);
          setInputVal(e);
        }}
        renderInput={(params) => <TextField variant={variant ?? 'standard'} {...params} style={{ width: "100%" }} />}
        minDate={minDate}
      />
      {error && <FormHelperText sx={{ color: 'red' }}>Please enter {label}</FormHelperText>}
    </LocalizationProvider>
  )
}

export default Calendar