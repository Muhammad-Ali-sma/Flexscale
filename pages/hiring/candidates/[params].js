import Head from "next/head";
import * as React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import { Person } from '@mui/icons-material';
import DoneIcon from '@mui/icons-material/Done';
import { selectAuth } from '../../../store/authSlice';
import { DocumentColumns } from '../../../utils/data';
import Loader from '../../../components/global/Loader';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FlexCard from '../../../components/global/FlexCard';
import { Layout } from '../../../components/global/Layout';
import CustomBtn from '../../../components/global/CustomBtn';
import SnackAlert from '../../../components/global/SnackAlert';
import DialogBox from '../../../components/dialogBox/DialogBox';
import ContractService from '../../../Services/ContractService';
import PlacementService from '../../../Services/PlacementService';
import { BodyHeader } from '../../../components/global/BodyHeader';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import MessageModal from '../../../components/dialogBox/MessageModal';
import ProfileSection from '../../../components/global/ProfileSection';
import { tabProps, TabPanel } from '../../../components/global/TabPanel';
import AgentStatusChip from '../../../components/global/AgentStatusChip';
import { Box, Grid, Paper, Tab, Table, TableBody, TableCell, TableContainer, TableRow, Tabs, Typography } from '@mui/material';

export default function HiringUserDetails() {
    const router = useRouter()
    const { params } = router.query;
    const queryClient = useQueryClient();
    const [type, setType] = useState(null);
    const [msg, setMsg] = useState(false);
    const user = useSelector(selectAuth)?.userData;
    const [showSnack, setShowSnack] = useState(false);
    const [hireCandidateModal, setHireCandidateModal] = useState(false);
    const [rejectCandidateModal, setRejectCandidateModal] = useState(false);



    const { data } = useQuery(['getCandidateById'], () => PlacementService.getCandidateById(params?.split('&')[0]), {
        enabled: params?.split('&')[0] ? true : false,
    });
    const { data: placement } = useQuery(['getPlacementById'], () => PlacementService.getPlacementById(params?.split('&')[1]), {
        enabled: params?.split('&')[1] ? true : false,
    });
    const handleCreateContract = () => {
        updateCandidateStatus.mutate({ Status: 'Hired', placement: placement?.data, Candidate: data?.candidate?.candidateId?.FirstName + " " + data?.candidate?.candidateId?.LastName });
        let temp = {
            JobTitle: placement?.data?.JobTitle,
            CreatedBy: user?._id,
            StartDate: placement?.data?.StartDate,
            GoLiveDate: placement?.data?.GoLiveDate,
            EndDate: placement?.data?.GoLiveDate?.EndDate,
            Organization: placement?.data?.Organization,
            User: data?.candidate?.candidateId,
            Placement: placement?.data,
            TypeofEmployment: placement?.data?.TypeofEmployment,
            WorkHoursPerWeek: placement?.data?.WorkHoursPerWeek,
            RatePerHour: placement?.data?.RatePerHour,
            NoOfPaidTimeOffDays: placement?.data?.NoOfPaidTimeOffDays,
            prevIds: placement?.data?.Contracts?.map(x => x?._id),
            userContractIds: data?.candidate?.candidateId?.Contracts?.map(x => x),
            prevOrganizationsIds: data?.candidate?.candidateId?.Organization?.map(x => x)
        }
        createContract.mutate(temp);
    }
    const createContract = useMutation((data) => ContractService.Create(data), {
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['getCandidateById'] }),
        onSuccess: async (res) => {
            if (res?.success) {
                setHireCandidateModal(false);
            }
        },
        onError: async (error) => {
            console.log(error);
            setType('error');
            setMsg('Failed please try again!');
            setShowSnack(true);
        }
    })
    const updateCandidateStatus = useMutation((formData) => PlacementService.updateCandidateStatus(data?.candidate?._id, formData), {
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['getPlacementById'] }),
        onSuccess: async (res) => {
            if (res?.success) {
                setMsg("Status updated successfully.");
                setType('success');
                setShowSnack(true);
                setRejectCandidateModal(false);
            } else {
                setType('error');
                setMsg('Failed please try again!');
                setShowSnack(true);
            }
        },
        onError: async (error) => {
            console.log(error);
            setType('error');
            setMsg('Failed please try again!');
            setShowSnack(true);
        }
    })

    return (
        <>
            <Head>
                <title> {data?.candidate?.candidateId?.PreferredName ?? data?.candidate?.candidateId?.FirstName} | Candidate | Flexscale</title>
            </Head>
            <Layout>
                {data ?
                    <>
                        <BodyHeader
                            title={`${data?.candidate?.candidateId ? data?.candidate?.candidateId?.FirstName : ''} ${data?.candidate?.candidateId ? data?.candidate?.candidateId?.LastName : ''}`}
                            showAvatar={true}
                            containerStyle={{ justifyContent: 'space-between' }}
                            button={<CustomBtn
                                onClick={() => router.back()}
                                variant="outlined"
                                icon={<ArrowBackIcon />}
                                title="Go Back"
                            />}
                            btnIcon={<DoneIcon />}
                            handleOnHire={data?.candidate?.candidateStatus !== 'Hired' ? () => setHireCandidateModal(true) : null}
                            handleOnReject={(data?.candidate?.candidateStatus !== 'Rejected' && data?.candidate?.candidateStatus !== 'Hired') ? () => setRejectCandidateModal(true) : null}
                        />
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={9} lg={8}>
                                <ProfileSection title="Basics" icon={<Person sx={{ color: "#2196F3" }} />} iconBg="#EEF7FE">
                                    <TableContainer component={Paper} sx={{ boxShadow: "none", border: 0 }}>
                                        <Table>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell component="th" sx={{ fontWeight: 700 }}>Full Name</TableCell>
                                                    <TableCell>{data?.candidate?.candidateId?.FirstName} {data?.candidate?.candidateId?.LastName}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" sx={{ fontWeight: 700 }}>Preferred Name</TableCell>
                                                    <TableCell>{data?.candidate?.candidateId?.PreferredName}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" sx={{ fontWeight: 700 }}>Pronouns</TableCell>
                                                    <TableCell>{data?.candidate?.candidateId?.Gender}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" sx={{ fontWeight: 700 }}>Email</TableCell>
                                                    <TableCell>{data?.candidate?.candidateId?.Email}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" sx={{ fontWeight: 700 }}>Location</TableCell>
                                                    <TableCell>{data?.candidate?.candidateId?.Location}</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </ProfileSection>
                            </Grid>
                            <Grid item xs={12} md={3} lg={4}>
                                <FlexCard>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography sx={{ fontWeight: 800, fontSize: "1rem", mb: 0.5 }}>Interviewing for</Typography>
                                        <Typography variant='body2'>{placement?.data?.JobTitle}</Typography>
                                    </Box>
                                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <Typography sx={{ fontWeight: 800, fontSize: "1rem", mb: 0.5 }}>Status</Typography>
                                            <AgentStatusChip status={data?.candidate?.candidateStatus} />
                                        </div>
                                    </Box>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography sx={{ fontWeight: 800, fontSize: "1rem", mb: 0.5 }}>Country</Typography>
                                        <Typography variant='body2'>{data?.candidate?.candidateId?.Location}</Typography>
                                    </Box>
                                </FlexCard>
                            </Grid>
                        </Grid>
                    </>
                    :
                    <Loader show={!data ? true : false} />
                }
                {data?.candidate?.candidateId?.Documents?.length > 0 &&
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={9} lg={8}>
                            <Box sx={{ width: '100%', background: "white" }}>
                                <DataGrid
                                    autoHeight={true}
                                    showColumnRightBorder={false}
                                    rows={data?.candidate?.candidateId?.Documents ?? []}
                                    columns={DocumentColumns}
                                    hideFooterSelectedRowCount={true}
                                    pageSize={5}
                                    editMode='row'
                                    rowsPerPageOptions={[5]}
                                    getRowId={(row) => row._id}
                                    onCellClick={(params) => {
                                        if (params.field === 'Action') {
                                            window.open(`${params.row.Location}`, '_blank');
                                        }
                                    }}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                }
            </Layout>
            <DialogBox
                open={hireCandidateModal}
                handleClose={() => setHireCandidateModal(false)}
                title='Hire this candidate'
            >
                <MessageModal
                    handleClose={() => setHireCandidateModal(false)}
                    handleSave={handleCreateContract}
                    closeBtnTitle="Cancel"
                    saveBtnTitle={"Confirm"}
                    msg={`Please confirm if you would like to accept and hire this candidate.\n\nConfirming this will notify your Account Manager to begin the onboarding process. This will not stop hiring for this role and this action can be reversed by your Account Manager.`}
                />
            </DialogBox>
            <DialogBox
                open={rejectCandidateModal}
                handleClose={() => setRejectCandidateModal(false)}
                title='Reject this candidate'
            >
                <MessageModal
                    handleClose={() => setRejectCandidateModal(false)}
                    handleRemove={() => updateCandidateStatus.mutate({ Status: 'Rejected', placement: placement?.data, Candidate: data?.candidate?.candidateId?.FirstName + " " + data?.candidate?.candidateId?.LastName })}
                    removeBtnTitle="Reject"
                    closeBtnTitle="Cancel"
                    saveBtnTitle={"Confirm"}
                    msg={`Are you sure you want to reject this candidate?\n\nThe candidate will not be considered for this role and will be removed from your dashboard. This will not stop hiring for this role and this action can be reversed by your Account Manager.`}
                />
            </DialogBox>
            <SnackAlert
                show={showSnack}
                type={type}
                handleClose={(event, reason) => setShowSnack(false)}
                msg={msg}
            />
        </>
    );
}
