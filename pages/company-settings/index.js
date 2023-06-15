import Head from "next/head";
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation } from 'react-query';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useReducer } from 'react';
import { countryList } from '../../utils/data';
import EditIcon from '@mui/icons-material/Edit';
import UserService from '../../Services/UserService';
import MenuBox from '../../components/global/MenuBox';
import FlexCard from '../../components/global/FlexCard';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Layout } from '../../components/global/Layout';
import FlexField from '../../components/global/FlexField';
import DrawerBox from '../../components/global/DrawerBox';
import CustomBtn from '../../components/global/CustomBtn';
import SnackAlert from '../../components/global/SnackAlert';
import DialogBox from '../../components/dialogBox/DialogBox';
import { BodyHeader } from '../../components/global/BodyHeader';
import MessageModal from '../../components/dialogBox/MessageModal';
import SelectDropdown from '../../components/global/SelectDropdown';
import OrganizationService from '../../Services/OrganizationService';
import { selectAuth, setOrganization, } from '../../store/authSlice';
import AgentStatusChip from '../../components/global/AgentStatusChip';
import { tabProps, TabPanel } from '../../components/global/TabPanel';
import { formReducer, getUsersList } from '../../utils/globalFunctions';
import { Box, Grid, MenuItem, Tab, Tabs, Paper, Table, TableCell, TableContainer, TableRow, Typography, TableBody, Link } from '@mui/material';
import { accessLevel, accessLevelClientBillingAdmin, accessLevelClientSuperAdmin, accessLevelClientUser, accessLevelInternalManager, CLIENT_BILLING_ADMIN, CLIENT_SUPER_ADMIN, CLIENT_USER, INTERNAL_ADMIN, INTERNAL_MANAGER } from '../../utils';


