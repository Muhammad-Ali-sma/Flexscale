import moment from 'moment';
import Head from "next/head";
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import EditIcon from '@mui/icons-material/Edit';
import React, { useReducer, useState } from 'react';
import Loader from '../../../components/global/Loader';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Layout } from '../../../components/global/Layout';
import FlexCard from '../../../components/global/FlexCard';
import Calendar from '../../../components/global/Calendar';
import CustomBtn from '../../../components/global/CustomBtn';
import FlexField from '../../../components/global/FlexField';
import { formReducer, getUser } from '../../../utils/globalFunctions';
import SnackAlert from '../../../components/global/SnackAlert';
import DialogBox from '../../../components/dialogBox/DialogBox';
import PlacementService from '../../../Services/PlacementService';
import { BodyHeader } from '../../../components/global/BodyHeader';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import MessageModal from '../../../components/dialogBox/MessageModal';
import SelectDropdown from '../../../components/global/SelectDropdown';
import { Roles, Skills, timeZones, WorkExperience } from '../../../utils/data';
import { Grid, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';

export default function HiringDetails() {

    const router = useRouter();
    const { id } = router.query;
    const queryClient = useQueryClient();
    const [type, setType] = useState(null);
    const [msg, setMsg] = useState(false);
    const [showSnack, setShowSnack] = useState(false);
    const [isEditable, setIsEditable] = useState(false);
    const [formData, setFormData] = useReducer(formReducer, {});
    const [closeHiringModal, setCloseHiringModal] = useState(false);

    const { data: placement } = useQuery(['getPlacementById'], () => PlacementService.getPlacementById(id), {
        enabled: id ? true : false,
    });
    const creator = getUser('_id', placement?.data?.CreatedBy)[0];

    const updateHiring = useMutation((data) => PlacementService.updatePlacement(id, data), {
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['getPlacementById'] }),
        onSuccess: async (res) => {
            if (res?.success) {
                setMsg("Hiring updated successfully.");
                setIsEditable(false);
                setType('success');
                setShowSnack(true);
            }
        },
        onError: async (error) => {
            setType('error');
            setMsg('Failed please try again!');
            setShowSnack(true);
        }
    })
    const changeHiringStatus = useMutation((data) => PlacementService.updateHiringStatus(id, 'Inactive', data), {
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['getPlacementById'] }),
        onSuccess: async (res) => {
            if (res?.success) {
                setMsg('Hiring closed successfully.');
                setType('success');
                setShowSnack(true);
            }
        },
        onError: async (error) => {
            setType('error');
            setMsg('Failed please try again!');
            setShowSnack(true);
        }
    });
    const handleUpdateHiring = () => {
        let temp = {
            JobTitle: formData['JobTitle'] ? formData['JobTitle'] : placement?.data?.JobTitle,
            Status: placement?.data?.Status,
            StartDate: formData['StartDate'] ? formData['StartDate'] : placement?.data?.StartDate,
            GoLiveDate: placement?.data?.GoLiveDate,
            Role: formData['Role'] ? formData['Role'] : placement?.data?.Role,
            Skills: formData['Skills'] ? formData['Skills'] : placement?.data?.Skills,
            WorkExperience: formData['WorkExperience'] ? formData['WorkExperience'] : placement?.data?.WorkExperience,
            TimeZone: formData['TimeZone'] ? formData['TimeZone'] : placement?.data?.TimeZone
        }
        if (Object.keys(formData)?.length > 0) {
            updateHiring.mutate(temp)
        }
    }

    return (
        <>
            <Head>
                <title>{placement?.data?.JobTitle} | Request | Flexscale</title>
            </Head>
            <Layout>
                <BodyHeader
                    title={`${placement?.data?.JobTitle}`}
                    showAvatar={false}
                    containerStyle={{ justifyContent: 'space-between' }}
                    button={<CustomBtn
                        onClick={() => router.back()}
                        variant="outlined"
                        icon={<ArrowBackIcon />}
                        title="Go Back"
                    />
                    }
                    handleRemove={placement?.data?.Status !== 'Inactive' ? () => setCloseHiringModal(true) : null}
                    removeBtnTitle="Close Request"
                />
                {placement?.data ?
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <FlexCard>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography sx={{ fontWeight: 700, marginBottom: 1, textTransform: 'capitalize', fontSize: { xs: "1.4rem", md: "1.5rem" } }}>Request Details</Typography>
                                    {!isEditable && <CustomBtn onClick={() => setIsEditable(true)} variant="outlined" icon={<EditIcon sx={{ fontSize: 17 }} />} title="Edit" />}
                                </div>
                                {!isEditable ?
                                    <TableContainer component={Paper} sx={{ boxShadow: "none", border: 0 }}>
                                        <Table>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell component="th" sx={{ fontWeight: 700 }}>Status</TableCell>
                                                    <TableCell>{placement?.data?.Status}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" sx={{ fontWeight: 700 }}>Job Title</TableCell>
                                                    <TableCell>{placement?.data?.JobTitle}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" sx={{ fontWeight: 700 }}>Role</TableCell>
                                                    <TableCell>{placement?.data?.Role}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" sx={{ fontWeight: 700 }}>Skills</TableCell>
                                                    <TableCell>{placement?.data?.Skills?.length > 0 && placement?.data?.Skills?.map((x, i) => x?.Name ?? x + (placement?.data?.Skills[i + 1] ? ", " : ""))}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" sx={{ fontWeight: 700 }}>Ideal Start Date</TableCell>
                                                    <TableCell>{moment(placement?.data?.StartDate).format('MM-DD-YYYY')}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" sx={{ fontWeight: 700 }}>Work Experience</TableCell>
                                                    <TableCell>{placement?.data?.WorkExperience}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" sx={{ fontWeight: 700 }}>Required Time Zone</TableCell>
                                                    <TableCell>{placement?.data?.TimeZone}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" sx={{ fontWeight: 700 }}>Created Date</TableCell>
                                                    <TableCell>{moment(placement?.data?.createdAt).format('MM-DD-YYYY')}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" sx={{ fontWeight: 700 }}>Created By</TableCell>
                                                    <TableCell>{creator?.FirstName} {creator?.LastName}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" sx={{ fontWeight: 700 }}>Request ID</TableCell>
                                                    <TableCell>{placement?.data?._id}</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    :
                                    <>
                                        <Grid item xs={12} sx={{ mb: 1 }}>
                                            <FlexField
                                                placeholder="Job Title"
                                                variant="standard"
                                                setValue={setFormData}
                                                name='JobTitle'
                                                label="Job Title"
                                                required={true}
                                                defaultVal={placement?.data?.JobTitle}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sx={{ mb: 3 }}>
                                            <SelectDropdown
                                                variant="standard"
                                                setValue={setFormData}
                                                label="Role"
                                                name="Role"
                                                required={true}
                                                defaultVal={{ title: placement?.data?.Role }}
                                                data={Roles}
                                                searchable={true}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sx={{ mb: 1 }}>
                                            <SelectDropdown
                                                variant="standard"
                                                setValue={setFormData}
                                                label="Skills"
                                                name="Skills"
                                                required={true}
                                                showAll={false}
                                                getId={true}
                                                multiple={true}
                                                defaultVal={placement?.data?.Skills}
                                                data={Skills}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sx={{ mb: 3 }}>
                                            <Calendar
                                                label={"Start Date"}
                                                setValue={setFormData}
                                                name="StartDate"
                                                defaultVal={placement?.data?.StartDate}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sx={{ mb: 3 }}>
                                            <SelectDropdown
                                                variant="standard"
                                                setValue={setFormData}
                                                label="Work Experience"
                                                name="WorkExperience"
                                                data={WorkExperience}
                                                showAll={false}
                                                required={true}
                                                defaultVal={placement?.data?.WorkExperience}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <SelectDropdown
                                                variant="standard"
                                                setValue={setFormData}
                                                label="Time Zone"
                                                name="TimeZone"
                                                data={timeZones}
                                                showAll={false}
                                                required={true}
                                                searchable={true}
                                                defaultVal={placement?.data?.TimeZone ? { title: placement?.data?.TimeZone } : null}
                                            />
                                        </Grid>

                                        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                                            <CustomBtn onClick={() => setIsEditable(false)} btnStyle={{ marginRight: 1 }} variant="outlined" title={"Cancel"} />
                                            <CustomBtn onClick={() => { handleUpdateHiring() }} variant="contained" title={"Save"} />
                                        </div>
                                    </>
                                }
                            </FlexCard>
                        </Grid>
                    </Grid>
                    :
                    <Loader show={!placement?.data ? true : false} />
                }
            </Layout>
            <SnackAlert
                show={showSnack}
                type={type}
                handleClose={(event, reason) => setShowSnack(false)}
                msg={msg}
            />
            <DialogBox
                open={closeHiringModal}
                handleClose={() => setCloseHiringModal(false)}
                title='Close this hiring request'
            >
                <MessageModal
                    handleClose={() => setCloseHiringModal(false)}
                    msg={`Are you sure you want to close this hiring request?\n\nClosing this request will stop hiring for this role, and remove any candidates that are currently interviewing for the role. This cannot be reversed.`}
                    handleRemove={() => { changeHiringStatus.mutate({ placement: placement?.data, Creator: creator }); setCloseHiringModal(false) }}
                    removeBtnTitle="Close"
                    closeBtnTitle="Cancel"
                />
            </DialogBox>
        </>
    );
}
