import moment from 'moment';
import { Box } from '@mui/system';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import Calendar from '../global/Calendar';
import CustomBtn from '../global/CustomBtn';
import FlexField from '../global/FlexField';
import { useReducer, useState } from 'react';
import SnackAlert from '../global/SnackAlert';
import { FormHelperText } from '@mui/material';
import { selectAuth } from '../../store/authSlice';
import SelectDropdown from '../global/SelectDropdown';
import DialogActions from '@mui/material/DialogActions';
import { formReducer, getUsersList } from '../../utils/globalFunctions';
import { useMutation, useQueryClient } from 'react-query';
import ContractService from '../../Services/ContractService';
import PlacementService from '../../Services/PlacementService';
import { candidateStatus, typeOfEmployment } from '../../utils';

const PlacementCandidateModal = ({ handleClose, handleSave, selectedUser = {}, data = {} }) => {

    const router = useRouter();
    const queryClient = useQueryClient();
    const [type, setType] = useState(null);
    const [message, setMsg] = useState(false);
    const [showSnack, setShowSnack] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useReducer(formReducer, {});
    const user = useSelector(selectAuth)?.userData;

    const handleOnSubmit = () => {
        setIsSubmitted(true);
        if (formData['candidateStatus']) {
            updateCandidateStatus.mutate({ Status: formData['candidateStatus'] });
            if (formData['TypeofEmployment'] && formData['WorkHoursPerWeek'] && formData['RatePerHour'] && formData['NoOfPaidTimeOffDays']) {
                let temp = {
                    JobTitle: data?.JobTitle,
                    CreatedBy: user?._id,
                    StartDate: data?.StartDate,
                    GoLiveDate: data?.GoLiveDate,
                    EndDate: formData['EndDate'],
                    Organization: data?.Organization,
                    User: selectedUser?.candidateId,
                    Placement: data,
                    TypeofEmployment: formData['TypeofEmployment'],
                    WorkHoursPerWeek: formData['WorkHoursPerWeek'],
                    RatePerHour: formData['RatePerHour'],
                    NoOfPaidTimeOffDays: formData['NoOfPaidTimeOffDays'],
                    prevIds: data?.Contracts?.map(x => x?._id),
                    userContractIds: selectedUser?.candidateId?.Contracts?.map(x => x),
                    prevOrganizationsIds: selectedUser?.candidateId?.Organization?.map(x => x),
                }
                createContract.mutate(temp);
            }
        }
    }

    const createContract = useMutation((item) => ContractService.Create(item), {
        onSuccess: async (res) => {
            setIsSubmitted(false);
            getUsersList();
            if (res?.success) {
                handleSave();
                router.push(`/contracts/${res?.item?._id}`)
            }
        },
        onError: async (error) => {
            setType('error');
            setMsg('Failed please try again!');
            setShowSnack(true);
            setIsSubmitted(false);
        }
    })
    const updateCandidateStatus = useMutation((item) => PlacementService.updateCandidateStatus(selectedUser?._id, item), {
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['getPlacementById'] }),
        onSuccess: async (res) => {
            setIsSubmitted(false);
            if (res?.success) {
                handleSave();
            }
        },
        onError: async (error) => {
            console.log(error);
            setType('error');
            setMsg('Failed please try again!');
            setShowSnack(true);
            setIsSubmitted(false);
        }
    })

    return (
        <>
            <Box>
                <SelectDropdown
                    variant="standard"
                    setValue={(e) => { setFormData(e); setIsSubmitted(false) }}
                    label="Status"
                    name="candidateStatus"
                    required={true}
                    showAll={false}
                    defaultVal={selectedUser?.candidateStatus}
                    data={candidateStatus}
                    isSubmitted={isSubmitted}
                    helperText="Note that changing status to Hired will create a Contract for this Candidate."
                />
            </Box>
            {
                formData['candidateStatus'] === candidateStatus[2] &&
                <>
                    <Box>
                        <SelectDropdown
                            variant="standard"
                            setValue={setFormData}
                            label="Type Of Employment"
                            name="TypeofEmployment"
                            isSubmitted={isSubmitted}
                            required={true}
                            showAll={false}
                            data={typeOfEmployment}
                        />
                    </Box>
                    <Box>
                        <FlexField
                            variant="standard"
                            setValue={setFormData}
                            label="Work Hours per Week"
                            name="WorkHoursPerWeek"
                            isSubmitted={isSubmitted}
                            required={true}
                            as='number'
                        />
                    </Box>
                    <Box>
                        <FlexField
                            variant="standard"
                            setValue={setFormData}
                            label="Rate per Hour"
                            isSubmitted={isSubmitted}
                            name="RatePerHour"
                            required={true}
                            showAll={false}
                            as='number'
                        />
                        <FormHelperText>Rate is the amount paid per hour in USD.</FormHelperText>
                    </Box>
                    <Box>
                        <FlexField
                            variant="standard"
                            setValue={setFormData}
                            label="No Of Paid Time Off Days"
                            isSubmitted={isSubmitted}
                            name="NoOfPaidTimeOffDays"
                            required={true}
                            as='number'
                            showAll={false}
                        />
                    </Box>
                    <Box>
                        <Calendar
                            label={"End Date"}
                            setValue={setFormData}
                            name="EndDate"
                            minDate={moment().format('MM-DD-YYYY')}
                        />
                        <FormHelperText>Optional</FormHelperText>
                    </Box>
                </>
            }
            <DialogActions>
                <CustomBtn
                    onClick={() => { handleClose(); setIsSubmitted(false) }}
                    title={'Close'}
                    variant='outlined'
                />
                <CustomBtn
                    onClick={handleOnSubmit}
                    title={(formData['candidateStatus'] === candidateStatus[2] ? 'Create Contract' : 'Save')}
                    variant='contained'
                />
            </DialogActions>
            <SnackAlert
                show={showSnack}
                type={type}
                handleClose={(event, reason) => setShowSnack(false)}
                msg={message}
            />
        </>
    )
}

export default PlacementCandidateModal;