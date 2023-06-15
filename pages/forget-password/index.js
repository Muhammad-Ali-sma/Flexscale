import Head from "next/head";
import { useState } from "react";
import theme from "../../utils/theme";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import { store } from "../../store/store";
import { useEffect, useReducer } from "react";
import Loader from "../../components/global/Loader";
import UserService from "../../Services/UserService";
import { formReducer } from "../../utils/globalFunctions";
import FlexField from "../../components/global/FlexField";
import DialogBox from "../../components/dialogBox/DialogBox";
import CustomBtn from "../../components/global/CustomBtn";
import { loginAuth, logoutAuth } from "../../store/authSlice";
import { Box, Container, Grid, Typography } from "@mui/material";

export default function ForgetPassword() {

    const [showEmailScreen, setShowEmailScreen] = useState(false);
    const [formData, setFormData] = useReducer(formReducer, {});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [tokenErr, setTokenErr] = useState(false);
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [title, setTitle] = useState("");
    const [email, setEmail] = useState("");
    const [msg, setMsg] = useState("");
    const router = useRouter();

    const forgetPass = useMutation((data) => UserService.forgetPass(data), {
        onSuccess: async (res) => {
            if (res?.success) {
                setShowEmailScreen(true)
            } else {
                setTitle('Error');
                setMsg(res?.message);
                setShow(true);
            }
            setIsSubmitted(false);
            setLoading(false);
        },
        onError: async (error) => {
            setIsSubmitted(false);
            setLoading(false);
        }
    });
    const changePass = useMutation((data) => UserService.changePass(data), {
        onSuccess: async (res) => {
            if (res?.success) {
                store.dispatch(logoutAuth());
                setTokenErr(true);
            } else {
                setTitle('Error');
                setMsg(res?.message);
                setShow(true);
            }
            setIsSubmitted(false);
            setLoading(false);
        },
        onError: async (error) => {
            setIsSubmitted(false);
            setLoading(false);
        }
    });
    const verifyLink = useMutation(() => UserService.verifyLink(), {
        onSuccess: async (res) => {
            if (res?.success) {
                setEmail(res?.user?.Email);
            } else {
                setTitle('Error');
                setMsg("Token Expired!");
                setShow(true);
            }
            setIsSubmitted(false);
            setLoading(false);
        },
        onError: async (error) => {
            setIsSubmitted(false);
            setLoading(false);
        }
    });
    const verifyToken = useMutation((token) => UserService.verifyToken(token), {
        onSuccess: async (res) => {
            if (res.success) {
                let temp = { token: res?.token };
                store.dispatch(loginAuth({ userData: temp }));
                verifyLink.mutate();
            } else {
                setTitle('Error');
                setMsg(res?.message);
                setShow(true);
                router.push('/login')
            }
            setIsSubmitted(false);
            setLoading(false);
        },
        onError: async (error) => {
            console.log(error);
            setIsSubmitted(false);
            setLoading(false);
        }
    });

    const handleOnSubmit = (e) => {
        e.preventDefault();
        setIsSubmitted(true);
        if (formData['Email'] && !formData['NPassword']) {
            setLoading(true);
            forgetPass.mutate(formData);
        }
        if (router.query?.token && formData['NPassword'] && formData['CPassword']) {
            setLoading(true);
            if (formData['NPassword'] === formData['CPassword']) {
                let Temp = {
                    CPassword: formData['CPassword'],
                    Email: email
                }
                changePass.mutate(Temp);
            } else {
                setTitle("Error");
                setMsg("Password Not Match!");
                setShow(true);
                setLoading(false);
            }
        }
    }

    useEffect(() => {
        if (router.query?.token) {
            verifyToken.mutate(router.query?.token);
        }
    }, [router.query?.token])

    return (
        <>
            <div style={{ width: '100%', heigh: '100%', backgroundColor: theme.palette.primary.main }}>
                <Head>
                    <title>Forgot Password | Flexscale</title>
                </Head>
                <Container className="home-page">
                    <div className="login-box">
                        <Grid>
                            <div className="login-form">
                                <img src='/assets/images/Flexscale Wordmark 1.svg' />
                                {
                                    !showEmailScreen ?
                                        <>
                                            <p>{!router.query?.token ? "Enter your email" : "Enter a new password"}</p>
                                            <Box
                                                component="form"
                                                noValidate
                                                autoComplete="off"
                                                onSubmit={(e) => handleOnSubmit(e)}
                                            >
                                                {!router.query?.token ?
                                                    <FlexField as={"email"} isSubmitted={isSubmitted} setValue={setFormData} required={true} name="Email" label="Email" placeholder="name@email.com" />
                                                    :
                                                    <>
                                                        <FlexField as={"password"} isSubmitted={isSubmitted} setValue={setFormData} required={true} name="NPassword" label="New Password" />
                                                        <FlexField as={"password"} isSubmitted={isSubmitted} setValue={setFormData} required={true} name="CPassword" label="Confirm Password" />
                                                    </>
                                                }
                                                <CustomBtn
                                                    variant="contained"
                                                    onClick={handleOnSubmit}
                                                    title="Continue"
                                                    btnStyle={{ width: '100%' }}
                                                    type="submit"
                                                />
                                                <Typography variant="p" className="cursor-pointer" onClick={() => router.push('/login')}>
                                                    Return to Sign In
                                                </Typography>
                                            </Box>
                                        </>
                                        :
                                        <>
                                            <Typography variant="h4">
                                                Check your email
                                            </Typography>
                                            <Typography variant="p" component={"p"} sx={{ mt: 3, fontSize: 14 }}>
                                                We’ve emailed a link to <b>{formData['Email']}</b> to confirm your address. Click the link to reset your password.
                                                <br />
                                                <br />
                                                Wrong email? <a className="cursor-pointer" style={{ textDecoration: 'underline' }} onClick={() => setShowEmailScreen(false)}>Please re-enter your address.</a>
                                            </Typography>
                                        </>
                                }

                            </div>
                        </Grid>
                    </div>
                </Container >
            </div >
            <Loader
                show={loading}
            />
            <DialogBox
                open={show}
                handleClose={() => { setShow(false); }}
                msg={msg}
                title={title}
            />
            <DialogBox
                open={tokenErr}
                handleClose={() => { setTokenErr(false); router.push('/login') }}
                msg={"Password Updated Successfully, please login."}
                title={'Success'}
            />
        </>
    );
}
