import moment from 'moment';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSelector } from "react-redux";
import { useMutation } from "react-query";
import React, { useReducer, useState } from 'react'
import { selectAuth } from '../../../store/authSlice'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Layout } from '../../../components/global/Layout';
import Calendar from '../../../components/global/Calendar';
import FlexCard from '../../../components/global/FlexCard';
import CustomBtn from '../../../components/global/CustomBtn';
import FlexField from '../../../components/global/FlexField';
import { INTERNAL_USER, typeOfEmployment } from '../../../utils';
import DialogBox from '../../../components/dialogBox/DialogBox';
import ContractService from '../../../Services/ContractService';
import { FormHelperText, Grid, Typography } from '@mui/material';
import PlacementService from '../../../Services/PlacementService';
import { BodyHeader } from '../../../components/global/BodyHeader';
import { formReducer, getUser } from '../../../utils/globalFunctions';
import SelectDropdown from '../../../components/global/SelectDropdown';

const Create = () => {
    
    const organizations = useSelector(state => state.dataSlice.OrganizationList);
    const [formData, setFormData] = useReducer(formReducer, {});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const users = getUser('AccessLevel', INTERNAL_USER.level);
    const user = useSelector(selectAuth)?.userData;
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [title, setTitle] = useState('');
    const [msg, setMsg] = useState('');
    const router = useRouter();

    const createPlacement = useMutation((data) => PlacementService.Create(data), {
        onSettled: async (res) => {
            if (res?.success) {
                let temp = {
                    ...formData,
                    CreatedBy: user?._id,
                    userContractIds: formData['User']?.Contracts?.map(x => x._id),
                    User: formData['User'],
                    Placement: res?.data,
                    prevIds: [],
                    prevOrganizationsIds: formData['User']?.Organization?.map(x => x._id)
                }
                createContract.mutate(temp)
            } else {
                setTitle('Error');
                setMsg('Submission failed, please try again!');
                setShow(true);
                setIsSubmitted(false);
                setLoading(false);
            }
        }
    })
    const createContract = useMutation((data) => ContractService.Create(data), {
        onSuccess: async (res) => {
            if (res?.success) {
                router.push('/contracts');
            } else {
                setTitle('Error');
                setMsg('Submission failed, please try again!');
                setShow(true);
                setIsSubmitted(false);
                setLoading(false);
            }
        },
        onError: async (error) => {
            setTitle('Error');
            setMsg('Submission failed, please try again!');
            setShow(true);
            setLoading(false);
            setIsSubmitted(false);
        }
    })
    const handleOnSubmit = () => {
        setLoading(true);
        setIsSubmitted(true);
        if (formData['User']?.Organization?.filter(x => x._id === formData['Organization'])?.length > 0) {
            setTitle('Error');
            setMsg('This user is already hired for this organization please change either user or organization!');
            setShow(true);
            setLoading(false);
            return;
        }
        let temp = {
            ...formData,
            CreatedBy: user?._id
        }
        if (formData['User'] && formData['Organization'] && formData['JobTitle'] && formData['TypeofEmployment'] && formData['WorkHoursPerWeek'] && formData['RatePerHour'] && formData['NoOfPaidTimeOffDays'] && formData['StartDate']) {
            createPlacement.mutate(temp)
        } else {
            setLoading(false);
        }
    }

    return (
        <>
            <Head>
                <title>Team | Flexscale</title>
            </Head>
            <Layout>
                <BodyHeader
                    title={"Add New Contract"}
                    button={<CustomBtn
                        onClick={() => router.back()}
                        variant="outlined"
                        icon={<ArrowBackIcon />}
                        title="Go Back"
                    />
                    }
                    containerStyle={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}
                />
                <FlexCard>
                    <Grid container spacing={2} style={{ flexDirection: 'column' }}>
                        <Grid item xs={12} md={6} lg={6}>
                            <Typography sx={{ fontWeight: 800, paddingTop: '16px', marginBottom: 1, fontSize: { xs: "1.4rem", md: "1.7rem" } }}>Complete the form</Typography>
                            <SelectDropdown
                                variant="standard"
                                setValue={setFormData}
                                label="Team Member"
                                name="User"
                                data={users ?? []}
                                showAll={false}
                                required={true}
                                searchable={true}
                                isSubmitted={isSubmitted}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                            <SelectDropdown
                                variant="standard"
                                setValue={setFormData}
                                label="Organization(s)"
                                name="Organization"
                                data={organizations ?? []}
                                required={true}
                                isSubmitted={isSubmitted}
                                searchable={true}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                            <FlexField
                                variant="standard"
                                setValue={setFormData}
                                label="Job Title"
                                isSubmitted={isSubmitted}
                                name="JobTitle"
                                required={true}
                                showAll={false}
                                as='text'
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
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
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                            <FlexField
                                variant="standard"
                                setValue={setFormData}
                                label="Work Hours per Week"
                                name="WorkHoursPerWeek"
                                isSubmitted={isSubmitted}
                                as='number'
                                required={true}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
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
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
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
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                            <Calendar
                                label={"Start Date"}
                                setValue={setFormData}
                                name="StartDate"
                                required={true}
                                isSubmitted={isSubmitted}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                            <Calendar
                                label={"Go Live Date"}
                                setValue={setFormData}
                                name="GoLiveDate"
                                //minDate={formData['StartDate'] ?? null}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                            <Calendar
                                label={"End Date"}
                                setValue={setFormData}
                                name="EndDate"
                                //minDate={formData['GoLiveDate'] ?? null}
                            />
                            <FormHelperText>Optional</FormHelperText>
                        </Grid>
                        <Grid container sx={{ marginTop: 1, display: 'flex', justifyContent: 'flex-end' }}>
                            <Grid item lg={1} md={4} sm={12} xs={12} sx={{ textAlign: 'center' }}>
                                <CustomBtn
                                    onClick={() => handleOnSubmit()}
                                    variant="contained"
                                    title={"Submit"}
                                    btnStyle={{ width: '100%' }}
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
                msg={msg}
                title={title}
            />
        </>
    )
}

export default Create;