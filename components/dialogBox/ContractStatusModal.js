import { Box } from '@mui/system';
import { useSelector } from 'react-redux';
import CustomBtn from '../global/CustomBtn';
import FlexField from '../global/FlexField';
import { useReducer, useState } from 'react';
import { FormHelperText, } from '@mui/material';
import { selectAuth } from '../../store/authSlice';
import SelectDropdown from '../global/SelectDropdown';
import DialogActions from '@mui/material/DialogActions';
import { useMutation, useQueryClient } from 'react-query';
import { contractStatus } from '../../utils';
import { formReducer } from '../../utils/globalFunctions';
import ContractService from '../../Services/ContractService';

const ContractStatusModal = ({ handleClose, closeBtnTitle, handleSave, data = {} }) => {

    const queryClient = useQueryClient();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useReducer(formReducer, {});
    const user = useSelector(selectAuth)?.userData;

    const handleOnSubmit = () => {
        setIsSubmitted(true);
        if (formData['ContractStatus']) {
            UpdateContractStatus.mutate({ Reason: formData['Reason'], ContractStatus: formData['ContractStatus'], contract: data });
        }
    }
    const UpdateContractStatus = useMutation((item) => ContractService.updateContractStatus(data?._id, 'undefined', item), {
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['getContractById'] }),
        onSuccess: async (res) => {
            setIsSubmitted(false);
            if (res?.success) {
                handleSave();
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
                    name="ContractStatus"
                    required={true}
                    showAll={false}
                    defaultVal={data?.Status}
                    data={contractStatus}
                    isSubmitted={isSubmitted}
                    helperText="Note that changing status may notify the Client."
                />
                {((formData['ContractStatus'] || data?.Status) === 'On Leave') &&
                    <>
                        <FlexField
                            variant="standard"
                            setValue={(e) => { setFormData(e); }}
                            label="Type a reason"
                            name="Reason"
                            required={true}
                            isSubmitted={isSubmitted}
                        />
                        <FormHelperText>This reason will be communicated to the Client.</FormHelperText>
                    </>
                }
            </Box>
            <DialogActions>
                <CustomBtn
                    onClick={() => { handleClose(); setIsSubmitted(false) }}
                    title={closeBtnTitle ? closeBtnTitle : 'Close'}
                    variant='outlined'
                />
                <CustomBtn
                    onClick={handleOnSubmit}
                    title={'Save'}
                    variant='contained'
                />
            </DialogActions>
        </>
    )
}

export default ContractStatusModal;