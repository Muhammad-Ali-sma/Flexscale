import { Backdrop, CircularProgress } from '@mui/material';
import React from 'react';

const Loader = ({ show, handleClose }) => {
    return (
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={show}
            onClick={handleClose}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    )
}

export default Loader