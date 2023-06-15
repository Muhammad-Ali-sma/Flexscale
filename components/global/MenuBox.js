import { Menu } from '@mui/material';
import React from 'react';

const MenuBox = ({ children, handleClose, open, anchorEl }) => {
    return (
        <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{ 'aria-labelledby': 'basic-button' }}
        >
            {children}
        </Menu>
    )
}

export default MenuBox;