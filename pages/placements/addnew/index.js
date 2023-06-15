import moment from "moment";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useMutation } from "react-query";
import { useReducer, useState } from "react";
import { INTERNAL_ADMIN } from "../../../utils";
import { selectAuth } from "../../../store/authSlice";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Layout } from "../../../components/global/Layout";
import Calendar from "../../../components/global/Calendar";
import FlexCard from "../../../components/global/FlexCard";
import CustomBtn from "../../../components/global/CustomBtn";
import FlexField from "../../../components/global/FlexField";
import { formReducer } from "../../../utils/globalFunctions";
import DialogBox from "../../../components/dialogBox/DialogBox";
import { FormHelperText, Grid, Typography } from "@mui/material";
import PlacementService from "../../../Services/PlacementService";
import { BodyHeader } from "../../../components/global/BodyHeader";
import SelectDropdown from "../../../components/global/SelectDropdown";
import { Roles, Skills, timeZones, WorkExperience } from "../../../utils/data";



const AddNewPlacement = () => {

    const organizations = useSelector(state => state.dataSlice.OrganizationList);
    const [formData, setFormData] = useReducer(formReducer, {});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const user = useSelector(selectAuth)?.userData;
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const router = useRouter();


    const createPlacement = useMutation((data) => PlacementService.Create(data), {
        onSettled: async (res) => {
            if (res?.success) {
                setFormData({});
                router.push("/placements");
            } else {
                setShow(true)
            }
            setLoading(false);
        }
    });
    const handleOnSubmit = () => {
        setIsSubmitted(true);
        setLoading(true);

        let temp = {
            JobTitle: formData['JobTitle'],
            CreatedBy: user?._id,
            StartDate: formData['StartDate'],
            Organization: formData['Organization'],
            Role: formData['Role'],
            Skills: formData['Skills'],
            WorkExperience: formData['WorkExperience'],
            TimeZone: formData['TimeZone'],
            PrimaryRecruitingContact: user?._id,
            Status: user?.AccessLevel === INTERNAL_ADMIN.level ? 'Inactive' : '',
            GoLiveDate: formData['GoLiveDate']
        }
        if (formData['JobTitle'] && formData['StartDate'] && formData['Organization'] && formData['Skills'] && formData['Role'] && formData['WorkExperience'] && formData['TimeZone']) {
            createPlacement.mutate(temp);
        } else {
            setLoading(false);
        }
    };

    return (
        <>

            <Head>
                <title>Create New Placement | Flexscale</title>
            </Head>
            <Layout>
                <BodyHeader
                    button={<CustomBtn onClick={() => router.back()} variant="outlined" icon={<ArrowBackIcon />} title={"Go Back"} />}
                    containerStyle={{justifyContent: 'space-between',flexWrap:'wrap', gap:'16px'}}
                    title={"Add New Placement"}
                />
                <FlexCard>
                    <Grid container spacing={2} style={{flexDirection:'column'}}>
                        <Grid item xs={12} md={6} lg={6}>
                            <Typography sx={{ fontWeight: 800, marginBottom: 1, fontSize: { xs: "1.4rem", md: "1.7rem" } }}>Complete the form</Typography>
                            <FlexField
                                variant="standard"
                                setValue={setFormData}
                                name='JobTitle'
                                as='text'
                                label="Job Title"
                                required={true}
                                isSubmitted={isSubmitted}
                            />
                            <FormHelperText>This is based on your own job description e.g. Business Analyst, Software Engineer, and can be changed later.</FormHelperText>
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                            <SelectDropdown
                                variant="standard"
                                setValue={setFormData}
                                label="Organization(s)"
                                name="Organization"
                                data={organizations}
                                required={true}
                                isSubmitted={isSubmitted}
                                searchable={true}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                            <SelectDropdown
                                variant="standard"
                                setValue={setFormData}
                                label="Role"
                                name="Role"
                                required={true}
                                showAll={false}
                                isSubmitted={isSubmitted}
                                data={Roles}
                                searchable={true}
                            />
                            <FormHelperText>This is a title related to the work they will be performing, and will help us in our search.</FormHelperText>
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                            <SelectDropdown
                                variant="standard"
                                setValue={setFormData}
                                label="Skills"
                                name="Skills"
                                isSubmitted={isSubmitted}
                                required={true}
                                showAll={false}
                                getId={true}
                                multiple={true}
                                data={Skills}
                            />
                            <FormHelperText>Choose up to 5 skills the ideal candidate should have.</FormHelperText>
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                            <SelectDropdown
                                variant="standard"
                                setValue={setFormData}
                                label="Work Experience"
                                name="WorkExperience"
                                required={true}
                                isSubmitted={isSubmitted}
                                showAll={false}
                                data={WorkExperience}
                            />
                            <FormHelperText>How many years of experience should they ideally have?</FormHelperText>
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                            <SelectDropdown
                                variant="standard"
                                setValue={setFormData}
                                label="Time Zone"
                                name="TimeZone"
                                required={true}
                                isSubmitted={isSubmitted}
                                showAll={false}
                                data={timeZones}
                                searchable={true}
                            />
                            <FormHelperText>What time zone will this team member be working on?</FormHelperText>
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                            <Calendar
                                label={"Start Date"}
                                setValue={setFormData}
                                isSubmitted={isSubmitted}
                                name="StartDate"
                                //minDate={moment().format('MM-DD-YYYY')}
                            />
                            <FormHelperText>You should keep at least a 2 week buffer in order to find candidates.</FormHelperText>
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                            <Calendar
                                label={"Go Live Date"}
                                setValue={setFormData}
                                name="GoLiveDate"
                            />
                        </Grid>

                        <Grid container sx={{ marginTop: 1, display: 'flex', justifyContent: 'flex-end' }}>
                            <Grid item lg={1} md={4} sm={12} xs={12} sx={{ textAlign: 'center' }}>
                                <CustomBtn
                                    onClick={() => { handleOnSubmit() }}
                                    btnStyle={{ width: '100%' }}
                                    variant="contained"
                                    title={'Submit'}
                                    loading={loading}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </FlexCard>
            </Layout>
            <DialogBox
                open={show}
                handleClose={() => setShow(false)}
                msg={'Error occured please try again!'}
                title={'Error'}
            />
        </>
    )
}

export default AddNewPlacement