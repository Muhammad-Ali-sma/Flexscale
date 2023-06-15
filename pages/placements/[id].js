import moment from 'moment';
import Head from "next/head";
import { useState } from 'react';
import { useRouter } from 'next/router';
import { INTERNAL_MANAGER, INTERNAL_USER } from '../../utils';
import { useSelector } from 'react-redux';
import { useEffect, useReducer } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { selectAuth } from '../../store/authSlice';
import Loader from '../../components/global/Loader';
import { Layout } from '../../components/global/Layout';
import FlexCard from '../../components/global/FlexCard';
import Calendar from '../../components/global/Calendar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CustomBtn from '../../components/global/CustomBtn';
import FlexField from '../../components/global/FlexField';
import { formReducer, getUser } from '../../utils/globalFunctions';
import SnackAlert from '../../components/global/SnackAlert';
import DialogBox from '../../components/dialogBox/DialogBox';
import PlacementService from '../../Services/PlacementService';
import { BodyHeader } from '../../components/global/BodyHeader';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import MessageModal from '../../components/dialogBox/MessageModal';
import { useMutation, useQuery, useQueryClient } from "react-query";
import SelectDropdown from '../../components/global/SelectDropdown';
import AgentStatusChip from '../../components/global/AgentStatusChip';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Roles, Skills, timeZones, WorkExperience } from "../../utils/data";
import PlacementStatusModal from '../../components/dialogBox/PlacementStatusModal';
import PlacementCandidateModal from '../../components/dialogBox/PlacemnetCandidateModal';
import { Grid, Paper, Table, TableCell, TableContainer, TablePagination, TableRow, Typography } from '@mui/material';


