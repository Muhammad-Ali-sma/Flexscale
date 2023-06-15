import Head from 'next/head';
import { useRouter } from 'next/router';
import { useMutation } from "react-query";
import { useSelector } from "react-redux";
import React, { useReducer, useState } from 'react';
import { Avatar, Grid, Typography } from '@mui/material';
import { selectAuth } from '../../../../store/authSlice';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import UserService from '../../../../Services/UserService';
import { Layout } from '../../../../components/global/Layout';
import FlexCard from '../../../../components/global/FlexCard';
import { countryList, pronouns } from '../../../../utils/data';
import CustomBtn from '../../../../components/global/CustomBtn';
import FlexField from '../../../../components/global/FlexField';
import DialogBox from '../../../../components/dialogBox/DialogBox';
import { BodyHeader } from '../../../../components/global/BodyHeader';
import SelectDropdown from '../../../../components/global/SelectDropdown';
import { accessLevel, accessLevelInternalManager, INTERNAL_ADMIN, INTERNAL_MANAGER, INTERNAL_USER } from '../../../../utils';
import { formReducer, getUser, getUsersList, s3 } from '../../../../utils/globalFunctions';
import UploadProfileImage from '../../../../components/dialogBox/UploadProfileImage';

const AddOrUpdate = () => {

    const organizations = useSelector(state => state.dataSlice.OrganizationList);
    const [formData, setFormData] = useReducer(formReducer, {});
    const [selectedImage, setSelectedImage] = useState(null);
    const managers = getUser('AccessLevel', INTERNAL_MANAGER.level);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [imageModal, setImageModal] = useState(false);
    const user = useSelector(selectAuth)?.userData;
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);
    const [show, setShow] = useState(false);
    const [title, setTitle] = useState('');
    const [msg, setMsg] = useState('');
    const router = useRouter();


    const addUser = useMutation((formData) => UserService.Register(formData), {
        onSuccess: async (res) => {
            if (res?.success) {
                uploadProfile(res.data._id);
                setIsSubmitted(false);
                setFormData({});
            } else {
                setTitle('Error');
                setMsg(res?.message?.join(', '));
                setShow(true)
                setLoading(false);
            }
        },
        onError: async (error) => {
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

        let orgIds = [];
        if (formData['organization']?.length > 0) {
            formData['organization']?.map(item => {
                orgIds.push(item?._id);
            })
        }
        let managerIds = [];
        if (formData['manager']?.length > 0) {
            formData['manager']?.map(item => {
                managerIds.push(item?._id);
            })
        }
        let temp = {
            ...formData,
            createdBy: user?._id,
            organization: formData['accessLevel'] === INTERNAL_USER.level ? '' : orgIds,
            manager: managerIds
        };
        if (formData['accessLevel'] && formData['firstName'] && formData['lastName']) {
            if ((!formData['email']) && formData['accessLevel'] !== INTERNAL_USER.level) {
                setTitle('Error');
                setMsg('Please fill all the required fields!');
                setShow(true);
                setLoading(false);
                return;
            }
            if (!formData['manager'] && formData['accessLevel'] === INTERNAL_USER.level) {
                setTitle('Error');
                setMsg('Manager is required!');
                setShow(true);
                setLoading(false);
                return;
            }
            addUser.mutate(temp)
        } else {
            setLoading(false);
        }
    }

    const uploadImage = useMutation((data) => UserService.uploadProfileImage(data.id, data), {
        onSettled: (res) => {
            getUsersList();
            if (res?.success) {
                if (user?.AccessLevel === INTERNAL_ADMIN.level || user?.AccessLevel === INTERNAL_MANAGER.level) {
                    router.push('/team')
                } else {
                    router.push('/company-settings')
                }
            } else {
                setTitle('Error');
                setMsg('Image upload failed, please try again!');
                setShow(true)
            }
            setLoading(false);
        }
    });

    const uploadProfile = (id) => {
        if (formData['Method'] === 'URL' && formData['DOCURL'] && formData['DocumentName']) {
            uploadImage.mutate({ id, image: formData['DOCURL'] });
            return;
        }
        if (formData['Method'] === 'Document') {
            s3(id).uploadFile(image, formData['DocumentName'] ?? image?.name)
                .then(data => {
                    console.log(data)
                    if (data?.key) {
                        uploadImage.mutate({ id, image: data?.location });
                    }
                })
                .catch(err => {
                    setTitle('Error');
                    setMsg(err);
                    setShow(true)
                });
            return;
        } else {
            getUsersList();
            if (user?.AccessLevel === INTERNAL_ADMIN.level || user?.AccessLevel === INTERNAL_MANAGER.level) {
                router.push('/team')
            } else {
                router.push('/company-settings')
            }
        }
        setLoading(false);
    }

    return (
        <>
            <Head>
                <title>Team | Flexscale</title>
            </Head>
            <Layout>
                <BodyHeader
                    title={"Add New User"}
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
                        <Grid item xs={12}>
                            <Typography sx={{ fontWeight: 800, marginBottom: 1, fontSize: { xs: "1.4rem", md: "1.7rem" } }}>Complete the form</Typography>
                            <Grid container>
                                <Grid item xs={12} md={6} lg={6}>
                                    <SelectDropdown
                                        variant="standard"
                                        setValue={(e) => { setFormData(e); setIsSubmitted(false); }}
                                        label="Access Level"
                                        name="accessLevel"
                                        getAccessMethods={true}
                                        data={user?.AccessLevel === INTERNAL_ADMIN.level ? accessLevel : (user?.AccessLevel === INTERNAL_MANAGER.level && accessLevelInternalManager)}
                                        showAll={false}
                                        required={true}
                                        isSubmitted={isSubmitted}
                                        helperText="Based on the access level, it will provide access to clients or internal applications."
                                    />
                                </Grid>
                                <Grid item xs={12} md={6} sx={{ flexDirection: 'column', display: 'flex', paddingLeft: 20 }}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <CustomBtn
                                            onClick={() => setImageModal(true)}
                                            variant="contained"
                                            title={"Upload Profile Image"}
                                            btnStyle={{ width: 200, }}
                                        />
                                        {(selectedImage || formData['DOCURL']) && <p style={{ marginLeft: 5 }}>{formData['DocumentName']}</p>}
                                    </div>
                                    <Avatar alt="Remy Sharp" src={formData['DOCURL'] ?? selectedImage} sx={{ width: 70, height: 70, marginTop: 2 }} />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} md={6} lg={6} sx={{ marginTop: -3 }}>
                            <SelectDropdown
                                setValue={setFormData}
                                label="Manager"
                                name="manager"
                                data={managers}
                                defaultVal={managers?.filter(x => x?._id === user?._id)[0]?._id}
                                variant="standard"
                                multiple={true}
                                showId={true}
                            />
                        </Grid>
                        {formData['accessLevel'] !== INTERNAL_USER.level &&
                            <Grid item xs={12} md={6} lg={6}>
                                <SelectDropdown
                                    variant="standard"
                                    setValue={setFormData}
                                    label="Organization(s)"
                                    name="organization"
                                    data={organizations}
                                    required={true}
                                    isSubmitted={isSubmitted}
                                    showAll={false}
                                    multiple={true}
                                />
                            </Grid>
                        }
                        <Grid item xs={12} md={6} lg={6}>
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
                        <Grid item xs={12} md={6} lg={6}>
                            <FlexField
                                placeholder="Preferred First Name"
                                variant="standard"
                                setValue={setFormData}
                                name='preferredName'
                                label="Preferred First Name"
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
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
                        <Grid item xs={12} md={6} lg={6}>
                            <SelectDropdown
                                setValue={setFormData}
                                variant="standard"
                                label="Pronouns"
                                name="gender"
                                data={pronouns}
                                showAll={false}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                            <FlexField
                                placeholder="Email"
                                variant="standard"
                                setValue={setFormData}
                                name='email'
                                as={'email'}
                                label="Email"
                                isSubmitted={isSubmitted}
                                required={formData['accessLevel'] !== INTERNAL_USER.level ? true : false}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
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
                        <Grid item xs={12} md={6} lg={6}>
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
            <DialogBox
                open={imageModal}
                handleClose={() => setImageModal(false)}
                title='Upload image'
                msg={`Upload a document or add a link below:`}
            >
                <UploadProfileImage
                    user={user}
                    handleClose={() => setImageModal(false)}
                    setValue={setFormData}
                    setImage={setImage}
                    setSelectedImage={setSelectedImage}
                />
            </DialogBox>
        </>
    )
}

export default AddOrUpdate;