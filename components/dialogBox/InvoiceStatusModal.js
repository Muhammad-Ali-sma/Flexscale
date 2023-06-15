import { Box } from '@mui/system';
import CustomBtn from '../global/CustomBtn';
import { useReducer, useState } from 'react';
import SnackAlert from '../global/SnackAlert';
import SelectDropdown from '../global/SelectDropdown';
import DialogActions from '@mui/material/DialogActions';
import { formReducer } from '../../utils/globalFunctions';
import { useMutation, useQueryClient } from 'react-query';
import InvoiceService from '../../Services/InvoiceService';

const InvoiceStatusModal = ({ handleClose, invoiceData, handleSave }) => {

    const queryClient = useQueryClient();
    const [type, setType] = useState(null);
    const [msg, setMsg] = useState(false);
    const [showSnack, setShowSnack] = useState(false);
    const [formData, setFormData] = useReducer(formReducer, {});

    const handleOnSubmit = () => {
        if (formData['Status']) {
            updateInvoiceStatus.mutate({ Status: formData['Status'] })
        }
    }
    const updateInvoiceStatus = useMutation((data) => InvoiceService.updateInvoice(invoiceData?.id, data), {
        onSettled: (res) => {
            queryClient.invalidateQueries({ queryKey: ['getInvoiceById'] });
            if (res?.success) {
                handleSave();
            } else {
                setType('error');
                setMsg('Failed please try again!');
                setShowSnack(true);
            }
        }
    })

    return (
        <>
            <Box>
                <SelectDropdown
                    variant="standard"
                    setValue={(e) => { setFormData(e); }}
                    label="Status"
                    name="Status"
                    showAll={false}
                    data={['Void','Paid from outside']}
                />
            </Box>
            <DialogActions>
                <CustomBtn
                    onClick={handleClose}
                    title={'Close'}
                    variant='outlined'
                />
                <CustomBtn
                    onClick={handleOnSubmit}
                    title={'Save'}
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

export default InvoiceStatusModal;