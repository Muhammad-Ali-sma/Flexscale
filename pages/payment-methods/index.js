import moment from "moment";
import Head from "next/head";
import { useSelector } from "react-redux";
import { selectAuth } from "../../store/authSlice";
import DeleteIcon from '@mui/icons-material/Delete';
import PaymentIcon from '@mui/icons-material/Payment';
import Calendar from "../../components/global/Calendar";
import { Layout } from '../../components/global/Layout';
import FlexCard from "../../components/global/FlexCard";
import { useEffect, useReducer, useState } from "react";
import { formReducer } from "../../utils/globalFunctions";
import CustomBtn from "../../components/global/CustomBtn";
import FlexField from "../../components/global/FlexField";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DrawerBox from "../../components/global/DrawerBox";
import PaymentService from "../../Services/PaymentService";
import SnackAlert from "../../components/global/SnackAlert";
import DialogBox from "../../components/dialogBox/DialogBox";
import { BodyHeader } from '../../components/global/BodyHeader';
import MessageModal from "../../components/dialogBox/MessageModal";
import SelectDropdown from '../../components/global/SelectDropdown';
import { useMutation, useQuery, useQueryClient } from "react-query";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ReplayCircleFilledIcon from '@mui/icons-material/ReplayCircleFilled';
import { Avatar, Box, FormControlLabel, Grid, Switch, Typography } from "@mui/material";
import Script from 'next/script'
import Loader from "../../components/global/Loader";
export default function PaymentMethods() {


    const [step, setStep] = useState(1);
    const queryClient = useQueryClient();
    const [msg, setMsg] = useState(false);
    const [type, setType] = useState(null);
    const [menu, setMenu] = useState(false);
    const [autoPay, setAutoPay] = useState(null);
    const [loading, setLoading] = useState(false);
    const [linkToken, setLinkToken] = useState("");
    const [paymentId, setPaymentId] = useState('');
    const user = useSelector(selectAuth)?.userData;
    const [isLoaded, setIsLoaded] = useState(true);
    const [showSnack, setShowSnack] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [formData, setFormData] = useReducer(formReducer, {});
    const [previousAutoPayment, setPreviousAutoPayment] = useState(null);
    const organization = useSelector(state => state.authUser.selectedOrganization);

    const handleOnSubmit = () => {
        setIsSubmitted(true);
        setLoading(true);
        let temp = {
            ...formData,
            user,
            CustomerId: organization?.StripeId
        }
        if (formData['CardNumber'] && formData['CardholderName'] && formData['ExpiryDate'] && formData['CardCVC']) {
            createPaymentMethod.mutate(temp);
        } else {
            setLoading(false);
        }
    }
    const createPaymentMethod = useMutation((data) => PaymentService.Create(data), {
        onSettled: (res) => {
            setIsLoaded(true);
            queryClient.invalidateQueries({ queryKey: 'getPaymentMethodsByCustomerId' })
            setLoading(false);
            setIsSubmitted(false);
            if (res?.success) {
                setStep(1);
                setType('success');
                setMsg("Payment method created successfully");
                setShowSnack(true);
            } else {
                setMsg(res?.message ?? "Error occured please try again!")
                setType('error');
                setShowSnack(true);
            }
        }
    })
    const deletePaymentMethod = useMutation(() => PaymentService.Delete(paymentId, organization?.StripeId), {
        onSettled: (res) => {
            setIsLoaded(true);
            queryClient.invalidateQueries({ queryKey: 'getPaymentMethodsByCustomerId' });
            setLoading(false);
            setIsSubmitted(false);
            if (res?.success) {
                setDeleteModal(false)
                setType('success');
                setMsg("Payment method deleted successfully");
                setShowSnack(true);
            } else {
                setMsg(res?.message ? res?.message : "Error occured please try again!")
                setType('error');
                setShowSnack(true);
            }
        }
    })
    const updatePaymentMethod = useMutation((paymentId) => PaymentService.Update(organization?.StripeId, paymentId), {
        onSettled: (res) => {
            queryClient.invalidateQueries({ queryKey: 'getPaymentMethodsByCustomerId' });
            if (res?.success) {
                setMenu(false)
                setType('success');
                setMsg("Payment method updated successfully");
                setShowSnack(true);
            } else {
                setMsg(res?.message ? res?.message : "Error occured please try again!")
                setType('error');
                setShowSnack(true);
            }
            setLoading(false);
            setIsLoaded(true);
            setIsDisabled(false);
            setIsSubmitted(false);
        }
    })
    const { data } = useQuery(['getPaymentMethodsByCustomerId'], () => PaymentService.getPaymentMethodsByCustomerId(organization?.StripeId), {
        enabled: (organization?.StripeId && isLoaded) ? true : false,
        onSuccess: (res) => { setPreviousAutoPayment(res?.list?.filter(x => x?.id === res?.customer?.invoice_settings?.default_payment_method)[0]); setIsLoaded(false) }
    });
    useQuery(['CreatePlaidLink'], () => PaymentService.CreatePlaidLink(), {
        enabled: isLoaded ? true : false,
        onSuccess: (res) => { setIsLoaded(false); setLinkToken(res) }
    });

    const handleToggleAutoPay = (check) => {
        if (check) {
            setIsDisabled(true);
        }
        setAutoPay(check)
        updatePaymentMethod.mutate(formData['PaymentMethod'] ? (check ? formData['PaymentMethod'] : null) : null)
    }
    const loadPlaidPopup = () => {
        if (linkToken) {
            Plaid.create({
                token: linkToken,
                onSuccess: (public_token, metadata) => {
                    let temp = {
                        ...metadata,
                        CustomerId: organization?.StripeId
                    }
                    createPaymentMethod.mutate(temp);
                }
            }).open();
        }
    }
    useEffect(() => {
        setIsLoaded(true);
    }, [])

    return (
        <>
            <Head>
                <title>Payment Methods | Flexscale</title>
            </Head>
            <Script src="https://cdn.plaid.com/link/v2/stable/link-initialize.js" />

            <Layout>
                {!isLoaded ?
                    <>
                        {step === 1 &&
                            <>
                                <BodyHeader
                                    title={"Payment Methods"}
                                    subtitle="Save and manage payment methods."
                                />
                                <Grid container mt={3}>
                                    <Grid item lg={4} xs={12}>
                                        <FlexCard>
                                            <Typography sx={{ fontWeight: 'bold', fontSize: 20, mb: 1 }}>Automatically pay your invoices</Typography>
                                            <Typography>Set up automatic payments so invoices and subscription bills are automatically debited from your account when they are due.</Typography>
                                            <CustomBtn
                                                title="Set up auto pay"
                                                btnStyle={{ border: '1px solid #203B3C', mt: 2 }}
                                                onClick={() => { setAutoPay(previousAutoPayment ? true : false); setMenu(true) }}
                                            />
                                        </FlexCard>
                                    </Grid>
                                </Grid>
                                <Typography sx={{ fontWeight: 'bold', fontSize: 20, mb: 2 }}>My payment methods</Typography>
                                <Grid container spacing={2}>
                                    <Grid item lg={4} md={6} xs={12}>
                                        <FlexCard containerStyle={{ border: '1px dashed #203B3C', height: { md: 200, sm: 150, xs: 200 }, display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }} onClick={() => setStep(2)}>
                                            <CustomBtn
                                                title="Add payment method"
                                                icon={<AddCircleOutlineIcon />}
                                            />
                                        </FlexCard>
                                    </Grid>
                                    {data?.list?.map((item, index) => (
                                        <Grid item lg={4} md={6} xs={12} key={`card_${index}`}>
                                            <FlexCard containerStyle={{ border: '1px solid #203B3C', height: { md: 200, sm: 150, xs: 200 }, display: 'flex', justifyContent: 'space-between', flexDirection: 'column' }}>
                                                <Grid container>
                                                    <Grid item xs={9}>
                                                        <Typography sx={{ fontWeight: 'bold', fontSize: 20, mb: 1, textTransform: 'capitalize' }}>{item?.type == "us_bank_account" ? "ACH Direct Debit" : item?.card?.funding} Card</Typography>
                                                        <Typography sx={{ fontSize: 14, color: '#203B3C', textTransform: 'capitalize' }}>***{item?.type == "us_bank_account" ? item?.us_bank_account?.last4 : item?.card?.last4} {item?.type == "us_bank_account" ? item?.us_bank_account?.bank_name : item?.card?.brand + 'card'}</Typography>
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        {item?.type == "us_bank_account" ?
                                                            <Avatar sx={{ bgcolor: '#0B79D0', float: 'right', fontSize: 16 }}>ACH</Avatar>
                                                            :
                                                            <Avatar sx={{ bgcolor: 'orange', float: 'right' }}><PaymentIcon /></Avatar>
                                                        }
                                                    </Grid>
                                                </Grid>
                                                <Grid container sx={{}}>
                                                    <Grid item xs={6}>
                                                        <Typography onClick={() => { setDeleteModal(true); setPaymentId(item?.id) }} sx={{ fontSize: 14, color: '#203B3C', cursor: 'pointer' }}><DeleteIcon sx={{ fontSize: 16, verticalAlign: 'text-top' }} /> DELETE</Typography>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        {data?.customer?.invoice_settings?.default_payment_method === item?.id &&
                                                            <Typography sx={{ fontSize: 14, color: '#203B3C', textAlign: 'right' }}>AUTOPAY <ReplayCircleFilledIcon sx={{ fontSize: 14, verticalAlign: 'text-top' }} /></Typography>
                                                        }
                                                    </Grid>
                                                </Grid>
                                            </FlexCard>
                                        </Grid>
                                    ))}
                                </Grid>
                            </>
                        }
                        {step === 2 &&
                            <>
                                <BodyHeader
                                    title={"Add Payment Method"}
                                    subtitle="Set up a preferred payment method in seconds."
                                    containerStyle={{ justifyContent: 'space-between' }}
                                    button={
                                        <CustomBtn
                                            onClick={() => setStep(step - 1)}
                                            variant="outlined"
                                            icon={<ArrowBackIcon />}
                                            title="Go Back"
                                        />
                                    }
                                />
                                <Grid container spacing={2} mt={3}>
                                    <Grid item lg={6} xs={12} sx={{ cursor: 'pointer' }} onClick={() => loadPlaidPopup()}>
                                        <FlexCard>
                                            <Grid container>
                                                <Grid item xs={6}>
                                                    <Typography sx={{ fontWeight: 'bold', fontSize: 20, mb: 1 }}>ACH Direct Debit</Typography>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Avatar sx={{ bgcolor: '#0B79D0', float: 'right', fontSize: 16 }}>ACH</Avatar>
                                                </Grid>
                                            </Grid>
                                            <Typography>Enable on-click payment from your bank account to Flexscale’s bank account via direct debit.</Typography>
                                        </FlexCard>
                                    </Grid>
                                    <Grid item lg={6} xs={12} onClick={() => setStep(3)} sx={{ cursor: 'pointer' }}>
                                        <FlexCard containerStyle={{ height: { md: 120, sm: 'auto' } }}>
                                            <Grid container>
                                                <Grid item xs={6}>
                                                    <Typography sx={{ fontWeight: 'bold', fontSize: 20, mb: 1 }}>Credit / Debit Card</Typography>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Avatar sx={{ bgcolor: 'orange', float: 'right' }}><PaymentIcon /></Avatar>
                                                </Grid>
                                                <Typography>Flexscale accepts all major credit and debit cards.</Typography>
                                            </Grid>
                                        </FlexCard>
                                    </Grid>
                                </Grid>
                            </>
                        }
                        {step === 3 &&
                            <>
                                <BodyHeader
                                    title={"Add Credit or Debit Card"}
                                    subtitle="Flexscale accepts all major credit and debit cards."
                                    containerStyle={{ justifyContent: 'space-between' }}
                                    button={
                                        <CustomBtn
                                            onClick={() => setStep(step - 1)}
                                            variant="outlined"
                                            icon={<ArrowBackIcon />}
                                            title="Go Back"
                                        />
                                    }
                                />
                                <Grid container spacing={2} mt={3}>
                                    <FlexCard>
                                        <Typography sx={{ fontWeight: 'bold', fontSize: 20, mb: 1 }}>Add the Credit or Debit card details</Typography>
                                        <Grid item md={6} xs={12} mt={5}>
                                            <FlexField
                                                variant="standard"
                                                setValue={setFormData}
                                                name='CardholderName'
                                                as='text'
                                                placeholder="Cardholder Name"
                                                isSubmitted={isSubmitted}
                                                required={true}
                                            />
                                        </Grid>
                                        <Grid item md={6} xs={12} mt={5}>
                                            <FlexField
                                                variant="standard"
                                                setValue={setFormData}
                                                name='CardNumber'
                                                as='number'
                                                placeholder="Card Number"
                                                isSubmitted={isSubmitted}
                                                required={true}
                                            />
                                        </Grid>
                                        <Grid item md={6} xs={12} mt={3}>
                                            <Calendar
                                                label={"Expiry Date"}
                                                setValue={setFormData}
                                                name="ExpiryDate"
                                                minDate={moment().format('MM-DD-YYYY')}
                                                required={true}
                                                isSubmitted={isSubmitted}
                                            />
                                        </Grid>
                                        <Grid item md={6} xs={12} mt={5}>
                                            <FlexField
                                                variant="standard"
                                                setValue={setFormData}
                                                name='CardCVC'
                                                as='number'
                                                placeholder="CVC"
                                                isSubmitted={isSubmitted}
                                                required={true}
                                            />
                                        </Grid>
                                        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                                            <CustomBtn loading={loading} onClick={() => handleOnSubmit()} variant="contained" title={"Save"} />
                                        </div>
                                    </FlexCard>
                                </Grid>
                            </>
                        }
                    </>
                    :
                    <Loader show={isLoaded} />
                }
            </Layout>
            <DialogBox
                open={deleteModal}
                handleClose={() => setDeleteModal(false)}
                title='Delete Payment Method'
            >
                <MessageModal
                    handleClose={() => setDeleteModal(false)}
                    handleRemove={() => deletePaymentMethod.mutate()}
                    removeBtnTitle="Delete"
                    msg={`Do you want to delete this payment method?`}
                />
            </DialogBox>
            <SnackAlert
                show={showSnack}
                type={type}
                handleClose={() => setShowSnack(false)}
                msg={msg}
            />
            <DrawerBox
                anchor={'right'}
                open={menu}
                onClose={() => setMenu(false)}
                sx={{ '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 700, alignItems: 'center', justifyContent: 'space-between' } }}
            >
                <Box sx={{ backgroundColor: '#F5F8FB', padding: 3, width: '100%' }}>
                    <Typography sx={{ fontWeight: 'bolder', fontSize: 20 }}>Set up auto pay</Typography>
                    <Typography>Applicable payments will be debited automatically from your payment method of choice</Typography>
                </Box>
                <FlexCard containerStyle={{ height: '100%', mt: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography sx={{ mb: 2 }}>Payment Method</Typography>
                            <SelectDropdown
                                variant="outlined"
                                setValue={(e) => { setFormData(e); setAutoPay(previousAutoPayment ? !autoPay : false) }}
                                label="Select a payment  method"
                                name="PaymentMethod"
                                data={data?.list}
                                showAll={false}
                                required={true}
                                getPaymentMethod={true}
                                defaultVal={previousAutoPayment?.id}
                                className="paymentmethod-input-label"
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} mt={1} mb={1}>
                        <Grid item xs={6}>
                            <Typography>Auto pay is turned {autoPay ? 'on' : 'off'}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControlLabel
                                disabled={isDisabled}
                                sx={{ float: 'right' }}
                                control={<Switch onChange={(e) => handleToggleAutoPay(e.target.checked)} checked={autoPay} />}
                                label={autoPay ? 'On' : 'Off'}
                            />
                        </Grid>
                    </Grid>
                    <Typography>When auto pay is turned on, Flexscale is authorized to automatically debit your account.</Typography>
                </FlexCard>
                <Box sx={{ backgroundColor: '#F5F8FB', padding: 5, width: '100%', display: 'flex', justifyContent: 'center', }}>
                    <CustomBtn onClick={() => setMenu(false)} variant="outlined" title={"Close"} />
                </Box>
            </DrawerBox>
        </>
    );
}

