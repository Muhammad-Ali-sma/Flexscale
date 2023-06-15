import { Drawer } from '@mui/material';
import React from 'react';

const DrawerBox = ({ children, anchor = 'left', open, container, onClose, containerStyle, ModalProps = {}, variant = "temporary" }) => {
    return (
        <Drawer
            anchor={anchor}
            open={open}
            onClose={onClose}
            sx={containerStyle}
            container={container}
            ModalProps={ModalProps}
            variant={variant}
        >
            {children}
        </Drawer>
    )
}

export default DrawerBox