export default function PlacementDetails() {

    const router = useRouter()
    const { id } = router.query;
    const [page, setPage] = useState(0);
    const queryClient = useQueryClient();
    const [msg, setMsg] = useState(false);
    const [type, setType] = useState(null);
    const [users, setUsers] = useState([]);
    const user = useSelector(selectAuth)?.userData;
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [showSnack, setShowSnack] = useState(false);
    const [contractpage, setContractPage] = useState(0);
    const [isEditable, setIsEditable] = useState(false);
    const [selectedUser, setSelectedUser] = useState({});
    const [deleteModal, setDeleteModal] = useState(false);
    const [statusModal, setStatusModal] = useState(false);
    const [internalUsers, setInternalUsers] = useState([]);
    const [formData, setFormData] = useReducer(formReducer, {});
    const usersList = useSelector(state => state.dataSlice.usersList);
    const [contractRowsPerPage, setContractRowsPerPage] = useState(5);
    const [editCandidateModal, setEditCandidateModal] = useState(false);
    const [isCandidateEditable, setIsCandidateEditable] = useState(false);
    const [deleteCandidateModal, setDeleteCandidateModal] = useState(false);


    const { data: placement } = useQuery(['getPlacementById'], () => PlacementService.getPlacementById(id), {
        enabled: id ? true : false
    });
    const creator = getUser('_id', placement?.data?.CreatedBy)[0];
    const updatePlacement = useMutation((data) => PlacementService.updatePlacement(id, data), {
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['getPlacementById'] }),
        onSuccess: async (res) => {
            if (res?.success) {
                setMsg("Placement updated successfully.");
                setIsEditable(false);
                setEditCandidateModal(false);
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
    const handleUpdatePlacement = () => {

        let temp = {
            JobTitle: formData['JobTitle'] ? formData['JobTitle'] : placement?.data?.JobTitle,
            Status: formData['Status'] ? formData['Status'] : placement?.data?.Status,
            StartDate: formData['StartDate'] ? formData['StartDate'] : placement?.data?.StartDate,
            GoLiveDate: formData['GoLiveDate'] ? formData['GoLiveDate'] : placement?.data?.GoLiveDate,
            Role: formData['Role'] ? formData['Role'] : placement?.data?.Role,
            Skills: formData['Skills'] ? formData['Skills'] : placement?.data?.Skills,
            WorkExperience: formData['WorkExperience'] ? formData['WorkExperience'] : placement?.data?.WorkExperience,
            TimeZone: formData['TimeZone'] ? formData['TimeZone'] : placement?.data?.TimeZone,
        }
        if (Object.keys(formData)?.length > 0) {
            updatePlacement.mutate(temp)
        }
    }
    const addCandidate = useMutation((data) => PlacementService.addCandidates(id, data), {
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['getPlacementById'] }),
        onSuccess: async (res) => {
            if (res?.success) {
                setSelectedUser({});
                setMsg('New candidate added successfully.');
                setType('success');
                setShowSnack(true);
                setFormData({});
            }
        },
        onError: async (error) => {
            setType('error');
            setMsg('Failed please try again!');
            setShowSnack(true);
        }
    })
    const handleOnAddUser = () => {
        if (formData['SearchUsers']) {
            let tempIds = [];
            placement?.data?.Candidates?.map(x => tempIds.push(x?._id));
            let data = {
                CandidateID: formData['SearchUsers'],
                prevIds: tempIds
            }
            addCandidate.mutate(data);
        }
    }
    const removeCandidate = useMutation((data) => PlacementService.removeCandidate(id, data), {
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['getPlacementById'] }),
        onSuccess: async (res) => {
            if (res?.success) {
                setSelectedUser({});
                setMsg('Candidate removed successfully.');
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
    const handleOnRemoveUser = (item) => {
        let tempIds = [];
        placement?.data?.Candidates?.map(x => {
            if (x?._id !== selectedUser?._id) {
                tempIds.push(x?._id)
            }
        });
        let data = {
            prevIds: tempIds,
            Candidate: selectedUser?._id
        }
        removeCandidate.mutate(data);
    }
    const removePlacement = useMutation(() => PlacementService.removePlacement(id), {
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['getPlacementById'] }),
        onSuccess: async (res) => {
            if (res?.success) {
                setMsg('Placement removed successfully.');
                setType('success');
                setShowSnack(true);
                router.back();
            }
        },
        onError: async (error) => {
            setType('error');
            setMsg('Failed please try again!');
            setShowSnack(true);
        }
    })
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const handleChangeContractPage = (event, newPage) => {
        setContractPage(newPage);
    };
    const handleChangeContractRowsPerPage = (event) => {
        setContractRowsPerPage(parseInt(event.target.value, 10));
        setContractPage(0);
    };
    useEffect(() => {
        if (!placement) {
            router.push('/placements');
        }
        let userIds = [];
        if (placement?.data?.Candidates && users?.length > 0) {
            placement?.data?.Candidates?.map(x => userIds.push(x?.candidateId?._id));
        }
        setInternalUsers(userIds)
    }, [placement])

    useEffect(() => {
        setUsers(usersList?.filter(x => {
            let OrgIds = [];
            x?.Organization?.map(y => OrgIds.push(y._id));
            if (user?.AccessLevel === INTERNAL_MANAGER.level) {
                if (!OrgIds.includes(placement?.data?.Organization?._id) && x?.AccessLevel === INTERNAL_USER.level && x?.Manager === user._id) {
                    return x;
                }
            } else {
                if (!OrgIds.includes(placement?.data?.Organization?._id) && x?.AccessLevel === INTERNAL_USER.level) {
                    return x;
                }
            }
        }));
    }, [usersList])

    return (
        <>
            <Head>
                <title>Placements | Flexscale</title>
            </Head>
            <Layout>
                <BodyHeader
                    title={placement?.data?.JobTitle}
                    subtitle={placement?.data?.Organization?.Name}
                    showAvatar={false}
                    containerStyle={{ justifyContent: 'space-between' }}
                    button={<CustomBtn
                        onClick={() => router.back()}
                        variant="outlined"
                        icon={<ArrowBackIcon />}
                        title="Go Back"
                    />
                    }
                    firstBtnTitle={'Update Status'}
                    handleOnHire={() => setStatusModal(true)}
                    handleRemove={() => { setDeleteModal(true) }}
                />
                {placement?.data ?
                    <>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={12} lg={12}>
                                <FlexCard>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography sx={{ fontWeight: 800, marginBottom: 1, fontSize: { xs: "1.4rem", md: "1.7rem" } }}>General</Typography>
                                        {!isEditable && <CustomBtn onClick={() => setIsEditable(true)} variant="outlined" icon={<EditIcon sx={{ fontSize: 17 }} />} title="Edit" />}
                                    </div>
                                    <TableContainer component={Paper} sx={{ boxShadow: "none", border: 0, overflowX: 'hidden' }} className="spacer-input">
                                        {isEditable ?
                                            <>
                                                <Grid item xs={12} md={6} lg={6}>
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
                                                <Grid item xs={12} md={6} lg={6}>
                                                    <FlexField
                                                        placeholder="Organization"
                                                        variant="standard"
                                                        setValue={setFormData}
                                                        name='Organization'
                                                        label="Organization"
                                                        required={true}
                                                        defaultVal={placement?.data?.Organization?.Name}
                                                        disabled={true}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={6} lg={6}>
                                                    <SelectDropdown
                                                        variant="standard"
                                                        setValue={setFormData}
                                                        label="Role"
                                                        name="Role"
                                                        required={true}
                                                        showAll={false}
                                                        defaultVal={placement?.data?.Role ? { title: placement?.data?.Role } : null}
                                                        data={Roles}
                                                        searchable={true}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={6} lg={6}>
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
                                                <Grid item xs={12} md={6} lg={6}>
                                                    <SelectDropdown
                                                        variant="standard"
                                                        setValue={setFormData}
                                                        label="WorkExperience"
                                                        name="WorkExperience"
                                                        data={WorkExperience}
                                                        showAll={false}
                                                        required={true}
                                                        defaultVal={placement?.data?.WorkExperience}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={6} lg={6}>
                                                    <SelectDropdown
                                                        variant="standard"
                                                        setValue={setFormData}
                                                        label="TimeZone"
                                                        name="TimeZone"
                                                        data={timeZones}
                                                        showAll={false}
                                                        required={true}
                                                        searchable={true}
                                                        defaultVal={placement?.data?.TimeZone ? { title: placement?.data?.TimeZone } : null}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={6} lg={6}>
                                                    <Calendar
                                                        label={"Start Date"}
                                                        setValue={setFormData}
                                                        name="StartDate"
                                                        defaultVal={placement?.data?.StartDate}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={6} lg={6}>
                                                    <Calendar
                                                        label={"Go Live Date"}
                                                        setValue={setFormData}
                                                        name="GoLiveDate"
                                                        defaultVal={placement?.data?.GoLiveDate}
                                                    />
                                                </Grid>
                                                <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                                                    <CustomBtn onClick={() => setIsEditable(false)} btnStyle={{ marginRight: 1 }} variant="outlined" title={"Cancel"} />
                                                    <CustomBtn onClick={() => { handleUpdatePlacement() }} variant="contained" title={"Save"} />
                                                </div>
                                            </>
                                            :
                                            <Table className='custom-responsive'>
                                                <TableRow>
                                                    <TableCell component="th" sx={{ fontWeight: 700 }}>Job Title</TableCell>
                                                    <TableCell>{placement?.data?.JobTitle}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" sx={{ fontWeight: 700 }}>Organization</TableCell>
                                                    <TableCell onClick={() => router.push(`/organization/details/${placement?.data?.Organization?._id}`)} sx={{ color: 'darkcyan', cursor: 'pointer' }}>{placement?.data?.Organization?.Name} <ArrowOutwardIcon sx={{ fontSize: 14 }} /></TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" sx={{ fontWeight: 700 }}>Placement ID</TableCell>
                                                    <TableCell>{placement?.data?._id}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" sx={{ fontWeight: 700 }}>Status</TableCell>
                                                    <TableCell>{placement?.data?.Status}</TableCell>
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
                                                    <TableCell component="th" sx={{ fontWeight: 700 }}>Work Experience</TableCell>
                                                    <TableCell>{placement?.data?.WorkExperience}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" sx={{ fontWeight: 700 }}>Time Zone</TableCell>
                                                    <TableCell>{placement?.data?.TimeZone}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" sx={{ fontWeight: 700 }}>Start Date</TableCell>
                                                    <TableCell>{placement?.data?.StartDate && moment(placement?.data?.StartDate).format('MM-DD-YYYY')}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" sx={{ fontWeight: 700 }}>Go Live Date</TableCell>
                                                    <TableCell>{placement?.data?.GoLiveDate && moment(placement?.data?.GoLiveDate).format('MM-DD-YYYY')}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" sx={{ fontWeight: 700 }}>Created Date</TableCell>
                                                    <TableCell>{moment(placement?.data?.createdAt).format('MM-DD-YYYY')}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" sx={{ fontWeight: 700 }}>Created By</TableCell>
                                                    <TableCell>{creator?.FirstName} {creator?.LastName}</TableCell>
                                                </TableRow>
                                            </Table>
                                        }
                                    </TableContainer>
                                </FlexCard>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12}>
                                <FlexCard>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography sx={{ fontWeight: 800, marginBottom: 1, fontSize: { xs: "1.4rem", md: "1.7rem" } }}>Candidates</Typography>
                                        {(placement?.data?.Status !== 'Inactive' && !isCandidateEditable) && <CustomBtn onClick={() => setIsCandidateEditable(true)} variant="outlined" icon={<EditIcon sx={{ fontSize: 17 }} />} title="Edit" />}
                                    </div>
                                    {isCandidateEditable &&
                                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                                            <div style={{ width: '50%', marginRight: 20 }}>
                                                <SelectDropdown
                                                    variant="standard"
                                                    setValue={setFormData}
                                                    label="Search Users"
                                                    name="SearchUsers"
                                                    data={users?.filter(x => !internalUsers?.includes(x._id))}
                                                    showAll={false}
                                                    required={true}
                                                    getId={true}
                                                    value={formData['SearchUsers']}
                                                    showId={true}
                                                />
                                            </div>
                                            <div>
                                                <CustomBtn
                                                    onClick={() => { handleOnAddUser() }}
                                                    variant="contained"
                                                    title={"Add User"}
                                                    icon={<AddCircleOutlineIcon />}
                                                />
                                            </div>
                                        </div>
                                    }
                                    <TableContainer component={Paper} sx={{ boxShadow: "none", border: 0 }}>
                                        <Table>
                                            <TableRow>
                                                <TableCell component="th" sx={{ fontWeight: 700 }}>First Name</TableCell>
                                                <TableCell component="th" sx={{ fontWeight: 700 }}>Last Name</TableCell>
                                                <TableCell component="th" sx={{ fontWeight: 700 }}>Status</TableCell>
                                                <TableCell component="th" sx={{ fontWeight: 700 }}>ID</TableCell>
                                                {isCandidateEditable &&
                                                    <>
                                                        <TableCell component="th" sx={{ fontWeight: 700 }}></TableCell>
                                                        <TableCell component="th" sx={{ fontWeight: 700 }}></TableCell>
                                                    </>
                                                }
                                            </TableRow>
                                            {placement?.data?.Candidates?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)?.map((item, i) => (
                                                <TableRow key={`candidate_${i}`} onClick={item?.candidateStatus === 'Hired' ? () => router.push(`/contracts/${placement?.data?.Contracts[i]?._id}`) : null} sx={{ cursor: 'pointer' }}>
                                                    <TableCell>{item?.candidateId?.FirstName}</TableCell>
                                                    <TableCell>{item?.candidateId?.LastName}</TableCell>
                                                    <TableCell><AgentStatusChip status={item?.candidateStatus} /></TableCell>
                                                    <TableCell>{item?.candidateId?._id}</TableCell>
                                                    {(isCandidateEditable && item?.candidateStatus !== 'Hired') &&
                                                        <>
                                                            <TableCell sx={{ color: '#203B3C', cursor: 'pointer' }} onClick={() => { setSelectedUser(item); setEditCandidateModal(true) }}>Change Status</TableCell>
                                                            <TableCell onClick={() => { setSelectedUser(item); setDeleteCandidateModal(true) }} sx={{ color: 'red', cursor: 'pointer' }}>Remove</TableCell>
                                                        </>
                                                    }
                                                </TableRow>
                                            ))}
                                            {(page > 0 ? Math.max(0, (1 + page) * rowsPerPage - placement?.data?.Candidates?.length) : 0) > 0 && (
                                                <TableRow
                                                    style={{
                                                        height: 53 * (page > 0 ? Math.max(0, (1 + page) * rowsPerPage - placement?.data?.Candidates?.length) : 0),
                                                    }}
                                                >
                                                    <TableCell colSpan={6} />
                                                </TableRow>
                                            )}
                                        </Table>
                                    </TableContainer>
                                    <TablePagination
                                        rowsPerPageOptions={[5, 10, 20]}
                                        component="div"
                                        count={placement?.data?.Candidates?.length ?? 0}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                    />
                                </FlexCard>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12}>
                                <FlexCard>
                                    <Typography sx={{ fontWeight: 800, marginBottom: 1, fontSize: { xs: "1.4rem", md: "1.7rem" } }}>Contracts</Typography>
                                    <TableContainer component={Paper} sx={{ boxShadow: "none", border: 0 }}>
                                        <Table>
                                            <TableRow>
                                                <TableCell component="th" sx={{ fontWeight: 700 }}>Job Title</TableCell>
                                                <TableCell component="th" sx={{ fontWeight: 700 }}>Status</TableCell>
                                                <TableCell component="th" sx={{ fontWeight: 700 }}>Created Date</TableCell>
                                                <TableCell component="th" sx={{ fontWeight: 700 }}>Placement ID</TableCell>
                                            </TableRow>
                                            {placement?.data?.Contracts?.slice(contractpage * contractRowsPerPage, contractpage * contractRowsPerPage + contractRowsPerPage)?.map((item, i) => (
                                                <TableRow key={`contract_${i}`} onClick={() => router.push(`/contracts/${item?._id}`)} sx={{ cursor: 'pointer' }}>
                                                    <TableCell>{item?.JobTitle}</TableCell>
                                                    <TableCell><AgentStatusChip status={item?.Status} /></TableCell>
                                                    <TableCell>{moment(item?.createdAt).format('MM-DD-YYYY')}</TableCell>
                                                    <TableCell>{item?.Placement}</TableCell>
                                                </TableRow>
                                            ))}
                                            {(contractpage > 0 ? Math.max(0, (1 + contractpage) * contractRowsPerPage - placement?.data?.Contracts?.length) : 0) > 0 && (
                                                <TableRow
                                                    style={{
                                                        height: 53 * (contractpage > 0 ? Math.max(0, (1 + contractpage) * contractRowsPerPage - placement?.data?.Contracts?.length) : 0),
                                                    }}
                                                >
                                                    <TableCell colSpan={6} />
                                                </TableRow>
                                            )}
                                        </Table>
                                    </TableContainer>
                                    <TablePagination
                                        rowsPerPageOptions={[5, 10, 20]}
                                        component="div"
                                        count={placement?.data?.Contracts?.length ?? 0}
                                        rowsPerPage={contractRowsPerPage}
                                        page={contractpage}
                                        onPageChange={handleChangeContractPage}
                                        onRowsPerPageChange={handleChangeContractRowsPerPage}
                                    />
                                </FlexCard>
                            </Grid>
                        </Grid>
                    </>
                    :
                    <Loader show={!placement?.data ? true : false} />
                }
                <SnackAlert
                    show={showSnack}
                    type={type}
                    handleClose={(event, reason) => setShowSnack(false)}
                    msg={msg}
                />
            </Layout>

            <DialogBox
                open={editCandidateModal}
                handleClose={() => setEditCandidateModal(false)}
                title='Update Status'
                msg={`Update the status for ${selectedUser?.candidateId?.FirstName} ${selectedUser?.candidateId?.LastName} below:`}
            >
                <PlacementCandidateModal
                    handleClose={() => setEditCandidateModal(false)}
                    handleSave={() => { setEditCandidateModal(false); setIsCandidateEditable(false); }}
                    selectedUser={selectedUser}
                    data={placement?.data}
                    queryKey="getPlacementById"
                />
            </DialogBox>

            <DialogBox
                open={deleteModal}
                handleClose={() => setDeleteModal(false)}
                title='Remove Placement'
            >
                <MessageModal
                    handleClose={() => setDeleteModal(false)}
                    msg={"Are you sure you want to remove this placement?"}
                    handleRemove={() => { removePlacement.mutate(); setDeleteModal(false); setIsCandidateEditable(false); }}
                />
            </DialogBox>

            <DialogBox
                open={deleteCandidateModal}
                handleClose={() => setDeleteCandidateModal(false)}
                title='Remove Candidate'
            >
                <MessageModal
                    handleClose={() => setDeleteCandidateModal(false)}
                    msg={"Are you sure you want to remove this candidate?"}
                    handleRemove={() => { handleOnRemoveUser(); setDeleteCandidateModal(false) }}
                />
            </DialogBox>

            <DialogBox
                open={statusModal}
                handleClose={() => setStatusModal(false)}
                title='Update Placement Status'
                msg={`Update the status for ${placement?.data?.JobTitle} below:`}
            >
                <PlacementStatusModal
                    handleClose={() => setStatusModal(false)}
                    handleSave={() => { setStatusModal(false); setMsg("Placement updated successfully."); setType('success'); setShowSnack(true); }}
                    data={placement?.data}
                />
            </DialogBox>
        </>
    );
}


