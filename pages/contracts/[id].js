import moment from 'moment';
import Head from "next/head";
import { useEffect, useState } from 'react';
import { useReducer } from 'react';
import { useRouter } from 'next/router';
import EditIcon from '@mui/icons-material/Edit';
import Loader from '../../components/global/Loader';
import { Layout } from '../../components/global/Layout';
import FlexCard from '../../components/global/FlexCard';
import Calendar from '../../components/global/Calendar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CustomBtn from '../../components/global/CustomBtn';
import FlexField from '../../components/global/FlexField';
import SnackAlert from '../../components/global/SnackAlert';
import DialogBox from '../../components/dialogBox/DialogBox';
import ContractService from '../../Services/ContractService';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { BodyHeader } from '../../components/global/BodyHeader';
import MessageModal from '../../components/dialogBox/MessageModal';
import { useMutation, useQuery, useQueryClient } from "react-query";
import SelectDropdown from '../../components/global/SelectDropdown';
import { formatNum, formReducer, getUser } from '../../utils/globalFunctions';
import ContractStatusModal from '../../components/dialogBox/ContractStatusModal';
import { Grid, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';


export default function ContractDetails() {

    const router = useRouter()
    const { id } = router.query;
    const queryClient = useQueryClient();
    const [type, setType] = useState(null);
    const [msg, setMsg] = useState(false);
    const [showSnack, setShowSnack] = useState(false);
    const [isEditable, setIsEditable] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [statusModal, setStatusModal] = useState(false);
    const [formData, setFormData] = useReducer(formReducer, {});


    const { data: contract } = useQuery(['getContractById'], () => ContractService.getContractById(id), {
        enabled: id ? true : false
    });
    const creator = getUser('_id', contract?.data?.CreatedBy)[0];

    const updateContract = useMutation((data) => ContractService.updateContract(id, data), {
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['getContractById'] }),
        onSuccess: async (res) => {
            if (res?.success) {
                setMsg("Contract updated successfully.");
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
    const UpdateContractStatus = useMutation((data) => ContractService.updateContractStatus(id, contract?.data?.User?._id, data), {
        onSuccess: async (res) => {
            if (res?.success) {
                router.back();
            } else {
                setType('error');
                setMsg('Failed please try again!');
                setShowSnack(true);
            }
        },
        onError: async (error) => {
            setType('error');
            setMsg('Failed please try again!');
            setShowSnack(true);
        }
    })
    const handleUpdateContract = () => {

        let temp = {
            JobTitle: formData['JobTitle'] ? formData['JobTitle'] : contract?.data?.JobTitle,
            User: contract?.data?.User?._id,
            Status: formData['Status'] ? formData['Status'] : contract?.data?.Status,
            StartDate: formData['StartDate'] ? formData['StartDate'] : contract?.data?.StartDate,
            GoLiveDate: formData['GoLiveDate'] ? formData['GoLiveDate'] : contract?.data?.GoLiveDate,
            EndDate: formData['EndDate'] ? formData['EndDate'] : contract?.data?.EndDate,
            TypeofEmployment: formData['TypeofEmployment'] ? formData['TypeofEmployment'] : contract?.data?.TypeofEmployment,
            WorkHoursPerWeek: formData['WorkHoursPerWeek'] ? formData['WorkHoursPerWeek'] : contract?.data?.WorkHoursPerWeek,
            RatePerHour: formData['RatePerHour'] ? formData['RatePerHour'] : contract?.data?.RatePerHour,
            NoOfPaidTimeOffDays: formData['NoOfPaidTimeOffDays'] ? formData['NoOfPaidTimeOffDays'] : contract?.data?.NoOfPaidTimeOffDays,
        }
        if (Object.keys(formData)?.length > 0) {
            updateContract.mutate(temp)
        }
    }
    const handleUpdateContractStatus = () => {
        let tempIds = [];
        contract?.data?.User?.Organization?.filter(x => {
            if (contract?.data?.Organization?._id !== x._id) {
                tempIds.push(x);
                return;
            }
        })
        let temp = {
            Organization: contract?.data?.User?.Organization?.filter(x => x !== contract?.data?.Organization?._id),
            Contracts: contract?.data?.User?.Contracts?.filter(x => x !== contract?.data?._id)
        }
        UpdateContractStatus.mutate(temp);
        setDeleteModal(false);
    }
    useEffect(() => {
        let timer = setTimeout(() => {
            if (!contract) {
                router.push('/contracts')
            }
        }, 500);
        return () => {
            clearTimeout(timer);
        }
    }, [])

    return (
        <>
            <Head>
                <title>Contracts | Flexscale</title>
            </Head>
            <Layout>
                <BodyHeader
                    title={contract?.data?.JobTitle}
                    subtitle={contract?.data?.Organization?.Name}
                    showAvatar={false}
                    containerStyle={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}
                    button={
                        <CustomBtn
                            onClick={() => router.back()}
                            variant="outlined"
                            icon={<ArrowBackIcon />}
                            title="Go Back"
                        />
                    }
                    handleRemove={contract?.data?.Status !== "Ended" ? () => { setDeleteModal(true) } : null}
                    removeBtnTitle="End Contract"
                    firstBtnTitle={'Update Status'}
                    handleOnHire={() => setStatusModal(true)}
                />
                {contract ?
                    <>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={12} lg={12}>
                                <FlexCard>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography sx={{ fontWeight: 800, marginBottom: 1, fontSize: { xs: "1.4rem", md: "1.7rem" } }}>General</Typography>
                                        {!isEditable && <CustomBtn onClick={() => setIsEditable(true)} variant="outlined" icon={<EditIcon sx={{ fontSize: 17 }} />} title="Edit" />}
                                    </div>
                                    <TableContainer component={Paper} sx={{ boxShadow: "none", border: 0 }} className="spacer-input">
                                        {isEditable ?
                                            <>
                                                <Grid item xs={12} md={6} lg={6}>
                                                    <FlexField
                                                        placeholder="Status"
                                                        variant="standard"
                                                        setValue={setFormData}
                                                        name='Status'
                                                        label="Status"
                                                        required={true}
                                                        defaultVal={contract?.data?.Status}
                                                        disabled={true}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={6} lg={6}>
                                                    <FlexField
                                                        placeholder="Team Member"
                                                        variant="standard"
                                                        setValue={setFormData}
                                                        name='User'
                                                        label="Team Member"
                                                        disabled={true}
                                                        defaultVal={`${contract?.data?.User?.FirstName} ${contract?.data?.User?.LastName}`}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={6} lg={6}>
                                                    <FlexField
                                                        placeholder="Organization"
                                                        variant="standard"
                                                        setValue={setFormData}
                                                        name='Organization'
                                                        label="Organization"
                                                        defaultVal={contract?.data?.Organization?.Name}
                                                        disabled={true}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={6} lg={6}>
                                                    <FlexField
                                                        placeholder="Job Title"
                                                        variant="standard"
                                                        setValue={setFormData}
                                                        name='JobTitle'
                                                        label="Job Title"
                                                        required={true}
                                                        defaultVal={contract?.data?.JobTitle}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={6} lg={6}>
                                                    <SelectDropdown
                                                        variant="standard"
                                                        setValue={setFormData}
                                                        label="Type Of Employment"
                                                        name="Skills"
                                                        showAll={false}
                                                        defaultVal={contract?.data?.TypeofEmployment}
                                                        data={['Full-Time', 'Part-Time', 'Contract', 'None']}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={6} lg={6}>
                                                    <FlexField
                                                        variant="standard"
                                                        setValue={setFormData}
                                                        label="Work Hours per Week"
                                                        name="WorkHoursPerWeek"
                                                        defaultVal={contract?.data?.WorkHoursPerWeek}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={6} lg={6}>
                                                    <FlexField
                                                        variant="standard"
                                                        setValue={setFormData}
                                                        label="Rate per Hour"
                                                        name="RatePerHour"
                                                        defaultVal={contract?.data?.RatePerHour}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={6} lg={6}>
                                                    <FlexField
                                                        placeholder="No Of Paid Time Off Days"
                                                        variant="standard"
                                                        setValue={setFormData}
                                                        name='NoOfPaidTimeOffDays'
                                                        label="No Of Paid Time Off Days"
                                                        defaultVal={contract?.data?.NoOfPaidTimeOffDays}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={6} lg={6} sx={{ mt: 1 }}>
                                                    <Calendar
                                                        label={"Start Date"}
                                                        setValue={setFormData}
                                                        required={true}
                                                        name="StartDate"
                                                        defaultVal={contract?.data?.StartDate}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={6} lg={6} sx={{ mt: 1 }}>
                                                    <Calendar
                                                        label={"Go Live Date"}
                                                        setValue={setFormData}
                                                        name="GoLiveDate"
                                                        defaultVal={contract?.data?.GoLiveDate}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={6} lg={6} sx={{ mt: 1 }}>
                                                    <Calendar
                                                        label={"End Date"}
                                                        setValue={setFormData}
                                                        name="EndDate"
                                                        defaultVal={contract?.data?.EndDate}
                                                    />
                                                </Grid>
                                                <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                                                    <CustomBtn onClick={() => setIsEditable(false)} btnStyle={{ marginRight: 1 }} variant="outlined" title={"Cancel"} />
                                                    <CustomBtn onClick={() => { handleUpdateContract() }} variant="contained" title={"Save"} />
                                                </div>
                                            </>
                                            :
                                            <Table className='custom-responsive'>
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell component="th" sx={{ fontWeight: 700 }}>Status</TableCell>
                                                        <TableCell>{contract?.data?.Status}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell component="th" sx={{ fontWeight: 700 }}>Team Member</TableCell>
                                                        <TableCell onClick={() => router.push(`/team/user/${contract?.data?.User?._id}`)} sx={{ color: 'darkcyan', cursor: 'pointer' }}>{contract?.data?.User?.FirstName} {contract?.data?.User?.LastName} <ArrowOutwardIcon sx={{ fontSize: 14 }} /></TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell component="th" sx={{ fontWeight: 700 }}>Placement</TableCell>
                                                        <TableCell onClick={() => router.push(`/placements/${contract?.data?.Placement}`)} sx={{ color: 'darkcyan', cursor: 'pointer' }}>{contract?.data?.JobTitle} <ArrowOutwardIcon sx={{ fontSize: 14 }} /></TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell component="th" sx={{ fontWeight: 700 }}>Job Title</TableCell>
                                                        <TableCell>{contract?.data?.JobTitle}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell component="th" sx={{ fontWeight: 700 }}>Organization</TableCell>
                                                        <TableCell onClick={() => router.push(`/organization/details/${contract?.data?.Organization?._id}`)} sx={{ color: 'darkcyan', cursor: 'pointer' }}>{contract?.data?.Organization?.Name} <ArrowOutwardIcon sx={{ fontSize: 14 }} /></TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell component="th" sx={{ fontWeight: 700 }}>Contract ID</TableCell>
                                                        <TableCell>{contract?.data?._id}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell component="th" sx={{ fontWeight: 700 }}>Type Of Employment</TableCell>
                                                        <TableCell>{contract?.data?.TypeofEmployment}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell component="th" sx={{ fontWeight: 700 }}>Work Hours per Week</TableCell>
                                                        <TableCell>{contract?.data?.WorkHoursPerWeek}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell component="th" sx={{ fontWeight: 700 }}>Rate per Hour</TableCell>
                                                        <TableCell>{contract?.data?.RatePerHour && `$${formatNum(contract?.data?.RatePerHour)} USD`}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell component="th" sx={{ fontWeight: 700 }}>Number Of Paid Time Off Days</TableCell>
                                                        <TableCell>{contract?.data?.NoOfPaidTimeOffDays}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell component="th" sx={{ fontWeight: 700 }}>Start Date</TableCell>
                                                        <TableCell>{contract?.data?.StartDate && moment(contract?.data?.StartDate).format('MM-DD-YYYY')}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell component="th" sx={{ fontWeight: 700 }}>Go Live Date</TableCell>
                                                        <TableCell>{contract?.data?.GoLiveDate && moment(contract?.data?.GoLiveDate).format('MM-DD-YYYY')}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell component="th" sx={{ fontWeight: 700 }}>End Date</TableCell>
                                                        <TableCell>{contract?.data?.EndDate && moment(contract?.data?.EndDate).format('MM-DD-YYYY')}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell component="th" sx={{ fontWeight: 700 }}>Created Date</TableCell>
                                                        <TableCell>{moment(contract?.data?.createdAt).format('MM-DD-YYYY')}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell component="th" sx={{ fontWeight: 700 }}>Created By</TableCell>
                                                        <TableCell>{creator?.FirstName} {creator?.LastName}</TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        }
                                    </TableContainer>
                                </FlexCard>
                            </Grid>
                        </Grid>
                    </>
                    :
                    <Loader show={!contract ? true : false} />
                }
                <SnackAlert
                    show={showSnack}
                    type={type}
                    handleClose={(event, reason) => setShowSnack(false)}
                    msg={msg}
                />
            </Layout>
            <DialogBox
                open={deleteModal}
                handleClose={() => setDeleteModal(false)}
                title='End Contract'
            >
                <MessageModal
                    msg={"Are you sure you want to end this contract?\n\n The client will be notified. This cannot be reversed."}
                    removeBtnTitle="End Contract"
                    handleClose={() => setDeleteModal(false)}
                    handleRemove={handleUpdateContractStatus}
                />
            </DialogBox>
            <DialogBox
                open={statusModal}
                handleClose={() => setStatusModal(false)}
                title='Update Contract Status'
                msg={`Update the status for this contract below:`}
            >
                <ContractStatusModal
                    handleClose={() => setStatusModal(false)}
                    handleSave={() => { setStatusModal(false); setMsg("Contract updated successfully."); setType('success'); setShowSnack(true); }}
                    data={contract?.data}
                />
            </DialogBox>
        </>
    );
}


