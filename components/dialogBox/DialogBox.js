import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { Divider, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const DialogBox = ({ open, handleClose, msg, maxWidth, title, containerStyle = {}, children, showCloseBtn = false }) => {

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="responsive-dialog-title"
            sx={containerStyle}
            maxWidth={maxWidth ?? 'sm'}
            fullWidth={true}
            scroll={'paper'}
        >
            <DialogTitle id="responsive-dialog-title">
                <b>{title}</b>
                {showCloseBtn &&
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            right: 5,
                            top: 10,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                }
            </DialogTitle>
            <Divider />
            <DialogContent>
                {msg && <p>{msg}</p>}
                {children}
            </DialogContent>
        </Dialog >
    )
}

export default DialogBox;
