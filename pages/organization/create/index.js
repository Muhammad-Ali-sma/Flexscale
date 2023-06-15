import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { useMutation } from 'react-query';
import { Box, Grid, Typography } from '@mui/material';
import { countryList } from '../../../utils/data';
import React, { useReducer, useState } from 'react';
import { selectAuth } from '../../../store/authSlice';
import FlexCard from '../../../components/global/FlexCard';
import RadioBtn from '../../../components/global/RadioBtn';
import { Layout } from '../../../components/global/Layout';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FlexField from '../../../components/global/FlexField';
import CustomBtn from '../../../components/global/CustomBtn';
import DialogBox from '../../../components/dialogBox/DialogBox';
import { BodyHeader } from '../../../components/global/BodyHeader';
import SelectDropdown from '../../../components/global/SelectDropdown';
import OrganizationService from '../../../Services/OrganizationService';
import { formReducer, getOrganizationList } from '../../../utils/globalFunctions';

const AddOrUpdateOrg = () => {

    const [formData, setFormData] = useReducer(formReducer, {});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const user = useSelector(selectAuth)?.userData;
    const [loading, setLoading] = useState(false);
    const [loadingStripeCustomer, setLoadingStripeCustomer] = useState(false);
    const [stripeCustomerFound, setStripeCustomerFound] = useState(false);
    const [show, setShow] = useState(false);
    const router = useRouter();

    const addOrg = useMutation((formData) => OrganizationService.createOrganization(formData), {
        onSuccess: async (res) => {
            if (res?.success) {
                setFormData({});
                getOrganizationList();
                router.push("/organization");
                setIsSubmitted(false);
            } else {
                setShow(true)
            }
            setLoading(false);
        },
        onError: async (error) => {
            setLoading(false);
            setIsSubmitted(false);
            setShow(true)
        }
    })

    const getStripeOrg = useMutation((stripeId) => OrganizationService.getStripeCustomer(stripeId), {
        onSuccess: async (res) => {
            if (res.success) {
                setStripeCustomerFound(true);
                let customer = res.customer;
                let items = [
                    { target: { name: 'Name', value: customer.name } },
                    { target: { name: 'Address1', value: customer.address.line1 } },
                    { target: { name: 'Address2', value: customer.address.line2 } },
                    { target: { name: 'City', value: customer.address.city } },
                    { target: { name: 'State', value: customer.address.state } },
                    { target: { name: 'Country', value: customer.address.country } },
                    { target: { name: 'PostalCode', value: customer.address.postal_code } },
                    { target: { name: 'BillingContactEmail', value: customer.email } },
                    { target: { name: 'BillingContactPhone', value: customer.phone } },
                    { target: { name: 'BillingAddress', value: customer.address.line1 } },
                    { target: { name: 'BillingAddress2', value: customer.address.line2 } },
                    { target: { name: 'BillingCity', value: customer.address.city } },
                    { target: { name: 'BillingState', value: customer.address.state } },
                    { target: { name: 'BillingPostalCode', value: customer.address.postal_code } },
                    { target: { name: 'BillingCountry', value: customer.address.country } },
                ]
                items?.map(x => setFormData(x));
            } else {
                clearForm();
                alert(res.message);
                setStripeCustomerFound(false);
            }
            setLoadingStripeCustomer(false);
        },
        onError: async (error) => {
            setLoadingStripeCustomer(false);
        }
    })

    const clearForm = () => {
        let items = [
            { target: { name: 'Name', value: "" } },
            { target: { name: 'Address1', value: "" } },
            { target: { name: 'Address2', value: "" } },
            { target: { name: 'City', value: "" } },
            { target: { name: 'State', value: "" } },
            { target: { name: 'Country', value: "" } },
            { target: { name: 'PostalCode', value: "" } },
            { target: { name: 'BillingContactEmail', value: "" } },
            { target: { name: 'BillingContactPhone', value: "" } },
            { target: { name: 'BillingAddress', value: "" } },
            { target: { name: 'BillingAddress2', value: "" } },
            { target: { name: 'BillingCity', value: "" } },
            { target: { name: 'BillingState', value: "" } },
            { target: { name: 'BillingPostalCode', value: "" } },
            { target: { name: 'BillingCountry', value: "" } },
            { target: { name: 'StripeId', value: "" } },
        ]
        items?.map(x => setFormData(x));
    }

    const handleOnSubmit = () => {
        setIsSubmitted(true);
        setLoading(true);
        let temp = {
            ...formData,
            CreatedBy: user?._id,
            OrganizationType: formData['OrganizationType'] ? formData['OrganizationType'] : 'Client'
        };
        if (formData['StripeId'] && formData['StripeId'] !== "" && !stripeCustomerFound) {
            alert("Please click on get button on stripe customer id to validate before submitting!");
            return false;
        }
        if (formData['Name']) {
            addOrg.mutate(temp)
        } else {
            setLoading(false);
        }
    }

    const getStripeCustomer = () => {
        if (formData["StripeId"] && formData["StripeId"] !== "") {
            setLoadingStripeCustomer(true);
            setStripeCustomerFound(false);
            getStripeOrg.mutate(formData?.StripeId);
        }
    }

    return (
        <>
            <Head>
                <title>Organization | Flexscale</title>
            </Head>
            <Layout>
                <BodyHeader
                    title={"Add New Organization"}
                    button={<CustomBtn
                        onClick={() => router.back()}
                        variant="outlined"
                        icon={<ArrowBackIcon />}
                        title={"Go Back"}
                    />
                    }
                    containerStyle={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}
                />
                <FlexCard>
                    <Grid container spacing={2} style={{ flexDirection: 'column' }}>
                        <Grid item xs={12} md={6} lg={6}>
                            <Typography sx={{ fontWeight: 800, marginBottom: 1, fontSize: { xs: "1.4rem", md: "1.7rem" } }}>General</Typography>
                            <FlexField
                                variant="standard"
                                setValue={setFormData}
                                defaultVal={formData.Name ?? ""}
                                name='Name'
                                as='text'
                                label="Organization Name"
                                isSubmitted={isSubmitted}
                                required={true}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                            <Box alignItems={"center"} display={"flex"}>
                                <FlexField
                                    variant="standard"
                                    setValue={setFormData}
                                    defaultVal={formData.StripeId ?? ""}
                                    name='StripeId'
                                    as='text'
                                    label="Stripe Customer Id"
                                />
                                {(formData["StripeId"] && formData["StripeId"] !== "") &&
                                    <CustomBtn
                                        loading={loadingStripeCustomer}
                                        onClick={() => getStripeCustomer()}
                                        btnStyle={{ width: 'auto' }}
                                        variant="contained"
                                        title={'GET'}
                                    />
                                }
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                            <RadioBtn
                                handleChange={setFormData}
                                label="Type"
                                required={true}
                                name="OrganizationType"
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                            <FlexField
                                variant="standard"
                                setValue={setFormData}
                                defaultVal={formData.Address1 ?? ""}
                                name='Address1'
                                as='text'
                                label="Address"
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                            <FlexField
                                variant="standard"
                                defaultVal={formData.Address2 ?? ""}
                                setValue={setFormData}
                                name='Address2'
                                as='text'
                                label="Apartment, suite, etc."
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                            <FlexField
                                variant="standard"
                                setValue={setFormData}
                                defaultVal={formData.City ?? ""}
                                name='City'
                                as='text'
                                label="City"
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                            <FlexField
                                variant="standard"
                                setValue={setFormData}
                                defaultVal={formData.State ?? ""}
                                name='State'
                                as='text'
                                label="State/Province"
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                            <SelectDropdown
                                setValue={setFormData}
                                label="Country"
                                name="Country"
                                value={formData.Country ?? ""}
                                data={countryList}
                                variant="standard"
                                showAll={false}
                                searchable={true}
                                helperText="Start typing and we will help you find the right country."
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                            <FlexField
                                variant="standard"
                                setValue={setFormData}
                                defaultVal={formData.PostalCode ?? ""}
                                name='PostalCode'
                                as='text'
                                label="Postal Code"
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                            <Typography sx={{ fontWeight: 800, marginTop: 1, fontSize: { xs: "1.4rem", md: "1.7rem" } }}>Billing Information</Typography>
                            <FlexField
                                variant="standard"
                                setValue={setFormData}
                                name='BillingContactFirstName'
                                as='text'
                                label="Billing Contact First Name"
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                            <FlexField
                                variant="standard"
                                setValue={setFormData}
                                name='BillingContactLastName'
                                as='text'
                                label="Billing Contact Last Name"
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                            <FlexField
                                variant="standard"
                                setValue={setFormData}
                                name='BillingContactEmail'
                                defaultVal={formData.BillingContactEmail ?? ""}
                                as='email'
                                label="Billing Contact Email"
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                            <FlexField
                                variant="standard"
                                setValue={setFormData}
                                name='BillingContactPhone'
                                defaultVal={formData.BillingContactPhone ?? ""}
                                as='text'
                                label="Billing Contact Phone"
                                isSubmitted={isSubmitted}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                            <FlexField
                                variant="standard"
                                setValue={setFormData}
                                name='BillingAddress'
                                defaultVal={formData.BillingAddress ?? ""}
                                as='text'
                                label="Billing Address"
                                isSubmitted={isSubmitted}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                            <FlexField
                                variant="standard"
                                setValue={setFormData}
                                name='BillingAddress2'
                                defaultVal={formData.BillingAddress2 ?? ""}
                                as='text'
                                label="Apartment, suite, etc."
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                            <FlexField
                                variant="standard"
                                setValue={setFormData}
                                name='BillingCity'
                                defaultVal={formData.BillingCity ?? ""}
                                as='text'
                                label="Billing City"
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                            <FlexField
                                variant="standard"
                                setValue={setFormData}
                                name='BillingState'
                                defaultVal={formData.BillingState ?? ""}
                                as='text'
                                label="Billing State"
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                            <FlexField
                                variant="standard"
                                setValue={setFormData}
                                name='BillingPostalCode'
                                defaultVal={formData.BillingPostalCode ?? ""}
                                as='text'
                                label="Postal Code"
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                            <SelectDropdown
                                setValue={setFormData}
                                label="Country"
                                name="BillingCountry"
                                data={countryList}
                                value={formData.BillingCountry ?? ""}
                                variant="standard"
                                showAll={false}
                                searchable={true}
                                helperText="Start typing and we will help you find the right country."
                            />
                        </Grid>
                    </Grid>
                    <Grid container sx={{ marginTop: 1, display: 'flex', justifyContent: 'flex-end' }}>
                        <Grid item lg={1} md={4} sm={12} xs={12}>
                            <CustomBtn
                                loading={loading}
                                onClick={() => handleOnSubmit()}
                                btnStyle={{ width: '100%' }}
                                variant="contained"
                                title={'Submit'}
                            />
                        </Grid>
                    </Grid>
                </FlexCard>
            </Layout>
            <DialogBox
                open={show}
                handleClose={() => setShow(false)}
                msg={"Submission Failed. Please Try Again!"}
                title={"Error"}
            />
        </>
    )
}

export default AddOrUpdateOrg;