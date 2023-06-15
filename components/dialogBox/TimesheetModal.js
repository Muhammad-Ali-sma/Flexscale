import { Checkbox, Grid, Table, TableCell, TableRow, TextField, Typography } from '@mui/material';
import { enumerateDaysBetweenDates, formReducer } from '../../utils/globalFunctions';
import TimesheetService from '../../Services/TimesheetService';
import { useMutation, useQueryClient } from 'react-query';
import { useEffect, useReducer, useState } from 'react';
import DialogActions from '@mui/material/DialogActions';
import SelectDropdown from '../global/SelectDropdown';
import { selectAuth } from '../../store/authSlice';
import SnackAlert from '../global/SnackAlert';
import CustomBtn from '../global/CustomBtn';
import { INTERNAL_USER } from '../../utils';
import { useSelector } from 'react-redux';
import Calendar from '../global/Calendar';
import { Box } from '@mui/system';
import moment from 'moment';

const TimesheetModal = ({ handleClose, timesheetModal, saveBtnTitle, closeBtnTitle, handleSave }) => {

    const queryClient = useQueryClient();
    const [type, setType] = useState(null);
    const [dates, setDates] = useState([]);
    const [users, setUsers] = useState([]);
    const [message, setMsg] = useState(false);
    const user = useSelector(selectAuth)?.userData;
    const [showSnack, setShowSnack] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useReducer(formReducer, {});
    const usersList = useSelector(state => state.dataSlice.usersList);
    const organizations = useSelector(state => state.dataSlice.OrganizationList);

    const handleOnSubmit = () => {
        setIsSubmitted(true);
        if (formData['Organization'] && formData['User'] && formData['Contract'] && formData['TimePeriodStart'] && formData['TimePeriodEnd']) {
            handleSave(2);
            if (timesheetModal == 2) {
                let temp = {
                    ...formData,
                    TimeLog: dates,
                    CreatedBy: user?._id
                }
                createTimesheet.mutate(temp);
            }
        }
    }
    const createTimesheet = useMutation((item) => TimesheetService.Create(item), {
        onSettled: async (res) => {
            queryClient.invalidateQueries({ queryKey: ['getAllTimesheets'] })
            setIsSubmitted(false);
            if (res?.success) {
                handleSave(0);
            } else {
                setType('error');
                setMsg('Failed please try again!');
                setShowSnack(true);
                setIsSubmitted(false);
            }
        }
    });

    useEffect(() => {
        let selectedDates = enumerateDaysBetweenDates(formData['TimePeriodStart'], formData['TimePeriodEnd']);
        setDates(selectedDates);
    }, [formData['Organization'], timesheetModal])

    useEffect(() => {
        setUsers(usersList?.filter(x => {
            let OrgIds = [];
            x?.Organization?.map(y => OrgIds.push(y._id));
            if (OrgIds.includes(formData['Organization']?._id) && x?.AccessLevel === INTERNAL_USER.level) {
                return x;
            }
        }));
    }, [usersList, formData['Organization']])

    return (
        <>

            {timesheetModal <= 1 ?
                <Box>
                    <SelectDropdown
                        setValue={setFormData}
                        label="Organization"
                        name="Organization"
                        data={organizations}
                        required={true}
                        isSubmitted={isSubmitted}
                        searchable={true}
                        variant="standard"
                        defaultVal={formData['Organization']}
                        getItem={true}
                    />
                    {formData['Organization'] &&
                        <SelectDropdown
                            variant="standard"
                            setValue={setFormData}
                            label="Team Member"
                            name="User"
                            required={true}
                            searchable={true}
                            data={users ?? []}
                            defaultVal={formData['User']}
                            isSubmitted={isSubmitted}
                        />
                    }
                    {formData['User'] &&
                        <SelectDropdown
                            variant="standard"
                            setValue={setFormData}
                            label="Contract"
                            name="Contract"
                            required={true}
                            searchable={true}
                            data={formData['User']?.Contracts ?? []}
                            defaultVal={formData['Contract']}
                            isSubmitted={isSubmitted}
                        />
                    }
                    <Calendar
                        label={"Time Period Start"}
                        setValue={setFormData}
                        isSubmitted={isSubmitted}
                        required={true}
                        name="TimePeriodStart"
                        defaultVal={formData['TimePeriodStart']}
                    />
                    <Calendar
                        label={"Time Period End"}
                        setValue={setFormData}
                        isSubmitted={isSubmitted}
                        required={true}
                        name="TimePeriodEnd"
                        defaultVal={formData['TimePeriodEnd']}
                    />
                </Box>
                :
                <>
                    <Table>
                        <TableRow>
                            {dates?.map(item => (
                                <TableCell sx={{ fontWeight: 700 }}>{moment(item.date).format('DD-MMM')}</TableCell>
                            ))}
                        </TableRow>
                        <TableRow>
                            {dates?.map((val, i) => (
                                <TableCell>
                                    <Box className='hours-cell'>
                                        <TextField
                                            disabled={val.check}
                                            variant="outlined"
                                            onChange={(e) => {
                                                if (e.target.value && e.target.value <= 8 && e.target.value >= 0) {
                                                    let temp = dates;
                                                    temp[i].hours = e.target.value;
                                                    setDates(JSON.parse(JSON.stringify(temp)));
                                                }
                                            }}
                                            name={`HoursPerDay-${i}`}
                                            value={val.hours}
                                            type="number"
                                        />
                                    </Box>
                                </TableCell>
                            ))}
                        </TableRow>
                        <TableRow>
                            {dates?.map((val, i) => (
                                <TableCell>
                                    <Checkbox onChange={(e) => {
                                        let temp = dates;
                                        temp[i].hours = 0;
                                        temp[i].check = e.target.checked
                                        setDates(JSON.parse(JSON.stringify(temp)));
                                    }} value={val.check} /> OL
                                </TableCell>
                            ))}
                        </TableRow>
                    </Table>
                    <Grid container spacing={2} sx={{ mt: 1, pl: 2, pb: 2, }}>
                        <Typography><b>Total Hours</b> {dates?.reduce((x, i) => x + Number(i.hours), 0)}</Typography>
                    </Grid>
                </>
            }
            <DialogActions>
                <CustomBtn
                    onClick={() => { handleClose(); setIsSubmitted(false) }}
                    title={closeBtnTitle}
                    variant='outlined'
                />
                <CustomBtn
                    onClick={() => handleOnSubmit()}
                    title={saveBtnTitle}
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

export default TimesheetModal;