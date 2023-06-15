import React from 'react';
import { Box, Button, CircularProgress } from '@mui/material';

const CustomBtn = ({ onClick, variant, type, icon, title, disabled, btnStyle, loading, btnTitleStyle }) => {
    return (
        <>
            {loading ?
                <CircularProgress />
                :
                <Button type={type} disabled={disabled} onClick={onClick} variant={variant} sx={[{ borderRadius: 20, paddingX: "20px", paddingY: "10px" }, btnStyle]} className="icon-btn">{icon}<Box component={'span'} sx={btnTitleStyle}>{title}</Box></Button>
            }
        </>
    )
}

export default CustomBtn;