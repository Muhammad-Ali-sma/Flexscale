import { TextField } from "@mui/material";
import { useEffect, useState } from "react";

const FlexField = ({ id, label, placeholder = label, setValue = () => { }, variant = "outlined", as = "text", required = false, name, isSubmitted, defaultVal, disabled }) => {
    const [color, setColor] = useState("primary");
    const [helperText, setHelperText] = useState("");
    const [inputVal, setInputVal] = useState("");


    useEffect(() => {
        if (isSubmitted && required) {
            let c = "primary";
            let m = "";
            if (inputVal === "") {
                c = "error";
                m = `Please enter ${(label ? label : placeholder)?.toLowerCase()}`;
            } else {
                c = "primary";
                m = "";
            }
            if (inputVal !== "") {
                switch (as) {
                    case "email":
                        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(inputVal)) {
                            c = "success";
                            m = ``;
                        } else {
                            c = "error";
                            m = `Please enter valid ${(label ? label : placeholder)?.toLowerCase()}`;
                        }
                        break;
                    case "password":
                    case "text":
                    default:
                        c = "primary"
                        m = "";
                        break;
                }
            }
            setColor(c);
            setHelperText(m);
        } else {
            setColor("primary");
            setHelperText("");
        }
    }, [inputVal, isSubmitted])

    useEffect(() => {
        if (defaultVal !== undefined) {
            setInputVal(defaultVal);
        }
    }, [defaultVal])

    return (
        <>
            <TextField
                id={id}
                type={as}
                color={color}
                error={color == "error"}
                disabled={disabled}
                required={required}
                helperText={helperText}
                onChange={(e) => {
                    setValue(e);
                    if (name?.includes('HoursPerDay')) {
                        if (e.target.value <= 8 && e.target.value >= 0) {
                            setInputVal(e.target.value);
                        }
                    } else {
                        setInputVal(e.target.value);
                    }
                }}
                label={label}
                placeholder={placeholder}
                variant={variant}
                fullWidth
                name={name}
                // InputLabelProps={{ shrink: true }}
                margin="dense"
                value={inputVal}
            />
        </>
    );
}
export default FlexField;