import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSelector } from "react-redux";
import { Grid, Typography } from '@mui/material';
import React, { useReducer, useState } from 'react';
import { useMutation, useQuery } from "react-query";
import { selectAuth } from '../../../store/authSlice';
import UserService from '../../../Services/UserService';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Layout } from '../../../components/global/Layout';
import FlexCard from '../../../components/global/FlexCard';
import { countryList, pronouns } from '../../../utils/data';
import FlexField from '../../../components/global/FlexField';
import CustomBtn from '../../../components/global/CustomBtn';
import SnackAlert from '../../../components/global/SnackAlert';
import DialogBox from '../../../components/dialogBox/DialogBox';
import { BodyHeader } from '../../../components/global/BodyHeader';
import MessageModal from '../../../components/dialogBox/MessageModal';
import SelectDropdown from '../../../components/global/SelectDropdown';
import OrganizationService from '../../../Services/OrganizationService';
import { formReducer, getUsersList } from '../../../utils/globalFunctions';
import { accessLevelClientBillingAdmin, accessLevelClientSuperAdmin, accessLevelClientUser, CLIENT_BILLING_ADMIN, CLIENT_SUPER_ADMIN } from '../../../utils';

const AddNew = () => {

    const organization = useSelector(state => state.authUser.selectedOrganization);
    const [formData, setFormData] = useReducer(formReducer, {});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showSnack, setShowSnack] = useState(false);
    const user = useSelector(selectAuth)?.userData;
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [title, setTitle] = useState('');
    const [msg, setMsg] = useState('');
    const router = useRouter();

    const addUser = useMutation((formData) => UserService.Register(formData), {
        onSuccess: async (res) => {
            getUsersList()
            if (res?.success) {
                setShowSnack(true);
                setIsSubmitted(false);
                setFormData({});
            } else {
                setTitle('Error');
                setMsg(res?.message?.join(', '));
                setShow(true)
            }
            setLoading(false);
        },
        onError: async () => {
            setLoading(false);
            setIsSubmitted(false);
            setTitle('Error');
            setMsg('Submission failed, please try again!');
            setShow(true)
        }
    });

    const handleOnSubmit = () => {
        setLoading(true);
        setIsSubmitted(true);

        let temp = {
            ...formData,
            createdBy: user?._id,
            organization: [organization?._id],
        };
        if (formData['accessLevel'] && formData['firstName'] && formData['lastName'] && formData['email']) {
            addUser.mutate(temp)
        } else {
            setTitle('Error');
            setMsg('Please fill all the required fields!');
            setShow(true);
            setLoading(false);
        }
    }

    return (
        <>
            <Head>
                <title>Invite New User | Flexscale</title>
            </Head>
            <Layout>
                <BodyHeader
                    title={"Invite New User"}
                    button={<CustomBtn
                        onClick={() => router.back()}
                        variant="outlined"
                        icon={<ArrowBackIcon />}
                        title="Go Back"
                    />
                    }
                    containerStyle={{ justifyContent: 'space-between' }}
                />
                <FlexCard>
                    <Grid container spacing={2} >
                        <Grid item xs={12}>
                            <Typography sx={{ fontWeight: 800, marginBottom: 1, fontSize: { xs: "1.4rem", md: "1.7rem" } }}>Complete the form</Typography>
                            <SelectDropdown
                                variant="standard"
                                setValue={setFormData}
                                label="Access Level"
                                name="accessLevel"
                                getAccessMethods={true}
                                data={user?.AccessLevel === CLIENT_SUPER_ADMIN.level ? accessLevelClientSuperAdmin : user?.AccessLevel === CLIENT_BILLING_ADMIN.level ? accessLevelClientBillingAdmin : accessLevelClientUser}
                                showAll={false}
                                required={true}
                                isSubmitted={isSubmitted}
                                helperText="Based on the access level, it will provide access to clients or internal applications."
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FlexField
                                variant="standard"
                                name='organization'
                                label="Organization(s)"
                                defaultVal={organization?.Name}
                                disabled={true}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FlexField
                                placeholder="First Name"
                                variant="standard"
                                setValue={setFormData}
                                name='firstName'
                                label="First Name"
                                required={true}
                                isSubmitted={isSubmitted}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FlexField
                                placeholder="Preferred First Name"
                                variant="standard"
                                setValue={setFormData}
                                name='preferredName'
                                label="Preferred First Name"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FlexField
                                placeholder="Last Name"
                                variant="standard"
                                setValue={setFormData}
                                name='lastName'
                                required={true}
                                isSubmitted={isSubmitted}
                                label="Last Name"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <SelectDropdown
                                setValue={setFormData}
                                variant="standard"
                                label="Pronouns"
                                name="gender"
                                data={pronouns}
                                showAll={false}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FlexField
                                placeholder="Email"
                                variant="standard"
                                setValue={setFormData}
                                name='email'
                                as={'email'}
                                label="Email"
                                isSubmitted={isSubmitted}
                                required={true}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FlexField
                                placeholder="Phone"
                                variant="standard"
                                setValue={setFormData}
                                name='phone'
                                as='text'
                                label="Phone Number"
                                isSubmitted={isSubmitted}
                                required={false}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <SelectDropdown
                                setValue={setFormData}
                                label="Location"
                                name="country"
                                data={countryList}
                                variant="standard"
                                showAll={false}
                                searchable={true}
                            />
                        </Grid>
                        <Grid container sx={{ marginTop: 1, display: 'flex', justifyContent: 'flex-end' }}>
                            <Grid item lg={3} md={4} sm={12} xs={12} sx={{ textAlign: 'center' }}>
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
            <DialogBox
                open={showSnack}
                showCloseBtn={true}
                handleClose={() => {
                    router.push({
                        pathname: '/company-settings',
                        query: { tab: 1 }
                    });
                    setShowSnack(false);
                }}
                msg={'User Invited successfully.'}
                title={"Success"}
            />
        </>
    )
}

export default AddNew;