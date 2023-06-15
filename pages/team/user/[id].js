import moment from 'moment';
import Head from "next/head";
import { useEffect, useState } from 'react';
import download from 'downloadjs';
import { useReducer } from 'react';
import { useRouter } from 'next/router';
import EditIcon from '@mui/icons-material/Edit';
import Link from '../../../components/global/Link';
import { useMutation, useQuery } from "react-query";
import { useSelector, useDispatch } from 'react-redux';
import { updateImage } from '../../../store/authSlice';
import Loader from '../../../components/global/Loader';
import UserService from '../../../Services/UserService';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FlexCard from '../../../components/global/FlexCard';
import { Layout } from '../../../components/global/Layout';
import { countryList, pronouns } from '../../../utils/data';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FlexField from '../../../components/global/FlexField';
import CustomBtn from '../../../components/global/CustomBtn';
import DrawerBox from '../../../components/global/DrawerBox';
import SnackAlert from '../../../components/global/SnackAlert';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import DialogBox from '../../../components/dialogBox/DialogBox';
import DocumentService from '../../../Services/DocumentService';
import PlacementService from '../../../Services/PlacementService';
import { BodyHeader } from '../../../components/global/BodyHeader';
import MessageModal from '../../../components/dialogBox/MessageModal';
import SelectDropdown from '../../../components/global/SelectDropdown';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AgentStatusChip from '../../../components/global/AgentStatusChip';
import UploadProfileImage from '../../../components/dialogBox/UploadProfileImage';
import UploadDocumentModal from '../../../components/dialogBox/UploadDocumentModal';
import { formReducer, getUser, getUsersList, s3 } from '../../../utils/globalFunctions';
import { Avatar, Box, Grid, Paper, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, Typography } from '@mui/material';
import { accessLevel, accessLevelClientBillingAdmin, accessLevelClientSuperAdmin, accessLevelClientUser, accessLevelInternalManager, CLIENT_BILLING_ADMIN, CLIENT_SUPER_ADMIN, INTERNAL_ADMIN, INTERNAL_MANAGER, INTERNAL_USER } from '../../../utils';
import ContractService from '../../../Services/ContractService';



