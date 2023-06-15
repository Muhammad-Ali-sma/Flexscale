import InvoiceService from '../../Services/InvoiceService';
import DialogActions from '@mui/material/DialogActions';
import SnackAlert from '../global/SnackAlert';
import CustomBtn from '../global/CustomBtn';
import { Typography } from '@mui/material';
import { useMutation } from 'react-query';
import moment from 'moment';
import { useState } from 'react';

const InvoiceReminderModal = ({ handleClose, invoiceData, handleSave }) => {

    const [type, setType] = useState(null);
    const [msg, setMsg] = useState(false);
    const [showSnack, setShowSnack] = useState(false);

    const handleOnSubmit = () => {
        let temp = {
            Organization: invoiceData?.Organization,
            InvoiceNumber: invoiceData?.number,
            Amount: invoiceData?.total / 100,
            DueDate: moment.unix(invoiceData?.due_date).format('MM-DD-YYYY'),
            InvoiceId: invoiceData?.id
        }
        sendInvoiceReminder.mutate(temp);
    }

    const sendInvoiceReminder = useMutation((data) => InvoiceService.sendReminder(data), {
        onSettled: (res) => {
            if (res?.success) {
                handleSave();
            } else {
                setType('error');
                setMsg('Failed please try again!');
                setShowSnack(true);
            }
        }
    });

    return (
        <>
            <Typography>
                Are you sure you want to send a reminder to the Client?
                <br /><br />
                This will send an email notification to them.
                <br /><br />
            </Typography>
            <DialogActions>
                <CustomBtn
                    onClick={handleClose}
                    title={'Close'}
                    variant='outlined'
                />
                <CustomBtn
                    onClick={handleOnSubmit}
                    title={'Submit'}
                    variant='contained'
                />
            </DialogActions>
            <SnackAlert
                show={showSnack}
                type={type}
                handleClose={() => setShowSnack(false)}
                msg={msg}
            />
        </>
    )
}

export default InvoiceReminderModal;