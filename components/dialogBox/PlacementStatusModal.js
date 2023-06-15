import { Box } from '@mui/system';
import { useSelector } from 'react-redux';
import CustomBtn from '../global/CustomBtn';
import { useReducer, useState } from 'react';
import { candidateStatus } from '../../utils';
import { selectAuth } from '../../store/authSlice';
import SelectDropdown from '../global/SelectDropdown';
import DialogActions from '@mui/material/DialogActions';
import { formReducer } from '../../utils/globalFunctions';
import { useMutation, useQueryClient } from 'react-query';
import PlacementService from '../../Services/PlacementService';

const PlacementStatusModal = ({ handleClose, saveBtnTitle, closeBtnTitle, handleSave, data = {} }) => {

    const queryClient = useQueryClient();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useReducer(formReducer, {});
    const user = useSelector(selectAuth)?.userData;

    const handleOnSubmit = () => {
        setIsSubmitted(true);
        if (formData['Status']) {
            let temp = {
                JobTitle: data?.JobTitle,
                Status: formData['Status'] ? formData['Status'] : data?.Status,
                StartDate: data?.StartDate,
                GoLiveDate: data?.GoLiveDate,
                Role: data?.Role,
                Skills: data?.Skills,
                WorkExperience: data?.WorkExperience,
                TimeZone: data?.TimeZone,
                Creator: user?.FirstName + " " + user?.LastName,
                Subscribers: data?.Subscribers,
                PrimaryRecruitingContact: data?.PrimaryRecruitingContact,
                Organization: data?.Organization
            }
            if (Object.keys(formData)?.length > 0) {
                updatePlacementStatus.mutate(temp)
            }
        }

    }

    const updatePlacementStatus = useMutation((item) => PlacementService.updatePlacement(data?._id, item), {
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['getPlacementById'] }),
        onSuccess: async (res) => {
            setIsSubmitted(false);
            if (res?.success) {
                handleSave();
            }
        },
    })

    return (
        <>
            <Box>
                <SelectDropdown
                    variant="standard"
                    setValue={(e) => { setFormData(e); }}
                    label="Status"
                    name="Status"
                    required={true}
                    showAll={false}
                    defaultVal={data?.Status}
                    data={['Active', 'Inactive']}
                    isSubmitted={isSubmitted}
                    helperText="Note that changing status may notify the Client."
                />
            </Box>
            <DialogActions>
                <CustomBtn
                    onClick={() => { handleClose(); setIsSubmitted(false) }}
                    title={closeBtnTitle ? closeBtnTitle : 'Close'}
                    variant='outlined'
                />
                <CustomBtn
                    onClick={saveBtnTitle ? handleSave : handleOnSubmit}
                    title={saveBtnTitle ? saveBtnTitle : (formData['candidateStatus'] === candidateStatus[2] ? 'Create Contract' : 'Save')}
                    variant='contained'
                />
            </DialogActions>
        </>
    )
}

export default PlacementStatusModal;