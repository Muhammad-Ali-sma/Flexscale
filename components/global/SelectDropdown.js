import { Autocomplete, Chip, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import moment from 'moment';

const SelectDropdown = ({ name, setValue, label, data, showAll = true, disableChip, disableDefault, hideDefault, value, helperText, searchable, getItem, required, showId, isSubmitted, getId = false, defaultVal = "", variant, multiple, getContract, getPaymentMethod, getAccessMethods = false, className }) => {

    const [msg, setMsg] = useState('');
    const [org, setOrg] = useState([]);
    const [error, setError] = useState(false);
    const [selectVal, setSelectVal] = useState('');
    const [prevOrgIds, setPrevOrgIds] = useState([]);

    useEffect(() => {
        if (required && isSubmitted) {
            if (multiple) {
                if (org?.length === 0) {
                    setMsg(`Please enter ${label}!`);
                    setError(true);
                } else {
                    setError(false);
                    setMsg('');
                }
            } else {
                if (selectVal) {
                    setMsg('');
                    setError(false);
                } else {
                    setMsg(`Please enter ${label}!`);
                    setError(true);
                }
            }
        } else {
            setError(false);
            setMsg('');
        }
    }, [isSubmitted, org, selectVal])

    useEffect(() => {
        if (defaultVal) {
            setSelectVal(defaultVal)
        }
    }, [defaultVal])

    useEffect(() => {
        if (defaultVal) {
            if (multiple) {
                if (name?.toLowerCase() === 'organization' || name?.toLowerCase() === 'manager') {
                    setPrevOrgIds([...defaultVal?.map(x => x?._id)])
                }
                setOrg(defaultVal?.map(x => x?.Name))
            }
        }
    }, [])

    return (
        <FormControl fullWidth error={error} variant={variant}>
            {multiple ?
                <Autocomplete
                    multiple
                    disableClearable={disableChip}
                    options={data?.filter(x => !prevOrgIds.includes(x?._id)) ?? []}
                    getOptionLabel={(option) => option?.Name ? option?.Name : (option?.FirstName ? option?.FirstName + " " + option?.LastName + "   " + (showId ? option?._id : "") : option?.User?.FirstName + " " + option?.User?.LastName + " - " + moment(option?.TimePeriodStart)?.format('MMM DD ') + "-" + moment(option?.TimePeriodEnd)?.format('DD, YYYY') + " - " + option?.User?._id)}
                    onChange={(e, val) => {
                        let item = {
                            target: {
                                value: val,
                                name
                            },
                        }
                        setValue(item)
                        setOrg(val)
                        if (name?.toLowerCase() === 'organization' || name?.toLowerCase() === 'manager') {
                            setPrevOrgIds([...val?.map(x => x?._id)])
                        }
                    }}
                    renderTags={(tagValue, getTagProps) =>
                        tagValue.map((option, index) => (
                            <Chip
                                label={option?.Name ? option?.Name : (option?.FirstName ? option?.FirstName + " " + option?.LastName : option?.User?.FirstName + " - " + option?.User?.LastName + " " + moment(option?.TimePeriodStart)?.format('MMM DD ') + "-" + moment(option?.TimePeriodEnd)?.format('DD, YYYY') + " - " + option?.User?._id)}
                                {...getTagProps({ index })}
                                disabled={disableChip && !disableDefault ? tagValue?.length === 1 : disableDefault && defaultVal.indexOf(option) !== -1}
                            />
                        ))
                    }
                    defaultValue={(defaultVal && !hideDefault) ? defaultVal?.map(item => item) : []}
                    filterSelectedOptions
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label={label}
                            variant={variant ?? "standard"}
                        />
                    )}
                />
                :
                searchable ?
                    <>
                        <Autocomplete
                            options={data}
                            defaultValue={defaultVal}
                            getOptionLabel={(option) => {
                                // Value selected with enter, right from the input
                                if (typeof option === 'string') {
                                    return option;
                                }
                                if (typeof option === 'object') {
                                    if (option?.FirstName) {
                                        return option?.FirstName + " " + option?.LastName + "   " + option?._id;
                                    } else if (option?.Name) {
                                        return option?.Name + " " + option?._id;
                                    } else if (option?.JobTitle) {
                                        return option?.JobTitle + " " + option?._id;
                                    }
                                }
                                // Regular option
                                return option?.title;
                            }}
                            onChange={(e, val) => {
                                let item = {
                                    target: {
                                        value: getItem ? val : (val?.title ? val?.title : val?.Name ? val?._id : val),
                                        name
                                    },
                                }
                                setValue(item)
                                setSelectVal(val?.title ? val?.title : val?.FirstName ? val?.FirstName + " " + val?.LastName : val?.Name ? val?.Name : val)
                            }}
                            filterSelectedOptions
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={label}
                                    variant="standard"
                                    sx={{ borderColor: 'red' }}
                                />
                            )}

                            renderOption={(props, option) => <li {...props} style={{ fontWeight: option?.Bold ? 'bold' : 'normal', marginLeft: option?.Bold === false ? '5px' : 0 }}>{option?.title ? option?.title : option?.FirstName ? option?.FirstName + "   " + option?.LastName + "   " + option?._id : option?.Name ? option?.Name + "   " + option?._id : option?.JobTitle ? option?.JobTitle + "   " + option?._id : option}</li>}
                        />
                    </>
                    :
                    <>
                        <InputLabel className={className}>{label}</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            sx={{ textAlign: 'left', textTransform: 'capitalize' }}                            
                            name={name}
                            value={value ?? selectVal}
                            onChange={(e) => {
                                setValue(e)
                                setSelectVal(e.target.value);
                            }}
                        >
                            {showAll && <MenuItem value={''}>All</MenuItem>}
                            {getId ? data?.map(item => <MenuItem key={`menu_${item._id}`} value={item._id}>{item?.Name ? item.Name : showId ? item?.FirstName + " " + item?.LastName + "    " + `(${item._id})` : item?.FirstName + " " + item?.LastName}</MenuItem>)
                                : getItem ? data?.map(item => <MenuItem key={`menu_${item?._id}`} value={item}>{item?.FirstName + " " + item?.LastName}</MenuItem>)
                                    : getContract ? data?.map(item => <MenuItem key={`menu_${item._id}`} value={item._id}>{item?.JobTitle}</MenuItem>)
                                        : getPaymentMethod ? data?.map(item => <MenuItem key={`menu_${item?.id}`} sx={{ textTransform: 'capitalize' }} value={item.id}>{item?.type == "us_bank_account" ? "ACH Direct Debit" : item?.card?.funding} Card - ***{item?.type == "us_bank_account" ? item?.us_bank_account?.last4 : item?.card?.last4} {item?.type == "us_bank_account" ? item?.us_bank_account?.bank_name : item?.card?.brand + 'card'}</MenuItem>)
                                            : getAccessMethods ? data?.map(item => <MenuItem key={`menu_${item.level}`} value={item.level}>{item?.label}</MenuItem>)
                                                : data?.map(item => <MenuItem key={`menu_${item}`} value={item}>{item?.Name ? item?.Name : item}</MenuItem>)}
                        </Select>
                    </>
            }
            <FormHelperText>{msg ? msg : helperText}</FormHelperText>
        </FormControl>
    )
}

export default SelectDropdown