import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import React, { useEffect, useState } from 'react';

const RadioBtn = ({ label, defaultVal, handleChange, required, name }) => {

    const [val, setval] = useState('');

    useEffect(() => {
        if (defaultVal) {
            setval(defaultVal)
        }else{
            setval('Client')
        }
    }, [defaultVal])
    
    return (
        <FormControl required={required}>
            <FormLabel id="demo-radio-buttons-group-label">{label}</FormLabel>
            <RadioGroup
                value={val}
                onChange={(e)=>{handleChange(e);setval(e.target.value)}}
            >                
                <FormControlLabel name={name} value={'Client'} control={<Radio />} label={'Client'} />
                <FormControlLabel name={name} value={'Partner'} control={<Radio />} label={"Partner"} />
            </RadioGroup>
        </FormControl>
    )
}

export default RadioBtn