import moment from 'moment';
import Head from "next/head";
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { useEffect, useReducer } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import Loader from '../../components/global/Loader';
import { Layout } from '../../components/global/Layout';
import FlexCard from '../../components/global/FlexCard';
import Calendar from '../../components/global/Calendar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CustomBtn from '../../components/global/CustomBtn';
import FlexField from '../../components/global/FlexField';
import SnackAlert from '../../components/global/SnackAlert';
import DialogBox from '../../components/dialogBox/DialogBox';
import TimesheetService from '../../Services/TimesheetService';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { BodyHeader } from '../../components/global/BodyHeader';
import { useMutation, useQuery, useQueryClient } from "react-query";
import { enumerateDaysBetweenDates, formReducer, getUser } from '../../utils/globalFunctions';
import { Box, Checkbox, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from '@mui/material';


export default function TimesheetDetails() {

    const router = useRouter()
    const { id } = router.query;
    const queryClient = useQueryClient();
    const [type, setType] = useState(null);
    const [msg, setMsg] = useState(false);
    const [dates, setDates] = useState([]);
    const [showSnack, setShowSnack] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [editHours, setEditHours] = useState(false);
    const [isEditable, setIsEditable] = useState(false);
    const [formData, setFormData] = useReducer(formReducer, {});

    const { data } = useQuery(['getTimesheetById'], () => TimesheetService.getTimesheetById(id), {
        enabled: id ? true : false
    });
    const creator = getUser('_id', data?.timesheet?.CreatedBy)[0];

    const updateTimesheet = useMutation((data) => TimesheetService.updateTimesheet(id, data), {
        onSettled: (res) => {
            queryClient.invalidateQueries({ queryKey: ['getTimesheetById'] })
            if (res?.success) {
                setIsEditable(false);
                setEditHours(false);
                setMsg("Timesheet updated successfully.");
                setType('success');
                setShowSnack(true);
            } else {
                setType('error');
                setMsg('Failed please try again!');
                setShowSnack(true);
            }
        }
    })
    const deleteTimesheet = useMutation((data) => TimesheetService.deleteTimesheet(id), {
        onSettled: (res) => {
            if (res?.success) {
                router.back();
            } else {
                setType('error');
                setMsg('Failed please try again!');
                setShowSnack(true);
            }
        }
    })
    const handleUpdateTimesheet = () => {
        if (formData['TimePeriodStart'] || formData['TimePeriodEnd']) {
            let selectedDates = enumerateDaysBetweenDates(formData['TimePeriodStart'] ? formData['TimePeriodStart'] : data?.timesheet?.TimeLog[0]?.date, formData['TimePeriodEnd'] ? formData['TimePeriodEnd'] : data?.timesheet?.TimeLog[data?.timesheet?.TimeLog?.length - 1]?.date);
            setDates(selectedDates);
            let temp = {
                TimePeriodStart: formData['TimePeriodStart'] ? formData['TimePeriodStart'] : data?.timesheet?.TimePeriodStart,
                TimePeriodEnd: formData['TimePeriodEnd'] ? formData['TimePeriodEnd'] : data?.timesheet?.TimePeriodEnd,
                TimeLog: selectedDates
            }
            updateTimesheet.mutate(temp);
        }
    }
    const handleUpdateHours = () => {
        let temp = {
            TimePeriodStart: data?.timesheet?.TimePeriodStart,
            TimePeriodEnd: data?.timesheet?.TimePeriodEnd,
            TimeLog: dates
        }
        updateTimesheet.mutate(temp);
    }

    useEffect(() => {
        if (!data) {
            router.push('/timesheets')
        }
        if (data?.timesheet?.TimeLog?.length > 0) {
            setDates(JSON.parse(JSON.stringify(data?.timesheet?.TimeLog)));
        }
    }, [data])
    return (
        <>
            <Head>
                <title>Timesheet | Flexscale</title>
            </Head>
            <Layout>
                <BodyHeader
                    title={`${moment(data?.timesheet?.TimePeriodStart)?.format('MMM DD ')} - ${moment(data?.timesheet?.TimePeriodEnd)?.format('DD, YYYY')}`}
                    subtitle={`${data?.timesheet?.Organization?.Name} - ${data?.timesheet?.User?.FirstName} ${data?.timesheet?.User?.LastName}`}
                    showAvatar={false}
                    containerStyle={{ justifyContent: 'space-between' }}
                    button={
                        <CustomBtn
                            onClick={() => router.back()}
                            variant="outlined"
                            icon={<ArrowBackIcon />}
                            title="Go Back"
                        />
                    }
                    handleRemove={() => deleteTimesheet.mutate()}
                />
                {data ?
                    <>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={12} lg={12}>
                                <FlexCard>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography sx={{ fontWeight: 800, marginBottom: 1, fontSize: { xs: "1.4rem", md: "1.7rem" } }}>General</Typography>
                                        {(!isEditable && !data?.timesheet?.Invoice) && <CustomBtn onClick={() => { setIsEditable(true); setShowPopup(true) }} variant="outlined" icon={<EditIcon sx={{ fontSize: 17 }} />} title="Edit" />}
                                    </div>
                                    <TableContainer component={Paper} sx={{ boxShadow: "none", border: 0 }} className="spacer-input">
                                        {isEditable ?
                                            <>
                                                <Grid item xs={12} md={6} lg={6}>
                                                    <FlexField
                                                        placeholder="Team Member"
                                                        variant="standard"
                                                        setValue={setFormData}
                                                        name='User'
                                                        label="Team Member"
                                                        disabled={true}
                                                        defaultVal={`${data?.timesheet?.User?.FirstName} ${data?.timesheet?.User?.LastName}`}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={6} lg={6}>
                                                    <FlexField
                                                        placeholder="Organization"
                                                        variant="standard"
                                                        setValue={setFormData}
                                                        name='Organization'
                                                        label="Organization"
                                                        defaultVal={data?.timesheet?.Organization?.Name}
                                                        disabled={true}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={6} lg={6}>
                                                    <FlexField
                                                        placeholder="Job Title"
                                                        variant="standard"
                                                        setValue={setFormData}
                                                        name='JobTitle'
                                                        label="Job Title"
                                                        defaultVal={data?.timesheet?.JobTitle}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={6} lg={6}>
                                                    <Calendar
                                                        label={"Time Period Start"}
                                                        setValue={setFormData}
                                                        name="TimePeriodStart"
                                                        defaultVal={data?.timesheet?.TimePeriodStart}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={6} lg={6}>
                                                    <Calendar
                                                        label={"Time Period End"}
                                                        setValue={setFormData}
                                                        name="TimePeriodEnd"
                                                        defaultVal={data?.timesheet?.TimePeriodEnd}
                                                    />
                                                </Grid>
                                                <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                                                    <CustomBtn onClick={() => setIsEditable(false)} btnStyle={{ marginRight: 1 }} variant="outlined" title={"Cancel"} />
                                                    <CustomBtn onClick={() => { handleUpdateTimesheet() }} variant="contained" title={"Save"} />
                                                </div>
                                            </>
                                            :
                                            <Table className='custom-responsive'>
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell component="th" sx={{ fontWeight: 700 }}>Team Member</TableCell>
                                                        <TableCell onClick={() => router.push(`/team/user/${data?.timesheet?.User?._id}`)} sx={{ color: 'darkcyan', cursor: 'pointer' }}>{data?.timesheet?.User?.FirstName} {data?.timesheet?.User?.LastName} <ArrowOutwardIcon sx={{ fontSize: 14 }} /></TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell component="th" sx={{ fontWeight: 700 }}>Organization</TableCell>
                                                        <TableCell onClick={() => router.push(`/organization/details/${data?.timesheet?.Organization?._id}`)} sx={{ color: 'darkcyan', cursor: 'pointer' }}>{data?.timesheet?.Organization?.Name} <ArrowOutwardIcon sx={{ fontSize: 14 }} /></TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell component="th" sx={{ fontWeight: 700 }}>Contract</TableCell>
                                                        <TableCell onClick={() => router.push(`/contracts/${data?.timesheet?.Contract?._id}`)} sx={{ color: 'darkcyan', cursor: 'pointer' }}>{data?.timesheet?.Contract?.JobTitle} <ArrowOutwardIcon sx={{ fontSize: 14 }} /></TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell component="th" sx={{ fontWeight: 700 }}>Timesheet ID</TableCell>
                                                        <TableCell>{data?.timesheet?._id}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell component="th" sx={{ fontWeight: 700 }}>Time Period Start</TableCell>
                                                        <TableCell>{moment(data?.timesheet?.TimePeriodStart).format('MM-DD-YYYY')}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell component="th" sx={{ fontWeight: 700 }}>Time Period End</TableCell>
                                                        <TableCell>{moment(data?.timesheet?.TimePeriodEnd).format('MM-DD-YYYY')}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell component="th" sx={{ fontWeight: 700 }}>Created Date</TableCell>
                                                        <TableCell>{moment(data?.timesheet?.createdAt).format('MM-DD-YYYY')}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell component="th" sx={{ fontWeight: 700 }}>Created By</TableCell>
                                                        <TableCell>{creator?.FirstName} {creator?.LastName}</TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        }
                                    </TableContainer>
                                </FlexCard>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={12} lg={12}>
                                <FlexCard>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography sx={{ fontWeight: 800, marginBottom: 1, fontSize: { xs: "1.4rem", md: "1.7rem" } }}>Hours</Typography>
                                        {!editHours && <CustomBtn onClick={() => setEditHours(true)} variant="outlined" icon={<EditIcon sx={{ fontSize: 17 }} />} title="Edit" />}
                                    </div>
                                    <TableContainer component={Paper} sx={{ boxShadow: "none", border: 0 }}>
                                        <Table>
                                            <TableBody>
                                                <TableRow>
                                                    {data?.timesheet?.TimeLog?.map(item => (
                                                        <TableCell key={`data_${item?.date}`}>{moment(item?.date).format('DD-MMM')}</TableCell>
                                                    ))}
                                                </TableRow>
                                                <TableRow>
                                                    {editHours ?
                                                        dates?.map((val, i) => {
                                                            return (
                                                                <TableCell key={`hours_${i}`}>
                                                                    <Box className='hours-cell'>
                                                                        <TextField
                                                                            disabled={val.check === 'true' || val.check === true ? true : false}
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
                                                                            sx={{ '& .mui-style-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input': { padding: '10px' } }}
                                                                        />
                                                                    </Box>
                                                                </TableCell>
                                                            )
                                                        })
                                                        :
                                                        data?.timesheet?.TimeLog?.map((item, index) => (
                                                            <TableCell key={`check_${index}`}>{item?.hours}{item?.check == 'true' && ' - OL'}</TableCell>
                                                        ))}

                                                </TableRow>
                                                {editHours && <TableRow>
                                                    {dates?.map((val, i) => (
                                                        <TableCell key={`hours_${i}`}>
                                                            <Checkbox onChange={(e) => {
                                                                let temp = dates;
                                                                temp[i].hours = 0;
                                                                temp[i].check = e.target.checked
                                                                setDates(JSON.parse(JSON.stringify(temp)));
                                                            }} defaultChecked={val.check == 'true' ? true : false} /> OL
                                                        </TableCell>
                                                    )
                                                    )}
                                                </TableRow>}
                                            </TableBody>
                                        </Table>

                                        <Grid container spacing={2} sx={{ mt: 1, pl: 2, pb: 2, }}>
                                            <Typography><b>Total Hours</b> {dates?.reduce((x, i) => x + Number(i.hours), 0)}</Typography>
                                        </Grid>

                                    </TableContainer>
                                    {editHours &&
                                        <>
                                            <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                                                <CustomBtn onClick={() => { setDates(data?.timesheet?.TimeLog); setEditHours(false) }} btnStyle={{ marginRight: 1 }} variant="outlined" title={"Cancel"} />
                                                <CustomBtn onClick={() => { handleUpdateHours() }} variant="contained" title={"Save"} />
                                            </div>
                                        </>
                                    }
                                </FlexCard>
                            </Grid>
                        </Grid>
                    </>
                    :
                    <Loader show={!data ? true : false} />
                }
                <SnackAlert
                    show={showSnack}
                    type={type}
                    handleClose={() => setShowSnack(false)}
                    msg={msg}
                />
            </Layout>
            <DialogBox
                open={showPopup}
                handleClose={() => setShowPopup(false)}
                maxWidth='sm'
                title="Warning"
                msg="Changing time period start/end will reset all your hours"
            />
        </>
    );
}


