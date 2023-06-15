import Link from "next/link";
import Head from "next/head";
import { useState } from "react";
import theme from "../../utils/theme";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import { INTERNAL_ADMIN, INTERNAL_MANAGER } from "../../utils";
import { store } from "../../store/store";
import { useEffect, useReducer } from "react";
import ErrorIcon from '@mui/icons-material/Error';
import Loader from "../../components/global/Loader";
import { Box, Container, Grid } from "@mui/material";
import UserService from "../../Services/UserService";
import { useDispatch, useSelector } from "react-redux";
import CustomBtn from "../../components/global/CustomBtn";
import { formReducer } from "../../utils/globalFunctions";
import FlexField from "../../components/global/FlexField";
import DialogBox from "../../components/dialogBox/DialogBox";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { loginAuth, selectAuth, setOrganization } from "../../store/authSlice";


export default function Login() {

    const [loginByPassword, setLoginByPassword] = useState(false);
    const [formData, setFormData] = useReducer(formReducer, {});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [tokenErr, setTokenErr] = useState(false);
    const [loading, setLoading] = useState(false);
    const [verified, setVerified] = useState('')
    const authState = useSelector(selectAuth);
    const [show, setShow] = useState(false);
    const [title, setTitle] = useState("");
    const [msg, setMsg] = useState("");
    const dispatch = useDispatch();
    const router = useRouter();


    const login = useMutation((newData) => UserService.Login(newData), {
        onSuccess: async (res) => {
            if (res?.success) {
                const tempUser = res?.user;
                tempUser.token = res?.token;
                dispatch(loginAuth({ userData: tempUser }));
            } else {
                setTitle("Error");
                setMsg([res?.message]?.join(", "));
                setShow(true);
            }
            setIsSubmitted(false);
            setLoading(false);
        },
        onError: async () => {
            setIsSubmitted(false);
            setLoading(false);
        }
    });
    const loginByEmail = useMutation((email) => UserService.loginByEmail(email), {
        onSuccess: async (res) => {
            if (res.success) {
                setTitle("Success");
                setMsg(res?.message);
                setShow(true);
            } else {
                setTitle("Error");
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
            if (res.success) {
                const tempUser = res?.user;
                tempUser.token = res?.token;
                dispatch(loginAuth({ userData: tempUser }));
            } else {
                setTokenErr(true);
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
                setVerified('success')
            } else {
                setVerified('error');
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

    useEffect(() => {
        if (router.query?.token) {
            verifyToken.mutate(router.query?.token)
        }
    }, [router.query?.token])

    useEffect(() => {
        // redirect to home if already logged in
        if (authState?.token && authState.token !== null) {
            const returnUrl = (authState?.userData.AccessLevel !== INTERNAL_ADMIN.level && authState?.userData.AccessLevel !== INTERNAL_MANAGER.level) ?
                (authState?.userData.Organization?.length > 1 ? router.push('/set-organization') : '/team') : '/organization';
            if (authState?.userData.Organization?.length === 1 && authState?.userData.AccessLevel !== INTERNAL_ADMIN.level && authState?.userData.AccessLevel !== INTERNAL_MANAGER.level) {
                dispatch(setOrganization({ org: authState?.userData.Organization[0] }));
            }
            router.push(returnUrl);
        }
    }, [authState]);

    const loginUser = (e) => {
        //API will be here
        e.preventDefault();
        setIsSubmitted(true);
        if (formData['Email'] && formData['Password'] && loginByPassword) {
            setLoading(true);
            login.mutate(formData);
        } else if (formData['Email'] && !loginByPassword && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData['Email'])) {
            setLoading(true);
            loginByEmail.mutate({ Email: formData['Email'] });
        }
    }


    return (
        <>
            <div style={{ width: '100%', heigh: '100%', backgroundColor: theme.palette.primary.main }}>
                <Head>
                    <title>Login</title>
                </Head>
                <Container className="home-page">
                    <div className="login-box">
                        <Grid>
                            <div className="login-form">
                                {router.query?.token && verified ?
                                    verified === 'success' ?
                                        <div className="login-dialog-box">
                                            <CheckCircleIcon sx={{ height: 200, width: 300, color: 'green' }} />
                                            <h1>Logged In Successfully</h1>
                                        </div>
                                        :
                                        <div className="login-dialog-box">
                                            <ErrorIcon sx={{ height: 200, width: 300, color: 'red' }} />
                                            <h1>Login link expired!</h1>
                                        </div>
                                    :
                                    <>
                                        <img src='/assets/images/Flexscale Wordmark 1.svg' />
                                        <p className="login-helper">Enter your email to sign in or create an account.</p>
                                        <Box
                                            component="form"
                                            noValidate
                                            autoComplete="off"
                                            onSubmit={(e) => loginUser(e)}
                                        >
                                            <FlexField as={"email"} setValue={setFormData} required={true} isSubmitted={isSubmitted} name="Email" label="Email" placeholder="name@email.com" />
                                            {
                                                loginByPassword &&
                                                <FlexField as={"password"} setValue={setFormData} required={true} isSubmitted={isSubmitted} name="Password" label="Password" />
                                            }
                                            <CustomBtn
                                                variant="contained"
                                                onClick={loginUser}
                                                title="Continue"
                                                btnStyle={{ width: '100%' }}
                                                type="submit"
                                            />
                                        </Box>
                                        <Grid container>
                                            {
                                                loginByPassword ?
                                                    <Grid item xs={6} sx={{ textAlign: 'left' }}><a role="button" className="cursor-pointer" onClick={() => setLoginByPassword(false)}>Sign in by email</a></Grid>
                                                    :
                                                    <Grid item xs={6} sx={{ textAlign: 'left' }}><a role="button" className="cursor-pointer" onClick={() => setLoginByPassword(true)}>Sign in by password</a></Grid>
                                            }
                                            <Grid item xs={6} sx={{ textAlign: 'right' }}><Link href={"/forget-password"}>Forgot password?</Link></Grid>
                                        </Grid>
                                    </>
                                }
                            </div>
                        </Grid>
                    </div>
                </Container >
            </div>
            <Loader
                show={loading}
            />
            <DialogBox
                open={show}
                handleClose={() => setShow(false)}
                msg={msg}
                title={title}
            />
            <DialogBox
                open={tokenErr}
                handleClose={() => { setTokenErr(false); router.push('/login') }}
                msg={"Login link expired!"}
                title={'Error'}
            />
        </>
    );
}
