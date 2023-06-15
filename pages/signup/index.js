import Head from "next/head";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { useMutation } from "react-query";
import { CLIENT_SUPER_ADMIN } from "../../utils";
import { useReducer, useState } from "react";
import { countryList } from "../../utils/data";
import Loader from "../../components/global/Loader";
import Footer from "../../components/global/Footer";
import UserService from "../../Services/UserService";
import { Box, Grid, Typography } from "@mui/material";
import CustomBtn from "../../components/global/CustomBtn";
import FlexField from "../../components/global/FlexField";
import { formReducer } from "../../utils/globalFunctions";
import SigninNav from "../../components/global/SigninNav";
import DialogBox from "../../components/dialogBox/DialogBox";
import { loginAuth, setOrganization } from "../../store/authSlice";
import SelectDropdown from "../../components/global/SelectDropdown";
import OrganizationService from "../../Services/OrganizationService";



const Singup = () => {

    const [formData, setFormData] = useReducer(formReducer, {});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const dispatch = useDispatch();
    const router = useRouter();

    const handleSubmit = () => {
        setIsSubmitted(true);
        if (formData['firstName'] && formData['lastName'] && formData['Name'] && formData['country']) {
            setLoading(true);
            let temp = {
                Name: formData['Name'],
                country: formData['country'],
                OrganizationType: 'Client'
            }
            addOrg.mutate(temp);
        }
    }
    const addOrg = useMutation((formData) => OrganizationService.createOrganization(formData), {
        onSettled: (res) => {
            if (res?.success) {
                let temp = {
                    firstName: formData['firstName'],
                    lastName: formData['lastName'],
                    organization: [res?.data?._id],
                    token: router.query.token,
                    accessLevel: CLIENT_SUPER_ADMIN.level
                }
                registerUser.mutate(temp);
            } else {
                setShow(true);
                setLoading(false);
                setIsSubmitted(false);
            }
        }
    })
    const registerUser = useMutation((formData) => UserService.Register(formData), {
        onSettled: (res) => {
            if (res?.success) {
                let tempUser = res?.data;
                tempUser.token = res?.token;
                dispatch(setOrganization({ org: res?.data?.Organization[0] }));
                dispatch(loginAuth({ userData: tempUser }));
                router.push('/hiring/addnew')
                setIsSubmitted(false);
                setFormData({});
            } else {
                setShow(true)
            }
            setLoading(false);
        }
    });

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <SigninNav />
                <Box component="main" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1, px: { xs: 3, sm: 4, md: 8 }, py: 3, mt: { md: 4, xs: 14, sm: 10 }, width: { xs: '100%', sm: `calc(100% - 530px)` } }}>
                    <Head>
                        <title>Sign up | Flexscale</title>
                    </Head>
                    <Grid container spacing={2} sx={{ justifyContent: 'center', display: 'flex', textAlign: 'center', mt: 10 }}>
                        <Grid item lg={7} md={12} sm={8} xs={12}>
                            <Typography sx={{ fontWeight: "bolder", fontSize: { lg: '2rem', md: "1.7rem", sm: "1.7rem", xs: "1.6rem" } }}>Create a new account</Typography>
                            <Typography sx={{ marginBottom: 5 }}>After completing the form below, we will walk you through requesting your first hire.</Typography>
                        </Grid>
                        <Grid item lg={7} md={12} sm={8} xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ width: '45%' }}>
                                <FlexField
                                    as={"text"}
                                    setValue={setFormData}
                                    required={true}
                                    isSubmitted={isSubmitted}
                                    name="firstName"
                                    placeholder="First Name"
                                    variant="standard"
                                />
                            </Box>
                            <Box sx={{ width: '45%' }}>
                                <FlexField
                                    as={"text"}
                                    setValue={setFormData}
                                    required={true}
                                    isSubmitted={isSubmitted}
                                    name="lastName"
                                    variant="standard"
                                    placeholder="Last Name"
                                />
                            </Box>
                        </Grid>
                        <Grid item lg={7} md={12} sm={8} xs={12}>
                            <FlexField
                                as={"text"}
                                setValue={setFormData}
                                required={true}
                                isSubmitted={isSubmitted}
                                name="Name"
                                variant="standard"
                                placeholder="What's your company's name?"
                            />
                        </Grid>
                        <Grid item lg={7} md={12} sm={8} xs={12}>
                            <SelectDropdown
                                variant="standard"
                                setValue={setFormData}
                                name="country"
                                required={true}
                                isSubmitted={isSubmitted}
                                showAll={false}
                                searchable={true}
                                label="Where are you located?"
                                data={countryList}
                            />
                        </Grid>
                    </Grid>
                    <Grid container sx={{ marginTop: 5, display: 'flex', justifyContent: 'center' }}>
                        <Grid item lg={2} md={4} sm={4} xs={6}>
                            <CustomBtn
                                onClick={() => handleSubmit()}
                                btnStyle={{ width: '100%' }}
                                variant="contained"
                                title={'Continue'}
                            />
                        </Grid>
                    </Grid>
                </Box>
                <Footer />
            </Box>
            <Loader
                show={loading}
            />
            <DialogBox
                open={show}
                handleClose={() => setShow(false)}
                msg={'Error occured please try again!'}
                title={'Error'}
            />
        </>
    )
}

export default Singup