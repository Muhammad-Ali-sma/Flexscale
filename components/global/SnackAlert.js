import { Alert, Snackbar } from '@mui/material';
import React from 'react';

const SnackAlert = ({ msg, handleClose, show, type = 'success' }) => {
    let vertical = 'top';
    let horizontal = 'right';

    return (
        <>
            <Snackbar anchorOrigin={{ vertical, horizontal }} open={show} autoHideDuration={3000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={type} sx={{ width: '100%' }}>
                    {msg}
                </Alert>
            </Snackbar>
        </>
    )
}

export default SnackAlert