export default function CompanySettings() {

  const organization = useSelector(state => state.authUser.selectedOrganization);
  const usersList = useSelector(state => state.dataSlice.usersList);
  const [formData, setFormData] = useReducer(formReducer, {});
  const [deleteModal, setDeleteModal] = useState(false);
  const [billingEdit, setBillingEdit] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [showSnack, setShowSnack] = useState(false);
  const user = useSelector(selectAuth)?.userData;
  const [anchorEl, setAnchorEl] = useState(null);
  const [selected, setSelected] = useState({});
  const [members, setMembers] = useState([]);
  const [menu, setMenu] = useState(false);
  const [type, setType] = useState(null);
  const [msg, setMsg] = useState(false);
  const [value, setValue] = useState(0);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();
  const router = useRouter();


  const handleMenu = (event, member) => {
    setSelected(member);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const Columns = [
    {
      field: 'FirstName',
      flex: 1,
      headerName: 'Name',
      renderCell: (params) => {
        return (
          <Typography>{params.row.FirstName} {params.row.LastName}</Typography>
        );
      }
    },
    {
      field: 'Email',
      flex: 1,
      headerName: 'Email'
    },
    {
      field: 'AccessLevel',
      flex: 1,
      headerName: 'Role'
    },
    {
      field: 'Status',
      flex: 1,
      headerName: 'Status',
      renderCell: (params) => {
        return (
          <AgentStatusChip status={params.row.Status} />
        );
      }
    },
    {
      field: 'actions',
      flex: 1,
      headerName: 'Actions',
      renderCell: (params) => {
        return (
          <MoreVertIcon onClick={(e) => handleMenu(e, params.row)} />
        );
      }
    },
  ];

  const removeUser = useMutation(() => UserService.deleteUser(selected?._id), {
    onSettled: async (res) => {
      getUsersList();
      if (res?.success) {
        setMenu(false);
        setMsg('Member Removed Successfully!');
        setType('success');
        setShowSnack(true);
      } else {
        setType('Error');
        setMsg('Failed please try again!');
        setShowSnack(true);
      }
    }
  });
  const updateUser = useMutation((data) => UserService.updateUser(selected?._id, data), {
    onSettled: async (res) => {
      getUsersList();
      if (res?.success) {
        setMenu(false);
        setMsg('Member Updated Successfully!');
        setType('success');
        setShowSnack(true);
      } else {
        setType('Error');
        setMsg('Failed please try again!');
        setShowSnack(true);
      }
    }
  });

  const handleUpdateMember = () => {
    let temp = {
      FirstName: formData?.firstName ? formData?.firstName : selected?.FirstName,
      LastName: formData?.lastName ? formData?.lastName : selected?.LastName,
      Phone: selected?.Phone,
      Email: formData?.email ? formData?.email : selected?.Email,
      PreferredName: selected?.PreferredName,
      AccessLevel: formData?.accessLevel ? formData?.accessLevel : selected?.AccessLevel,
      Organization: selected?.Organization.map(x => x._id),
      Gender: selected?.Gender,
      country: selected?.Location,
      manager: selected?.Manager
    }
    if (Object.keys(formData)?.length > 0) {
      updateUser.mutate(temp)
    }
  }
  const updateOrg = useMutation((data) => OrganizationService.updateOrganization(organization?._id, data), {
    onSettled: async (res) => {
      if (res?.success) {
        dispatch(setOrganization({ org: res?.org }))
        setIsEditable(false);
        setBillingEdit(false);
        setType('success');
        setShowSnack(true);
      } else {
        setMsg("Error occured please try again!")
        setType('error');
        setShowSnack(true);
      }
    }
  })

  const handleOnSubmit = () => {
    setIsSubmitted(true);
    let temp = {
      Name: formData['Name'] ? formData['Name'] : organization?.Name,
      OrganizationType: organization?.OrganizationType,
      BillingContactEmail: formData['BillingContactEmail'] ? formData['BillingContactEmail'] : organization?.BillingContactEmail,
      BillingContactPhone: formData['BillingContactPhone'] ? formData['BillingContactPhone'] : organization?.BillingContactPhone,
      BillingContactFirstName: formData['BillingContactFirstName'] ? formData['BillingContactFirstName'] : organization?.BillingContactFirstName,
      BillingContactLastName: formData['BillingContactLastName'] ? formData['BillingContactLastName'] : organization?.BillingContactLastName,
      BillingAddress: formData['BillingAddress'] ? formData['BillingAddress'] : organization?.BillingAddress,
      BillingAddress2: organization?.BillingAddress2,
      BillingCity: formData['BillingCity'] ? formData['BillingCity'] : organization?.BillingCity,
      BillingState: formData['BillingState'] ? formData['BillingState'] : organization?.BillingState,
      BillingPostalCode: formData['BillingPostalCode'] ? formData['BillingPostalCode'] : organization?.BillingPostalCode,
      BillingCountry: formData['BillingCountry'] ? formData['BillingCountry'] : organization?.BillingCountry,
      Address1: formData['Address1'] ? formData['Address1'] : organization?.Address1,
      Address2: organization?.Address2,
      City: formData['City'] ? formData['City'] : organization?.City,
      State: formData['State'] ? formData['State'] : organization?.State,
      PostalCode: formData['PostalCode'] ? formData['PostalCode'] : organization?.PostalCode,
      Country: formData['Country'] ? formData['Country'] : organization?.Country,
      CreatedBy: organization?.CreatedBy
    };
    updateOrg.mutate(temp)
  }

  useEffect(() => {
    if (router.query?.tab) {
      setValue(Number(router.query?.tab));
    }
  }, [router.query])

  useEffect(() => {
    setMembers(usersList?.filter(x => {
      let OrgIds = [];
      x?.Organization?.map(y => OrgIds.push(y._id));
      if (user?.AccessLevel === CLIENT_USER.level) {
        if ((x?._id === user?._id) || (OrgIds.includes(organization?._id) && x?.AccessLevel === user?.AccessLevel)) {
          return x;
        }
      } else {
        if ((x?._id === user?._id) || (x?.CreatedBy === user?._id && OrgIds.includes(organization?._id))) {
          return x;
        }
      }
    }));
  }, [usersList])

  return (
    <>
      <Head>
        <title>Company Settings | Flexscale</title>
      </Head>
      <Layout>

        <BodyHeader title={"Company Settings"} subtitle={"Update company details and manage users."} />
        <MenuBox
          anchorEl={anchorEl}
          open={open}
          handleClose={handleClose}
        >
          <MenuItem onClick={() => { router.push(`company-settings/${selected?._id}`) }}>View</MenuItem>
          {(user?.AccessLevel === CLIENT_USER.level && user?._id === selected?._id) || user?.AccessLevel !== CLIENT_USER.level ? <MenuItem onClick={() => { handleClose(); setMenu(true) }}>Edit</MenuItem> : null}
          {(user?.AccessLevel !== CLIENT_USER.level && user?._id === selected?._id) && <MenuItem onClick={() => { handleClose(); setDeleteModal(true) }}>Delete</MenuItem>}
        </MenuBox>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange}>
            <Tab label={`Information`} {...tabProps(0)} />
            <Tab label={`Users (${members?.length})`} {...tabProps(1)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <Grid container spacing={2}>
            <Grid item lg={12} md={12}>
              <FlexCard>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ fontWeight: 800, marginBottom: 1, fontSize: { xs: "1.4rem", md: "1.7rem" } }}>General</Typography>
                  {!isEditable && <CustomBtn onClick={() => setIsEditable(true)} variant="outlined" icon={<EditIcon sx={{ fontSize: 17 }} />} title="Edit" />}
                </div>
                <TableContainer component={Paper} sx={{ boxShadow: "none", border: 0 }}>
                  {isEditable ?
                    <>
                      <Grid item xs={12}>
                        <FlexField
                          variant="standard"
                          setValue={setFormData}
                          name='Name'
                          as='text'
                          label="Company Name"
                          isSubmitted={isSubmitted}
                          required={true}
                          defaultVal={organization?.Name}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FlexField
                          variant="standard"
                          as='text'
                          label="Company Id"
                          defaultVal={organization?._id}
                          disabled={true}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FlexField
                          variant="standard"
                          setValue={setFormData}
                          name='Address1'
                          as='text'
                          label="Address"
                          defaultVal={organization?.Address1}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FlexField
                          variant="standard"
                          setValue={setFormData}
                          name='City'
                          as='text'
                          defaultVal={organization?.City}
                          label="City"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FlexField
                          variant="standard"
                          setValue={setFormData}
                          name='State'
                          as='text'
                          defaultVal={organization?.State}
                          label="State/Province"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <SelectDropdown
                          setValue={setFormData}
                          label="Country"
                          name="Country"
                          data={countryList}
                          variant="standard"
                          showAll={false}
                          defaultVal={organization?.Country ? { title: organization?.Country } : null}
                          searchable={true}
                          helperText="Start typing and we will help you find the right country."
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FlexField
                          variant="standard"
                          setValue={setFormData}
                          name='PostalCode'
                          as='text'
                          defaultVal={organization?.PostalCode}
                          label="Postal Code"
                        />
                      </Grid>
                      <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                        <CustomBtn onClick={() => setIsEditable(false)} btnStyle={{ marginRight: 1 }} variant="outlined" title={"Cancel"} />
                        <CustomBtn onClick={() => { setMsg('General Info Updated Successfully.'); handleOnSubmit() }} variant="contained" title={"Save"} />
                      </div>
                    </>
                    :
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell component="th" sx={{ fontWeight: 800, width: '50%' }}>Company Name</TableCell>
                          <TableCell>{organization?.Name} </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" sx={{ fontWeight: 800, width: '50%' }}>Company ID</TableCell>
                          <TableCell>{organization?._id}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" sx={{ fontWeight: 800, width: '50%' }}>Address</TableCell>
                          <TableCell>{organization?.Address1}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" sx={{ fontWeight: 800, width: '50%' }}>City</TableCell>
                          <TableCell>{organization?.City}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" sx={{ fontWeight: 800, width: '50%' }}>State/Province</TableCell>
                          <TableCell>{organization?.State}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" sx={{ fontWeight: 800, width: '50%' }}>Postal Code</TableCell>
                          <TableCell>{organization?.PostalCode}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" sx={{ fontWeight: 800, width: '50%' }}>Country</TableCell>
                          <TableCell>{organization?.Country}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  }
                </TableContainer>
              </FlexCard>
            </Grid>
            <Grid item lg={12} md={12} sx={{ mt: 5 }}>
              <FlexCard>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ fontWeight: 800, marginBottom: 1, fontSize: { xs: "1.4rem", md: "1.7rem" } }}>Billing Information</Typography>
                  {!billingEdit && <CustomBtn onClick={() => setBillingEdit(true)} variant="outlined" icon={<EditIcon sx={{ fontSize: 17 }} />} title="Edit" />}
                </div>
                {billingEdit ?
                  <>
                    <Grid item xs={12}>
                      <FlexField
                        variant="standard"
                        setValue={setFormData}
                        name='BillingContactFirstName'
                        as='text'
                        label="Billing Contact First Name"
                        defaultVal={organization?.BillingContactFirstName}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FlexField
                        variant="standard"
                        setValue={setFormData}
                        name='BillingContactLastName'
                        as='text'
                        defaultVal={organization?.BillingContactLastName}
                        label="Billing Contact Last Name"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FlexField
                        variant="standard"
                        setValue={setFormData}
                        name='BillingContactEmail'
                        as='text'
                        defaultVal={organization?.BillingContactEmail}
                        label="Billing Contact Email"
                        required={true}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FlexField
                        variant="standard"
                        setValue={setFormData}
                        name='BillingContactPhone'
                        as='text'
                        label="Billing Contact Phone"
                        isSubmitted={isSubmitted}
                        defaultVal={organization?.BillingContactPhone}
                        required={true}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FlexField
                        variant="standard"
                        setValue={setFormData}
                        name='BillingAddress'
                        as='text'
                        label="Billing Address"
                        required={true}
                        defaultVal={organization?.BillingAddress}
                        isSubmitted={isSubmitted}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FlexField
                        variant="standard"
                        setValue={setFormData}
                        name='BillingCity'
                        as='text'
                        defaultVal={organization?.BillingCity}
                        label="Billing City"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FlexField
                        variant="standard"
                        setValue={setFormData}
                        name='BillingState'
                        as='text'
                        defaultVal={organization?.BillingState}
                        label="Billing State"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FlexField
                        variant="standard"
                        setValue={setFormData}
                        name='BillingPostalCode'
                        defaultVal={organization?.BillingPostalCode}
                        label="Postal Code"
                        as='text'
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <SelectDropdown
                        setValue={setFormData}
                        label="Country"
                        name="BillingCountry"
                        data={countryList}
                        variant="standard"
                        defaultVal={organization?.BillingCountry ? { title: organization?.BillingCountry } : null}
                        showAll={false}
                        searchable={true}
                        helperText="Start typing and we will help you find the right country."
                      />
                    </Grid>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                      <CustomBtn onClick={() => setBillingEdit(false)} btnStyle={{ marginRight: 1 }} variant="outlined" title={"Cancel"} />
                      <CustomBtn onClick={() => { setMsg("Biling Info Updated Successfully."); handleOnSubmit() }} variant="contained" title={"Save"} />
                    </div>
                  </>
                  :
                  <TableContainer component={Paper} sx={{ boxShadow: "none", border: 0 }}>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell component="th" sx={{ fontWeight: 800, width: '50%' }}>Name</TableCell>
                          <TableCell>{organization?.BillingContactFirstName} {organization?.BillingContactLastName}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" sx={{ fontWeight: 800, width: '50%' }}>Email</TableCell>
                          <TableCell>{organization?.BillingContactEmail}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" sx={{ fontWeight: 800, width: '50%' }}>Phone</TableCell>
                          <TableCell>{organization?.BillingContactPhone}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" sx={{ fontWeight: 800, width: '50%' }}>Address</TableCell>
                          <TableCell>{organization?.BillingAddress}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" sx={{ fontWeight: 800, width: '50%' }}>City</TableCell>
                          <TableCell>{organization?.BillingCity}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" sx={{ fontWeight: 800, width: '50%' }}>State/Province</TableCell>
                          <TableCell>{organization?.BillingState}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" sx={{ fontWeight: 800, width: '50%' }}>Postal Code</TableCell>
                          <TableCell>{organization?.BillingPostalCode}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" sx={{ fontWeight: 800, width: '50%' }}>Country</TableCell>
                          <TableCell>{organization?.BillingCountry}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                }
              </FlexCard>

            </Grid>
          </Grid>
        </TabPanel>
        <TabPanel value={value} index={1}>
          {(user?.AccessLevel !== CLIENT_USER.level && user?.AccessLevel !== CLIENT_BILLING_ADMIN.level) &&
            <FlexCard>
              <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                <Grid item xs={6}>
                  <Typography sx={{ fontWeight: 700 }}>Actions</Typography>
                </Grid>
                <Grid item xs={6} >
                  <CustomBtn
                    title={"Invite User"}
                    variant='contained'
                    btnStyle={{ borderRadius: 10, fontSize: 12, float: 'right' }}
                    onClick={() => router.push("/company-settings/addnew")}
                  />
                </Grid>
              </Grid>
            </FlexCard>
          }
          <Box sx={{ width: '100%', background: "white" }}>
            <DataGrid
              getRowId={(row) => row._id}
              className='clickable-rows'
              autoHeight={true}
              showColumnRightBorder={false}
              rows={members ?? []}
              columns={Columns}
              hideFooterSelectedRowCount={true}
              pageSize={10}
              editMode='row'
              rowsPerPageOptions={[5, 10, 20, 50]}
            />
          </Box>
        </TabPanel>
        <DrawerBox
          anchor={'right'}
          open={menu}
          onClose={() => setMenu(false)}
          containerStyle={{ '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 700, alignItems: 'center', justifyContent: 'space-between' } }}
        >
          <Box sx={{ backgroundColor: '#F5F8FB', padding: 5, width: '100%' }}>
            <Typography sx={{ fontWeight: 'bolder', fontSize: 30 }}>Edit team member</Typography>
            <Typography>Update information on team members and save changes.</Typography>
          </Box>
          <FlexCard containerStyle={{ height: '100%' }}>
            <Grid container spacing={2} >
              <Grid item xs={12}>
                <FlexField
                  placeholder="First Name"
                  variant="standard"
                  setValue={setFormData}
                  name='firstName'
                  label="First Name"
                  required={true}
                  defaultVal={selected?.FirstName}
                />
              </Grid>
              <Grid item xs={12}>
                <FlexField
                  placeholder="Last Name"
                  variant="standard"
                  setValue={setFormData}
                  name='lastName'
                  required={true}
                  defaultVal={selected?.LastName}
                  label="Last Name"
                />
              </Grid>
              <Grid item xs={12}>
                <FlexField
                  placeholder="Email"
                  variant="standard"
                  setValue={setFormData}
                  name='email'
                  as='email'
                  label="Email"
                  required={true}
                  defaultVal={selected?.Email}
                />
              </Grid>
              <Grid item xs={12}>
                <SelectDropdown
                  variant="standard"
                  setValue={setFormData}
                  label="Access Level"
                  getAccessMethods={true}
                  name="accessLevel"
                  data={user?.AccessLevel === INTERNAL_ADMIN.level ? accessLevel : user?.AccessLevel === INTERNAL_MANAGER.level ? accessLevelInternalManager : user?.AccessLevel === CLIENT_SUPER_ADMIN.level ? accessLevelClientSuperAdmin : user?.AccessLevel === CLIENT_BILLING_ADMIN.level ? accessLevelClientBillingAdmin : accessLevelClientUser}
                  showAll={false}
                  required={true}
                  helperText="Based on the access level, it will provide access to clients or internal applications."
                  defaultVal={selected?.AccessLevel}
                />
              </Grid>

            </Grid>
          </FlexCard>
          <Box sx={{ backgroundColor: '#F5F8FB', padding: 5, width: '100%', display: 'flex', justifyContent: 'center', }}>
            <CustomBtn onClick={() => handleUpdateMember()} btnStyle={{ marginRight: 1 }} variant="contained" title={"Save"} />
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
          open={deleteModal}
          handleClose={() => setDeleteModal(false)}
          title='Remove team member'
        >
          <MessageModal
            handleClose={() => setDeleteModal(false)}
            handleRemove={() => { removeUser.mutate(); setDeleteModal(false) }}
            msg={`Are you sure you want to remove this team member? \n\n They will lose access to ${(Object.keys(selected).length > 0 && selected?.Organization) ? selected?.Organization[0]?.Name : ''} . You can invite them again to ${Object.keys(selected).length > 0 && selected?.Organization ? selected?.Organization[0]?.Name : ''}  if you change your mind.`}
          />
        </DialogBox>
      </Layout>
    </>
  );
}