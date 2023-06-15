import moment from "moment";
import Head from "next/head";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import { CLIENT_USER } from "../../../utils";
import Footer from "../../../components/global/Footer";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useReducer, useState } from "react";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FlexCard from "../../../components/global/FlexCard";
import Calendar from "../../../components/global/Calendar";
import CustomBtn from "../../../components/global/CustomBtn";
import FlexField from "../../../components/global/FlexField";
import DialogBox from "../../../components/dialogBox/DialogBox";
import ProgressNav from "../../../components/global/ProgressNav";
import PlacementService from "../../../Services/PlacementService";
import { BodyHeader } from "../../../components/global/BodyHeader";
import SelectDropdown from "../../../components/global/SelectDropdown";
import OrganizationService from "../../../Services/OrganizationService";
import { Roles, Skills, timeZones, WorkExperience } from "../../../utils/data";
import { formReducer, getOrganizationList } from "../../../utils/globalFunctions";
import { nextStep, previousStep, selectAuth, setOrganization } from "../../../store/authSlice";
import { Box, FormHelperText, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material"



const AddNewHiring = () => {

    const organization = useSelector(state => state.authUser.selectedOrganization);
    const usersList = useSelector(state => state.dataSlice.usersList);
    const step = useSelector(state => state.authUser.activeStep);
    const [formData, setFormData] = useReducer(formReducer, {});
    const user = useSelector(selectAuth)?.userData;
    const [loading, setLoading] = useState(false);
    const [members, setMembers] = useState([]);
    const [show, setShow] = useState(false);
    const dispatch = useDispatch();
    const router = useRouter();


    const createHiring = useMutation((data) => PlacementService.Create(data), {
        onSettled: async (res) => {
            if (res?.success) {
                setFormData({});
                dispatch(nextStep({ step: 0 }));
                router.push(`/hiring/requests/${res?.data?._id}`)
            } else {
                setShow(true)
            }
            setLoading(false);
        }
    })

    const handleOnSubmit = () => {
        setLoading(true);
        let temp = {
            JobTitle: formData['JobTitle'],
            CreatedBy: user?._id,
            StartDate: formData['StartDate'] ? formData['StartDate'] : moment(Date.now()).format('MM-DD-YYYY'),
            Organization: organization?._id,
            Role: formData['Role'],
            Skills: formData['Skills'],
            WorkExperience: formData['WorkExperience'],
            TimeZone: formData['TimeZone'],
            PrimaryRecruitingContact: formData['PrimaryRecruitingContact'] ? formData['PrimaryRecruitingContact'] : user?._id,
            Subscribers: formData['Subscribers'],
            Name: user?.FirstName + " " + user?.LastName
        }
        createHiring.mutate(temp);
    }

    const updateOrg = useMutation((data) => OrganizationService.updateOrganization(organization?._id, data), {
        onSettled: (res) => {
            getOrganizationList();
            dispatch(setOrganization({ org: res?.org }));
        }
    })

    useEffect(() => {
        if (step !== 0) {
            dispatch(previousStep());
        }
        if (!organization?.CreatedBy) {
            updateOrg.mutate({ CreatedBy: user?._id })
        }
    }, [])

    useEffect(() => {
        setMembers(usersList?.filter(x => {
            let OrgIds = [];
            x?.Organization?.map(y => OrgIds.push(y._id));
            if ((x?._id === user?._id) || (OrgIds.includes(organization?._id) && x?.AccessLevel === CLIENT_USER.level)) {
                return x;
            }
        }))
    }, [usersList])


    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <ProgressNav />
                <Box component="main" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1, px: { xs: 3, sm: 4, md: 8 }, py: 3, mt: { md: 4, xs: 14, sm: 10 }, width: { xs: '100%', sm: `calc(100% - 530px)` } }}>
                    <Head>
                        <title>Add New Hire | Flexscale</title>
                    </Head>
                    <BodyHeader
                        button={<CustomBtn btnStyle={{ display: { md: 'inline-flex', xs: 'none' } }} onClick={() => { step == 0 ? router.back() : dispatch(previousStep()) }} variant="outlined" icon={<ArrowBackIcon />} title={"Go Back"} />}
                    />
                    {step === 0 &&
                        <>
                            <Grid container spacing={2} sx={{ justifyContent: 'center', display: 'flex', textAlign: 'center', }}>
                                <Grid item lg={7} md={12} sm={8} xs={12}>
                                    <Typography sx={{ fontWeight: "bolder", marginBottom: 5, textAlign: 'center', fontSize: { lg: '2rem', md: "1.7rem", sm: "1.7rem", xs: "1.6rem" } }}>Basic Information</Typography>
                                    <FlexField
                                        variant="standard"
                                        setValue={setFormData}
                                        name='JobTitle'
                                        as='text'
                                        defaultVal={formData['JobTitle']}
                                        label="Job Title"
                                    />
                                    <FormHelperText>This is based on your own job description e.g. Business Analyst, Software Engineer, and can be changed later.</FormHelperText>
                                </Grid>
                                <Grid item lg={7} md={12} sm={8} xs={12}>
                                    <Calendar
                                        label={"Start Date"}
                                        setValue={setFormData}
                                        name="StartDate"
                                        defaultVal={formData['StartDate']}
                                        //minDate={moment().format('MM-DD-YYYY')}
                                    />
                                    <FormHelperText>You should keep at least a 2 week buffer in order to find candidates.</FormHelperText>
                                </Grid>
                            </Grid>
                            <Grid container sx={{ marginTop: 5, display: 'flex', justifyContent: 'center' }}>
                                <Grid item lg={2} md={4} sm={4} xs={6}>
                                    <CustomBtn
                                        onClick={() => dispatch(nextStep({ step: 1 }))}
                                        btnStyle={{ width: '100%' }}
                                        variant="contained"
                                        title={'Continue'}
                                        disabled={formData['JobTitle'] && formData['StartDate'] ? false : true}
                                    />
                                </Grid>
                            </Grid>
                        </>
                    }
                    {step === 1 &&
                        <>
                            <Grid container spacing={2} sx={{ justifyContent: 'center', display: 'flex', textAlign: 'center' }}>
                                <Grid item lg={7} md={12} sm={8} xs={12}>
                                    <Typography sx={{ fontWeight: "bolder", marginBottom: 5, fontSize: { lg: '2rem', md: "1.7rem", sm: "1.7rem", xs: "1.6rem" } }}>Job Requirements</Typography>
                                    <SelectDropdown
                                        variant="standard"
                                        setValue={setFormData}
                                        label="Select a role"
                                        name="Role"
                                        required={true}
                                        showAll={false}
                                        defaultVal={formData['Role'] ? { title: formData['Role'] } : null}
                                        data={Roles}
                                        searchable={true}
                                    />
                                    <FormHelperText>This is a title related to the work they will be performing, and will help us in our search.</FormHelperText>
                                </Grid>
                                <Grid item lg={7} md={12} sm={8} xs={12}>
                                    <SelectDropdown
                                        variant="standard"
                                        setValue={setFormData}
                                        label="Skills"
                                        name="Skills"
                                        required={true}
                                        showAll={false}
                                        getId={true}
                                        multiple={true}
                                        defaultVal={formData['Skills']}
                                        data={Skills}
                                    />
                                    <FormHelperText>Choose up to 5 skills the ideal candidate should have.</FormHelperText>
                                </Grid>

                                <Grid item lg={7} md={12} sm={8} xs={12}>
                                    <SelectDropdown
                                        variant="standard"
                                        setValue={setFormData}
                                        label="Work Experience"
                                        name="WorkExperience"
                                        required={true}
                                        showAll={false}
                                        defaultVal={formData['WorkExperience']}
                                        data={WorkExperience}
                                    />
                                    <FormHelperText>How many years of experience should they ideally have?</FormHelperText>
                                </Grid>
                                <Grid item lg={7} md={12} sm={8} xs={12}>
                                    <SelectDropdown
                                        variant="standard"
                                        setValue={setFormData}
                                        label="Time Zone"
                                        name="TimeZone"
                                        required={true}
                                        showAll={false}
                                        searchable={true}
                                        defaultVal={formData['TimeZone'] ? { title: formData['TimeZone'] } : null}
                                        data={timeZones}
                                    />
                                    <FormHelperText>What timezone will this team member be working on?</FormHelperText>
                                </Grid>
                            </Grid>
                            <Grid container sx={{ marginTop: 5, display: 'flex', justifyContent: 'center' }}>
                                <Grid item lg={2} md={4} sm={4} xs={6}>
                                    <CustomBtn
                                        onClick={() => dispatch(nextStep({ step: 2 }))}
                                        btnStyle={{ width: '100%' }}
                                        variant="contained"
                                        title={'Continue'}
                                        disabled={(formData['Role'] && formData['Skills']?.length > 0 && formData['WorkExperience'] && formData['TimeZone']) ? false : true}
                                    />
                                </Grid>
                            </Grid>
                        </>
                    }
                    {step === 2 &&
                        <>
                            <Grid container spacing={2} sx={{ justifyContent: 'center', display: 'flex', textAlign: 'center', }}>
                                <Grid item lg={7} md={12} sm={8} xs={12}>
                                    <Typography sx={{ fontWeight: "bolder", marginBottom: 5, fontSize: { lg: '2rem', md: "1.7rem", sm: "1.7rem", xs: "1.6rem" } }}>Notifications</Typography>
                                    <SelectDropdown
                                        variant="standard"
                                        setValue={setFormData}
                                        label="Primary Recruiting Contact"
                                        name="PrimaryRecruitingContact"
                                        showAll={false}
                                        getId={true}
                                        defaultVal={formData['PrimaryRecruitingContact'] ? formData['PrimaryRecruitingContact'] : user?._id}
                                        data={members}
                                    />
                                    <FormHelperText>Choose the user that will be incharge of interviewing candidates.</FormHelperText>
                                </Grid>
                                <Grid item lg={7} md={12} sm={8} xs={12}>
                                    <SelectDropdown
                                        variant="standard"
                                        setValue={setFormData}
                                        label="Subscribers"
                                        name="Subscribers"
                                        showAll={false}
                                        getItem={true}
                                        defaultVal={formData['Subscribers']}
                                        data={members?.filter(x => x?._id !== user?._id && x?._id !== formData['PrimaryRecruitingContact'])}
                                        multiple={true}
                                    />
                                    <FormHelperText>Add anybody else that should receive notifications for this role.</FormHelperText>
                                </Grid>
                            </Grid>
                            <Grid container sx={{ marginTop: 5, display: 'flex', justifyContent: 'center' }}>
                                <Grid item lg={2} md={4} sm={4} xs={6}>
                                    <CustomBtn
                                        onClick={() => dispatch(nextStep({ step: 3 }))}
                                        btnStyle={{ width: '100%' }}
                                        variant="contained"
                                        title={'Continue'}
                                    />
                                </Grid>
                            </Grid>
                        </>
                    }

                    {step === 3 &&
                        <>
                            <Grid container spacing={2} sx={{ justifyContent: 'center', display: 'flex', textAlign: 'center', }}>
                                <Grid item lg={7} md={12} sm={8} xs={12}>
                                    <Typography sx={{ fontWeight: "bolder", marginBottom: 5, fontSize: { lg: '2rem', md: "1.7rem", sm: "1.7rem", xs: "1.6rem" } }}>Review and submit</Typography>
                                    <FlexCard>
                                        <TableContainer component={Paper} sx={{ boxShadow: "none", border: 0, overflowX: 'hidden' }}>
                                            <Table>
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell component="th" sx={{ fontWeight: 700 }}>Job Title</TableCell>
                                                        <TableCell>{formData['JobTitle']} </TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell component="th" sx={{ fontWeight: 700 }}>Ideal Start Date</TableCell>
                                                        <TableCell>{formData['StartDate']}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell component="th" sx={{ fontWeight: 700 }}>Role</TableCell>
                                                        <TableCell>{formData['Role']}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell component="th" sx={{ fontWeight: 700 }}>Skills</TableCell>
                                                        <TableCell>{formData['Skills']?.map((x, i) => x?.Name + (formData['Skills'][i + 1] ? ", " : ""))}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell component="th" sx={{ fontWeight: 700 }}>Work Experience</TableCell>
                                                        <TableCell>{formData['WorkExperience']}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell component="th" sx={{ fontWeight: 700 }}>Time Zone</TableCell>
                                                        <TableCell>{formData['TimeZone']}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell component="th" sx={{ fontWeight: 700 }}>Primary Recruiting Contact</TableCell>
                                                        <TableCell>{formData['PrimaryRecruitingContact'] ? members?.filter(x => x?._id === formData['PrimaryRecruitingContact'])?.map(item => item?.FirstName + " " + item?.LastName) : user?.FirstName + " " + user?.LastName}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell component="th" sx={{ fontWeight: 700 }}>Subscribers</TableCell>
                                                        <TableCell>{formData['Subscribers']?.map((item, i) => item?.FirstName + " " + item?.LastName + (formData['Subscribers'][i + 1] ? ", " : ""))}</TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </FlexCard>
                                </Grid>
                            </Grid>
                            <Grid container sx={{ marginTop: 5, display: 'flex', justifyContent: 'center' }}>
                                <Grid item lg={2} md={4} sm={4} xs={6}>
                                    <CustomBtn
                                        onClick={() => { dispatch(nextStep({ step: 3 })); handleOnSubmit() }}
                                        btnStyle={{ width: '100%' }}
                                        variant="contained"
                                        title={'Submit'}
                                        loading={loading}
                                    />
                                </Grid>
                            </Grid>
                        </>
                    }
                </Box>
                <Footer />
            </Box>
            <DialogBox
                open={show}
                handleClose={() => setShow(false)}
                msg={'Error occured please try again!'}
                title={'Error'}
            />
        </>
    )
}

export default AddNewHiring