export default function TeamUserDetails() {

  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch();
  const user = getUser('_id', id)[0];
  const [page, setPage] = useState(0);
  const [msg, setMsg] = useState(false);
  const [type, setType] = useState(null);
  const [menu, setMenu] = useState(false);
  const [image, setImage] = useState(null);
  const [docpage, setDocPage] = useState(0);
  const [editOrg, setEditOrg] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [managerPage, setManagerPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showSnack, setShowSnack] = useState(false);
  const creator = getUser('_id', user?.CreatedBy)[0];
  const [imageModal, setImageModal] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [editManger, setEditManger] = useState(false);
  const [contractPage, setContractPage] = useState(0);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [placementPage, setPlacementPage] = useState(0);
  const [docRowsPerPage, setDocRowsPerPage] = useState(5);
  const [selectedImage, setSelectedImage] = useState(null);
  const [formData, setFormData] = useReducer(formReducer, {});
  const [deleteUserModal, setDeleteUserModal] = useState(false);
  const managers = getUser('AccessLevel', INTERNAL_MANAGER.level);
  const [managerRowsPerPage, setManagerRowsPerPage] = useState(5);
  const [contractRowsPerPage, setContractRowsPerPage] = useState(5);
  const usersList = useSelector(state => state.dataSlice.usersList);
  const [placementRowsPerPage, setPlacementRowsPerPage] = useState(5);
  const currentUser = useSelector(state => state.authUser.login.userData);
  const organizations = useSelector(state => state.dataSlice.OrganizationList);


  const { data: placement } = useQuery(['getPlacementsByCandidateId'], () => PlacementService.getPlacementsByCandidateId(id, user?.AccessLevel), {
    enabled: (user, user?.AccessLevel) ? true : false
  });
  const { data: contracts } = useQuery(['getContractsByUserId'], () => ContractService.getContractsByUserId(id), {
    enabled: user ? true : false
  });

  const updateUser = useMutation((data) => UserService.updateUser(id, data), {
    onSettled: (res) => {
      getUsersList();
      if (res?.success) {
        uploadProfile();
      } else {
        setType('success');
        setMsg("Error occured please try again!");
        setShowSnack(true);
      }
    }
  });
  const deleteUser = useMutation((data) => UserService.deleteUser(id, data), {
    onSettled: (res) => {
      getUsersList();
      if (res?.success) {
        setDeleteUserModal(false);
        router.back();
      } else {
        setType('success');
        setMsg("Error occured please try again!");
        setShowSnack(true);
      }
    }
  });
  const handleUpdateUser = (managers, action, orgId) => {
    let orgIds = [];
    if (action == 'add') {
      orgIds.push(formData['organization'], ...user?.Organization?.map(item => item?._id));
    }
    if (action == 'remove') {
      user?.Organization?.filter(item => item?._id !== orgId).map(x => orgIds.push(x._id));
    }
    let managerIds = [];
    if (managers?.length > 0) {
      managers?.map(item => {
        managerIds.push(item?._id);
      })
    } else if (formData['manager']?.length > 0) {
      formData['manager']?.map(item => {
        managerIds.push(item?._id);
      })
    }
    let temp = {
      FirstName: formData["firstName"] ? formData["firstName"] : user?.FirstName,
      LastName: formData["lastName"] ? formData["lastName"] : user?.LastName,
      Phone: formData["phone"] ? formData["phone"] : user?.Phone,
      Email: formData["email"] ? formData["email"] : user?.Email,
      PreferredName: formData["preferredName"] ? formData["preferredName"] : user?.PreferredName,
      AccessLevel: formData["accessLevel"] ? formData["accessLevel"] : user?.AccessLevel,
      Organization: orgIds?.length > 0 ? orgIds : user?.Organization?.map(x => x._id),
      Gender: formData["gender"] ? formData["gender"] : user?.Gender,
      country: formData?.["country"] ? formData?.["country"] : user?.Location,
      manager: managerIds?.length > 0 ? managerIds : user?.Manager?.map(x => x._id)
    }
    if (Object.keys(formData)?.length > 0 || managers?.length > 0 || orgIds?.length > 0) {
      updateUser.mutate(temp)
    }
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleDocChangePage = (event, newPage) => {
    setDocPage(newPage);
  };
  const handleDocRowsPerPage = (event) => {
    setDocRowsPerPage(parseInt(event.target.value, 10));
    setDocPage(0);
  };
  const handleManagerChangePage = (event, newPage) => {
    setManagerPage(newPage);
  };
  const handleManagerRowsPerPage = (event) => {
    setManagerRowsPerPage(parseInt(event.target.value, 10));
    setManagerPage(0);
  };
  const handlePlacementChangePage = (event, newPage) => {
    setPlacementPage(newPage);
  };
  const handlePlacementRowsPerPage = (event) => {
    setPlacementRowsPerPage(parseInt(event.target.value, 10));
    setPlacementPage(0);
  };
  const handleContractChangePage = (event, newPage) => {
    setContractPage(newPage);
  };
  const handleContractRowsPerPage = (event) => {
    setContractRowsPerPage(parseInt(event.target.value, 10));
    setContractPage(0);
  };
  const removeDoc = useMutation((id) => DocumentService.deleteDoc(id), {
    onSettled: (res) => {
      getUsersList();
      if (res?.success) {
        setType('success');
        setMsg("Document Removed Successfully");
        setShowSnack(true);
      } else {
        setType('error');
        setMsg("Document Removal Failed!");
        setShowSnack(true);
      }
    }
  });
  const updateDoc = useMutation((id) => DocumentService.editDoc(id, formData['FileName']), {
    onSettled: (res) => {
      getUsersList();
      if (res?.success) {
        setType('success');
        setMsg("Document Updated Successfully");
        setShowSnack(true);
        setMenu(false);
        setSelectedDoc(null);
      } else {
        setType('error');
        setMsg("Failed to update document!");
        setShowSnack(true);
      }
    }
  });
  const deleteDocument = (doc) => {
    s3(id).deleteFile(doc?.FileName)
      .then(data => {
        if (data?.ok) {
          removeDoc.mutate(doc?._id);
        }
      })
      .catch(err => {
        setType('error');
        setMsg(err);
        setShowSnack(true);
      });
  };
  const updateDocument = () => {
    updateDoc.mutate(selectedDoc?._id);
  };
  const uploadProfile = () => {
    if (formData['Method'] === 'URL' && formData['DOCURL'] && formData['DocumentName']) {
      uploadImage.mutate({ image: formData['DOCURL'] });
      if (currentUser._id == id) {
        dispatch(updateImage({ image: formData['DOCURL'] }));
      }
      return;
    }
    if (formData['Method'] === 'Document') {
      s3(id).uploadFile(image, formData['DocumentName'] ?? image?.name)
        .then(data => {
          if (data?.key) {
            uploadImage.mutate({ image: data?.location });
            if (currentUser._id == id) {
              dispatch(updateImage({ image: data?.location }));
            }
          }
        })
        .catch(err => {
          setType('error');
          setMsg(err);
          setShowSnack(true);
        });
      return;
    }
  }
  const uploadImage = useMutation((data) => UserService.uploadProfileImage(id, data), {
    onSettled: (res) => {
      getUsersList();
      if (res?.success) {
        setSelectedImage(null);
        setImage(null);
        setEditOrg(false);
        setIsEditable(false);
        setEditManger(false);
        setType('success');
        setShowSnack(true);
      } else {
        setType('error');
        setMsg('Image upload failed, please try again!');
        setShowSnack(true);
      }
    }
  });
  useEffect(() => {
    if (!user) {
      router.push('/team');
    }
  }, [])
  return (
    <>
      <Head>
        <title>{user?.PreferredName ?? user?.FirstName} | Team | Flexscale</title>
      </Head>
      <Layout>
        {user ?
          <>
            <BodyHeader
              title={`${user?.FirstName} ${user?.LastName}`}
              showAvatar={false}
              containerStyle={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}
              button={<CustomBtn
                onClick={() => router.back()}
                variant="outlined"
                icon={<ArrowBackIcon />}
                title="Go Back"
              />
              }
              handleRemove={() => setDeleteUserModal(true)}
              removeBtnTitle="Delete"
            />

            <Grid container spacing={2} className="spacer-input">
              <Grid item xs={12}>
                <FlexCard>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: 800, marginBottom: 1, fontSize: { xs: "1.4rem", md: "1.7rem" } }}>General</Typography>
                    {!isEditable && <CustomBtn onClick={() => setIsEditable(true)} variant="outlined" icon={<EditIcon sx={{ fontSize: 17 }} />} title="Edit" />}
                  </div>
                  <TableContainer component={Paper} sx={{ boxShadow: "none", border: 0 }}>
                    {isEditable ?
                      <>
                        <Grid item xs={12} md={6} lg={12}>
                          <Grid container>
                            <Grid item xs={12} md={6} lg={6}>
                              <SelectDropdown
                                variant="standard"
                                setValue={setFormData}
                                label="Access Level"
                                name="accessLevel"
                                getAccessMethods={true}
                                data={currentUser?.AccessLevel === INTERNAL_ADMIN.level ? accessLevel : currentUser?.AccessLevel === INTERNAL_MANAGER.level ? accessLevelInternalManager : currentUser?.AccessLevel === CLIENT_SUPER_ADMIN.level ? accessLevelClientSuperAdmin : currentUser?.AccessLevel === CLIENT_BILLING_ADMIN.level ? accessLevelClientBillingAdmin : accessLevelClientUser}
                                showAll={false}
                                required={true}
                                helperText="Based on the access level, it will provide access to clients or internal applications."
                                defaultVal={user?.AccessLevel}
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
                              <Avatar alt="Remy Sharp" src={formData['DOCURL'] ? formData['DOCURL'] : selectedImage ? selectedImage : user?.ProfileImage} sx={{ width: 70, height: 70, marginTop: 2, marginBottom: -10 }} />
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                          <FlexField
                            placeholder="First Name"
                            variant="standard"
                            setValue={setFormData}
                            name='firstName'
                            label="First Name"
                            required={true}
                            defaultVal={user?.FirstName}
                          />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                          <FlexField
                            placeholder="Preferred First Name"
                            variant="standard"
                            setValue={setFormData}
                            name='preferredName'
                            label="Preferred First Name"
                            defaultVal={user?.PreferredName}
                          />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                          <FlexField
                            placeholder="Last Name"
                            variant="standard"
                            setValue={setFormData}
                            name='lastName'
                            required={true}
                            defaultVal={user?.LastName}
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
                            defaultVal={user?.Gender}
                          />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                          <FlexField
                            placeholder="Email"
                            variant="standard"
                            setValue={setFormData}
                            name='email'
                            as={"email"}
                            label="Email"
                            required={true}
                            defaultVal={user?.Email}
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
                            required={false}
                            defaultVal={user?.Phone}
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
                            defaultVal={user?.Location ? { title: user?.Location } : null}
                            searchable={true}
                          />
                        </Grid>
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                          <CustomBtn onClick={() => { setIsEditable(false); setImage(null); setSelectedImage(null) }} btnStyle={{ marginRight: 1 }} variant="outlined" title={"Cancel"} />
                          <CustomBtn onClick={() => { setMsg('User Updated Successfully!'); handleUpdateUser() }} variant="contained" title={"Save"} />
                        </div>
                      </>
                      :
                      <div style={{ display: 'flex' }}>
                        <Table className='custom-responsive'>
                          <TableBody>
                            <TableRow>
                              <TableCell component="th" sx={{ fontWeight: 700 }}>Access Level</TableCell>
                              <TableCell>{accessLevel.filter(x => x.level === user?.AccessLevel)[0].label || ""}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell component="th" sx={{ fontWeight: 700 }}>Email</TableCell>
                              <TableCell>{user?.Email}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell component="th" sx={{ fontWeight: 700 }}>Phone</TableCell>
                              <TableCell>{user?.Phone}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell component="th" sx={{ fontWeight: 700 }}>First Name</TableCell>
                              <TableCell>{user?.FirstName}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell component="th" sx={{ fontWeight: 700 }}>Preferred First Name</TableCell>
                              <TableCell>{user?.PreferredName}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell component="th" sx={{ fontWeight: 700 }}>Last Name</TableCell>
                              <TableCell>{user?.LastName}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell component="th" sx={{ fontWeight: 700 }}>Pronouns</TableCell>
                              <TableCell>{user?.Gender}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell component="th" sx={{ fontWeight: 700 }}>Location</TableCell>
                              <TableCell>{user?.Location}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell component="th" sx={{ fontWeight: 700 }}>ID</TableCell>
                              <TableCell>{user?._id}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell component="th" sx={{ fontWeight: 700 }}>Created Date</TableCell>
                              <TableCell>{moment(user?.createdAt).format('MM-DD-YYYY')}</TableCell>
                            </TableRow>
                            {user?.AccessLevel !== INTERNAL_ADMIN.level &&
                              <TableRow>
                                <TableCell component="th" sx={{ fontWeight: 700 }}>Created By</TableCell>
                                <TableCell>{creator?.FirstName} {creator?.LastName}</TableCell>
                              </TableRow>}
                          </TableBody>
                        </Table>
                        {user?.ProfileImage && <div style={{ width: '50%' }}>
                          <Avatar alt="Remy Sharp" src={user?.ProfileImage} sx={{ width: 70, height: 70, marginTop: 2, float: 'right' }} />
                        </div>}
                      </div>
                    }
                  </TableContainer>
                </FlexCard>
              </Grid>
              <Grid item xs={12}>
                <FlexCard>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: 800, marginBottom: 1, fontSize: { xs: "1.4rem", md: "1.7rem" } }}>Organization</Typography>
                    {!editOrg && <CustomBtn onClick={() => setEditOrg(true)} variant="outlined" icon={<EditIcon sx={{ fontSize: 17 }} />} title="Edit" />}
                  </div>
                  <TableContainer component={Paper} sx={{ boxShadow: "none", border: 0 }} >
                    {editOrg &&
                      <>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                          <div style={{ width: '50%', marginRight: 20 }}>
                            <SelectDropdown
                              variant="standard"
                              setValue={setFormData}
                              label="Organization(s)"
                              name="organization"
                              data={organizations?.filter(x => !user?.Organization?.map(y => y._id)?.includes(x._id))}
                              required={true}
                              showAll={false}
                              getId={true}
                              value={formData['organization']}
                              showId={true}
                            />
                          </div>
                          <div>
                            <CustomBtn
                              onClick={() => { setMsg('Organization Updated Successfully!'); handleUpdateUser([], 'add'); }}
                              variant="contained"
                              title={"Add Organization"}
                              icon={<AddCircleOutlineIcon />}
                            />
                          </div>
                        </div>
                      </>
                    }
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell component="th" sx={{ fontWeight: 700 }}>Name</TableCell>
                          <TableCell component="th" sx={{ fontWeight: 700 }}>ID</TableCell>
                          {(user?.Organization?.length > 1 && editOrg) && <TableCell component="th" sx={{ fontWeight: 700 }}>Action</TableCell>}
                        </TableRow>
                        {user?.Organization?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)?.map((item, index) => (
                          <TableRow key={item?._id} sx={{ cursor: 'pointer' }}>
                            <TableCell onClick={() => router.push(`/organization/details/${item?._id}`)}>{item?.Name}</TableCell>
                            <TableCell onClick={() => router.push(`/organization/details/${item?._id}`)}>{item?._id}</TableCell>
                            {(user?.Organization?.length > 1 && editOrg) && <TableCell sx={{ color: 'red' }} onClick={() => { setMsg('Organization Updated Successfully!'); handleUpdateUser([], 'remove', item?._id) }}>Remove</TableCell>}
                          </TableRow>
                        ))}
                        {(page > 0 ? Math.max(0, (1 + page) * rowsPerPage - user?.Organization?.length) : 0) > 0 && (
                          <TableRow
                            style={{
                              height: 53 * (page > 0 ? Math.max(0, (1 + page) * rowsPerPage - user?.Organization?.length) : 0),
                            }}
                          >
                            <TableCell colSpan={6} />
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 20]}
                      component="div"
                      count={user?.Organization?.length ?? 0}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </TableContainer>
                </FlexCard>
              </Grid>
            </Grid>
            {(user?.AccessLevel === INTERNAL_MANAGER.level || user?.AccessLevel === INTERNAL_USER.level) &&
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FlexCard>
                    <Typography sx={{ fontWeight: 800, marginBottom: 1, fontSize: { xs: "1.4rem", md: "1.7rem" } }}>Placements</Typography>
                    <TableContainer component={Paper} sx={{ boxShadow: "none", border: 0 }}>
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell component="th" sx={{ fontWeight: 700 }}>Organization</TableCell>
                            <TableCell component="th" sx={{ fontWeight: 700 }}>Job Title</TableCell>
                            <TableCell component="th" sx={{ fontWeight: 700 }}>Status</TableCell>
                            <TableCell component="th" sx={{ fontWeight: 700 }}>Start Date</TableCell>
                          </TableRow>
                          {placement?.list?.slice(placementPage * placementRowsPerPage, placementPage * placementRowsPerPage + placementRowsPerPage)?.map((item, index) => (
                            <TableRow key={`placement_${index}`} onClick={() => router.push(`/placements/${item?.placementId ? item?.placementId?._id : item?._id}`)} sx={{ cursor: 'pointer' }}>
                              <TableCell>{item?.placementId ? item?.placementId?.Organization?.Name : item?.Organization?.Name}</TableCell>
                              <TableCell>{item?.placementId ? item?.placementId?.JobTitle : item?.JobTitle}</TableCell>
                              <TableCell><AgentStatusChip status={item?.placementId ? item?.placementId?.Status : item?.Status} /></TableCell>
                              <TableCell>{moment(item?.placementId ? item?.placementId?.StartDate : item?.StartDate).format('MM-DD-YYYY')}</TableCell>
                            </TableRow>
                          ))}
                          {(placementPage > 0 ? Math.max(0, (1 + placementPage) * placementRowsPerPage - placement?.list?.length) : 0) > 0 && (
                            <TableRow
                              style={{
                                height: 53 * (placementPage > 0 ? Math.max(0, (1 + placementPage) * placementRowsPerPage - placement?.list?.length) : 0),
                              }}
                            >
                              <TableCell colSpan={6} />
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 20]}
                      component="div"
                      count={placement?.list?.length ?? 0}
                      rowsPerPage={placementRowsPerPage}
                      page={placementPage}
                      onPageChange={handlePlacementChangePage}
                      onRowsPerPageChange={handlePlacementRowsPerPage}
                    />
                  </FlexCard>
                </Grid>
                <Grid item xs={12}>
                  <FlexCard>
                    <Typography sx={{ fontWeight: 800, marginBottom: 1, fontSize: { xs: "1.4rem", md: "1.7rem" } }}>Contracts</Typography>
                    <TableContainer component={Paper} sx={{ boxShadow: "none", border: 0 }}>
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell component="th" sx={{ fontWeight: 700 }}>Organization</TableCell>
                            <TableCell component="th" sx={{ fontWeight: 700 }}>Job Title</TableCell>
                            <TableCell component="th" sx={{ fontWeight: 700 }}>Status</TableCell>
                            <TableCell component="th" sx={{ fontWeight: 700 }}>Start Date</TableCell>
                          </TableRow>
                          {contracts?.data?.slice(contractPage * contractRowsPerPage, contractPage * contractRowsPerPage + contractRowsPerPage)?.map((item, index) => (
                            <TableRow key={`placement_${index}`} onClick={() => router.push(`/placements/${item?.placementId ? item?.placementId?._id : item?._id}`)} sx={{ cursor: 'pointer' }}>
                              <TableCell>{item?.placementId ? item?.placementId?.Organization?.Name : item?.Organization?.Name}</TableCell>
                              <TableCell>{item?.placementId ? item?.placementId?.JobTitle : item?.JobTitle}</TableCell>
                              <TableCell><AgentStatusChip status={item?.placementId ? item?.placementId?.Status : item?.Status} /></TableCell>
                              <TableCell>{moment(item?.placementId ? item?.placementId?.StartDate : item?.StartDate).format('MM-DD-YYYY')}</TableCell>
                            </TableRow>
                          ))}
                          {(contractPage > 0 ? Math.max(0, (1 + contractPage) * contractRowsPerPage - contracts?.data?.length) : 0) > 0 && (
                            <TableRow
                              style={{
                                height: 53 * (contractPage > 0 ? Math.max(0, (1 + contractPage) * contractRowsPerPage - contracts?.data?.length) : 0),
                              }}
                            >
                              <TableCell colSpan={6} />
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 20]}
                      component="div"
                      count={contracts?.data?.length ?? 0}
                      rowsPerPage={contractRowsPerPage}
                      page={contractPage}
                      onPageChange={handleContractChangePage}
                      onRowsPerPageChange={handleContractRowsPerPage}
                    />
                  </FlexCard>
                </Grid>
                <Grid item xs={12}>
                  <FlexCard>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography sx={{ fontWeight: 800, marginBottom: 1, fontSize: { xs: "1.4rem", md: "1.7rem" } }}>Manager</Typography>
                      {!editManger && <CustomBtn onClick={() => setEditManger(true)} variant="outlined" icon={<EditIcon sx={{ fontSize: 17 }} />} title="Edit" />}
                    </div>
                    <TableContainer component={Paper} sx={{ boxShadow: "none", border: 0 }}>
                      {editManger &&
                        <>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                            <div style={{ width: '50%', marginRight: 20 }}>
                              <SelectDropdown
                                variant="standard"
                                setValue={setFormData}
                                label="Search Managers"
                                name="manager"
                                data={managers}
                                required={true}
                                value={formData['manager']}
                                multiple={true}
                                defaultVal={user?.Manager?.map(x => x)}
                                disableDefault={true}
                                disableChip={true}
                              />
                            </div>
                            <div>
                              <CustomBtn
                                onClick={() => { setMsg('Manager Added Successfully!'); handleUpdateUser() }}
                                variant="contained"
                                title={"Add Manager"}
                                icon={<AddCircleOutlineIcon />}
                              />
                            </div>
                          </div>
                        </>
                      }
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell component="th" sx={{ fontWeight: 700 }}>Name</TableCell>
                            <TableCell component="th" sx={{ fontWeight: 700 }}>ID</TableCell>
                            <TableCell component="th" sx={{ fontWeight: 700 }}>Action</TableCell>
                          </TableRow>
                          {user?.Manager?.slice(managerPage * managerRowsPerPage, managerPage * managerRowsPerPage + managerRowsPerPage)?.map((item, index) => (
                            <TableRow key={`manager_${index}`}>
                              <TableCell>{item?.FirstName} {item?.LastName}</TableCell>
                              <TableCell>{item?._id}</TableCell>
                              {editManger ?
                                <TableCell onClick={() => { setMsg('Manager Removed Successfully!'); handleUpdateUser(user?.Manager?.filter(x => x._id !== item?._id)) }} sx={{ color: 'red', cursor: 'pointer' }}>Remove</TableCell> :
                                <TableCell><Link href={`/team/user/${item?._id}`} target={'_blank'} rel="noreferrer" underline="none">View <ArrowOutwardIcon style={{ height: '0.7em' }} /></Link></TableCell>}
                            </TableRow>
                          ))}
                          {(managerPage > 0 ? Math.max(0, (1 + managerPage) * managerRowsPerPage - user?.Manager?.length) : 0) > 0 && (
                            <TableRow
                              style={{
                                height: 53 * (managerPage > 0 ? Math.max(0, (1 + managerPage) * managerRowsPerPage - user?.Manager?.length) : 0),
                              }}
                            >
                              <TableCell colSpan={6} />
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                      <TablePagination
                        rowsPerPageOptions={[5, 10, 20]}
                        component="div"
                        count={user?.Manager?.length ?? 0}
                        rowsPerPage={managerRowsPerPage}
                        page={managerPage}
                        onPageChange={handleManagerChangePage}
                        onRowsPerPageChange={handleManagerRowsPerPage}
                      />
                    </TableContainer>
                  </FlexCard>
                </Grid>
                <Grid item xs={12}>
                  <FlexCard>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography sx={{ fontWeight: 800, marginBottom: 1, fontSize: { xs: "1.4rem", md: "1.7rem" } }}>Documents</Typography>
                      <CustomBtn onClick={() => setShowModal(true)} variant="outlined" icon={<FileUploadIcon sx={{ fontSize: 17 }} />} title="Upload" />
                    </div>
                    <TableContainer component={Paper} sx={{ boxShadow: "none", border: 0 }}>
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell component="th" sx={{ fontWeight: 700 }}>Document Name</TableCell>
                            <TableCell component="th" sx={{ fontWeight: 700 }}>Upload Date</TableCell>
                            <TableCell component="th" sx={{ fontWeight: 700 }}>Uploaded By</TableCell>
                            <TableCell component="th" sx={{ fontWeight: 700 }}>Actions</TableCell>
                            <TableCell component="th" sx={{ fontWeight: 700 }}></TableCell>
                          </TableRow>
                          {user?.Documents?.slice(docpage * docRowsPerPage, docpage * docRowsPerPage + docRowsPerPage)?.map((item, index) => (
                            <TableRow sx={{ cursor: 'pointer' }} key={`document_${index}`}>
                              <TableCell onClick={() => download(item?.Location)}>{item?.FileName}</TableCell>
                              <TableCell onClick={() => download(item?.Location)}>{moment(item?.createdAt).format('MM-DD-YYYY')}</TableCell>
                              <TableCell onClick={() => download(item?.Location)}>{usersList?.filter(x => x?._id === item?.CreatedBy)?.map(user => user?.FirstName + " " + user?.LastName)}</TableCell>
                              <TableCell sx={{ textDecoration: 'underline' }} onClick={() => { setSelectedDoc(item); setMenu(true) }}>Rename</TableCell>
                              <TableCell sx={{ textDecoration: 'underline', color: 'red' }} onClick={() => deleteDocument(item)}>Delete</TableCell>
                            </TableRow>
                          ))}
                          {(docpage > 0 ? Math.max(0, (1 + docpage) * docRowsPerPage - user?.Documents?.length) : 0) > 0 && (
                            <TableRow
                              style={{
                                height: 53 * (docpage > 0 ? Math.max(0, (1 + docpage) * docRowsPerPage - user?.Documents?.length) : 0),
                              }}
                            >
                              <TableCell colSpan={6} />
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 20]}
                      component="div"
                      count={user?.Documents?.length ?? 0}
                      rowsPerPage={docRowsPerPage}
                      page={docpage}
                      onPageChange={handleDocChangePage}
                      onRowsPerPageChange={handleDocRowsPerPage}
                    />
                  </FlexCard>
                </Grid>
              </Grid>
            }
          </> :
          <Loader show={!user ? true : false} />
        }
      </Layout>
      <DrawerBox
        anchor={'right'}
        open={menu}
        onClose={() => setMenu(false)}
        containerStyle={{ '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 700, alignItems: 'center', justifyContent: 'space-between' } }}
      >
        <Box sx={{ backgroundColor: '#F5F8FB', padding: 5, width: '100%' }}>
          <Typography sx={{ fontWeight: 'bolder', fontSize: 30 }}>Edit Document Name</Typography>
        </Box>
        <FlexCard containerStyle={{ height: '100%' }}>
          <Grid container spacing={2} >
            <Grid item xs={12}>
              <FlexField
                placeholder="File Name"
                variant="standard"
                setValue={setFormData}
                name='FileName'
                label="File Name"
                as='text'
                required={true}
                defaultVal={selectedDoc?.FileName}
              />
            </Grid>
            <Grid item xs={12}>
              <FlexField
                variant="standard"
                disabled={true}
                required={true}
                defaultVal={moment(selectedDoc?.createdAt).format('MM-DD-YYYY')}
                as='text'
                label="Upload Date"
              />
            </Grid>
            <Grid item xs={12}>
              <FlexField
                variant="standard"
                disabled={true}
                as='text'
                label="Uploaded By"
                required={true}
                defaultVal={usersList?.filter(x => x?._id === selectedDoc?.CreatedBy)?.map(user => user?.FirstName + " " + user?.LastName)}
              />
            </Grid>
          </Grid>
        </FlexCard>
        <Box sx={{ backgroundColor: '#F5F8FB', padding: 5, width: '100%', display: 'flex', justifyContent: 'center', }}>
          <CustomBtn onClick={() => updateDocument()} btnStyle={{ marginRight: 1 }} variant="contained" title={"Save"} disabled={formData['FileName'] ? false : true} />
          <CustomBtn onClick={() => setMenu(false)} variant="outlined" title={"Close"} />
        </Box>
      </DrawerBox>
      <SnackAlert
        show={showSnack}
        type={type}
        handleClose={() => setShowSnack(false)}
        msg={msg}
      />
      <DialogBox
        open={showModal}
        handleClose={() => setShowModal(false)}
        title='Upload document'
        msg={`Upload a document or add a link below:`}
      >
        <UploadDocumentModal
          user={user}
          handleClose={() => setShowModal(false)}
        />
      </DialogBox>
      <DialogBox
        open={deleteUserModal}
        handleClose={() => setDeleteUserModal(false)}
        title="Delete User"
      >
        <MessageModal
          msg={"Are you sure you want to delete this user?"}
          handleClose={() => setDeleteUserModal(false)}
          handleRemove={() => deleteUser.mutate()}
          removeBtnTitle="Delete"
        />
      </DialogBox>
      <DialogBox
        open={imageModal}
        handleClose={() => setImageModal(false)}
        title='Upload image'
        msg={`Upload a document or add a link below:`}
      >
        <UploadProfileImage
          user={user}
          handleClose={() => setImageModal(false)}
          handleOnSave={() => handleOnSave}
          setValue={setFormData}
          setImage={setImage}
          setSelectedImage={setSelectedImage}
        />
      </DialogBox>
    </>
  );
}


