import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import CustomBtn from '../global/CustomBtn';

const MessageModal = ({ handleClose, msg, handleRemove, removeBtnTitle, saveBtnTitle, closeBtnTitle, handleSave }) => {

    return (

        <>
            <DialogContentText>
                {msg}
            </DialogContentText>
            <DialogActions>
                <CustomBtn
                    onClick={() => { handleClose() }}
                    title={closeBtnTitle ? closeBtnTitle : 'Close'}
                    variant='outlined'
                />
                {handleSave &&
                    <CustomBtn
                        onClick={handleSave}
                        title={saveBtnTitle ? saveBtnTitle : 'Save'}
                        variant='contained'
                    />}
                {handleRemove &&
                    <CustomBtn
                        onClick={handleRemove}
                        title={removeBtnTitle ?? 'Remove'}
                        variant='contained'
                        btnStyle={{ backgroundColor: 'red', color: 'white' }}
                    />}
            </DialogActions>
        </>
    )
}

export default MessageModal;