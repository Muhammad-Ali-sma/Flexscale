import moment from 'moment';
import Head from "next/head";
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import EditIcon from '@mui/icons-material/Edit';
import { countryList } from "../../../utils/data";
import { useMutation, useQuery } from "react-query";
import Loader from "../../../components/global/Loader";
import { useState, useReducer, useEffect } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FlexCard from "../../../components/global/FlexCard";
import RadioBtn from "../../../components/global/RadioBtn";
import { Layout } from '../../../components/global/Layout';
import CustomBtn from '../../../components/global/CustomBtn';
import FlexField from '../../../components/global/FlexField';
import SnackAlert from "../../../components/global/SnackAlert";
import DialogBox from "../../../components/dialogBox/DialogBox";
import PlacementService from "../../../Services/PlacementService";
import { BodyHeader } from '../../../components/global/BodyHeader';
import SelectDropdown from '../../../components/global/SelectDropdown';
import OrganizationService from '../../../Services/OrganizationService';
import AgentStatusChip from "../../../components/global/AgentStatusChip";
import { formReducer, getOrganizationList, getUser } from "../../../utils/globalFunctions";
import { Grid, Paper, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, Typography } from '@mui/material';
import MessageModal from '../../../components/dialogBox/MessageModal';
import { accessLevel } from '../../../utils';


export default function OrganizationDetails() {

  const router = useRouter()
  const { id } = router.query;
  const [page, setPage] = useState(0);
  const [msg, setMsg] = useState(false);
  const [type, setType] = useState(null);
  const [users, setUsers] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showSnack, setShowSnack] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [contractPage, setContractPage] = useState(0);
  const [placementPage, setPlacementPage] = useState(0);
  const [billingEdit, setBillingEdit] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [orgDeleteModal, setOrgDeleteModal] = useState(false);
  const [formData, setFormData] = useReducer(formReducer, {});
  const usersList = useSelector(state => state.dataSlice.usersList);
  const [contractRowsPerPage, setContractRowsPerPage] = useState(5);
  const [placementRowsPerPage, setPlacementRowsPerPage] = useState(5);
  const organization = useSelector(state => state.dataSlice.OrganizationList?.filter(x => x?._id === id)[0]);
  const creator = getUser('_id', organization?.CreatedBy)[0];

  const { data: list } = useQuery(['getPlacements'], () => PlacementService.getPlacements(id), {
    enabled: organization ? true : false
  });

  const updateOrg = useMutation((data) => OrganizationService.updateOrganization(id, data), {
    onSettled: (res) => {
      getOrganizationList();
      if (res?.success) {
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
  const deleteOrganization = useMutation(() => OrganizationService.deleteOrganization(id), {
    onSettled: (res) => {
      getOrganizationList();
      if (res?.success) {
        setOrgDeleteModal(false);
        router.back();
      } else {
        setMsg("Error occured please try again!");
        setType('error');
        setShowSnack(true);
      }
    }
  })

  const handleOnSubmit = () => {
    setIsSubmitted(true);
    let temp = {
      Name: formData['Name'] ? formData['Name'] : organization?.Name,
      OrganizationType: formData['OrganizationType'] ? formData['OrganizationType'] : organization?.OrganizationType,
      BillingContactEmail: formData['BillingContactEmail'] ? formData['BillingContactEmail'] : organization?.BillingContactEmail,
      BillingContactPhone: formData['BillingContactPhone'] ? formData['BillingContactPhone'] : organization?.BillingContactPhone,
      BillingContactFirstName: formData['BillingContactFirstName'] ? formData['BillingContactFirstName'] : organization?.BillingContactFirstName,
      BillingContactLastName: formData['BillingContactLastName'] ? formData['BillingContactLastName'] : organization?.BillingContactLastName,
      BillingAddress: formData['BillingAddress'] ? formData['BillingAddress'] : organization?.BillingAddress,
      BillingAddress2: formData['BillingAddress2'] ? formData['BillingAddress2'] : organization?.BillingAddress2,
      BillingCity: formData['BillingCity'] ? formData['BillingCity'] : organization?.BillingCity,
      BillingState: formData['BillingState'] ? formData['BillingState'] : organization?.BillingState,
      BillingPostalCode: formData['BillingPostalCode'] ? formData['BillingPostalCode'] : organization?.BillingPostalCode,
      BillingCountry: formData['BillingCountry'] ? formData['BillingCountry'] : organization?.BillingCountry,
      Address1: formData['Address1'] ? formData['Address1'] : organization?.Address1,
      Address2: formData['Address2'] ? formData['Address2'] : organization?.Address2,
      City: formData['City'] ? formData['City'] : organization?.City,
      State: formData['State'] ? formData['State'] : organization?.State,
      PostalCode: formData['PostalCode'] ? formData['PostalCode'] : organization?.PostalCode,
      Country: formData['Country'] ? formData['Country'] : organization?.Country,
      CreatedBy: organization?.CreatedBy
    };
    updateOrg.mutate(temp)
  }
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleChangePlacementPage = (event, newPage) => {
    setPlacementPage(newPage);
  };
  const handleChangePlacementRowsPerPage = (event) => {
    setPlacementRowsPerPage(parseInt(event.target.value, 10));
    setPlacementPage(0);
  };
  const handleChangeContractPage = (event, newPage) => {
    setContractPage(newPage);
  };
  const handleChangeContractRowsPerPage = (event) => {
    setContractRowsPerPage(parseInt(event.target.value, 10));
    setContractPage(0);
  };

  useEffect(() => {
    if (!organization) {
      router.push('/organization')
    }
    setUsers(usersList?.filter(x => {
      let OrgIds = [];
      x?.Organization?.map(y => OrgIds.push(y._id));
      if (OrgIds.includes(id)) {
        return x;
      }
    }))
  }, [])

  return (
    <>
      <Head>
        <title>Organization | Flexscale</title>
      </Head>
      <Layout>
        {organization ?
          <>
            <BodyHeader
              title={`${organization?.Name}`}
              button={<CustomBtn
                onClick={() => router.back()}
                variant="outlined"
                icon={<ArrowBackIcon />}
                title="Go Back"
              />
              }
              handleRemove={() => setOrgDeleteModal(true)}
              containerStyle={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}
            />

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FlexCard>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: 800, marginBottom: 1, fontSize: { xs: "1.4rem", md: "1.7rem" } }}>General</Typography>
                    {!isEditable && <CustomBtn onClick={() => setIsEditable(true)} variant="outlined" icon={<EditIcon sx={{ fontSize: 17 }} />} title="Edit" />}
                  </div>
                  <TableContainer component={Paper} sx={{ boxShadow: "none", border: 0 }} className="spacer-input">
                    {isEditable ?
                      <>
                        <Grid item xs={12} md={6} lg={6} >
                          <FlexField
                            variant="standard"
                            setValue={setFormData}
                            name='Name'
                            as='text'
                            label="Organization Name"
                            isSubmitted={isSubmitted}
                            required={true}
                            defaultVal={organization?.Name}
                          />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                          <RadioBtn
                            handleChange={setFormData}
                            label="Type"
                            required={true}
                            name="OrganizationType"
                            defaultVal={organization?.OrganizationType}
                          />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                          <FlexField
                            variant="standard"
                            setValue={setFormData}
                            name='Address1'
                            as='text'
                            label="Address"
                            defaultVal={organization?.Address1}
                          />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                          <FlexField
                            variant="standard"
                            setValue={setFormData}
                            name='Address2'
                            as='text'
                            defaultVal={organization?.Address2}
                            label="Apartment, suite, etc."
                          />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                          <FlexField
                            variant="standard"
                            setValue={setFormData}
                            name='City'
                            as='text'
                            defaultVal={organization?.City}
                            label="City"
                          />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                          <FlexField
                            variant="standard"
                            setValue={setFormData}
                            name='State'
                            as='text'
                            defaultVal={organization?.State}
                            label="State/Province"
                          />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
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
                        <Grid item xs={12} md={6} lg={6}>
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
                      <Table className='custom-responsive'>
                        <TableBody>
                          <TableRow>
                            <TableCell component="th" sx={{ fontWeight: 800, width: '50%' }}>Full Name</TableCell>
                            <TableCell>{organization?.Name} </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell component="th" sx={{ fontWeight: 800, width: '50%' }}>Type</TableCell>
                            <TableCell>{organization?.OrganizationType}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell component="th" sx={{ fontWeight: 800, width: '50%' }}>Stripe Customer ID</TableCell>
                            <TableCell>{organization?.StripeId}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell component="th" sx={{ fontWeight: 800, width: '50%' }}>Address</TableCell>
                            <TableCell>{organization?.Address1}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell component="th" sx={{ fontWeight: 800, width: '50%' }}>Apartment, suite, etc.</TableCell>
                            <TableCell>{organization?.Address2}</TableCell>
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
                          <TableRow>
                            <TableCell component="th" sx={{ fontWeight: 800, width: '50%' }}>Created Date</TableCell>
                            <TableCell>{moment(organization?.createdAt).format('MMM D,YYYY')}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell component="th" sx={{ fontWeight: 800, width: '50%' }}>Created By</TableCell>
                            <TableCell>{creator?.FirstName} {creator?.LastName}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    }
                  </TableContainer>
                </FlexCard>
              </Grid>
              <Grid item xs={12} className="spacer-input">
                <FlexCard>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: 800, marginBottom: 1, fontSize: { xs: "1.4rem", md: "1.7rem" } }}>Billing Information</Typography>
                    {!billingEdit && <CustomBtn onClick={() => setBillingEdit(true)} variant="outlined" icon={<EditIcon sx={{ fontSize: 17 }} />} title="Edit" />}
                  </div>
                  {billingEdit ?
                    <>
                      <Grid item xs={12} md={6} lg={6}>
                        <FlexField
                          variant="standard"
                          setValue={setFormData}
                          name='BillingContactFirstName'
                          as='text'
                          label="Billing Contact First Name"
                          defaultVal={organization?.BillingContactFirstName}
                        />
                      </Grid>
                      <Grid item xs={12} md={6} lg={6}>
                        <FlexField
                          variant="standard"
                          setValue={setFormData}
                          name='BillingContactLastName'
                          as='text'
                          defaultVal={organization?.BillingContactLastName}
                          label="Billing Contact Last Name"
                        />
                      </Grid>
                      <Grid item xs={12} md={6} lg={6}>
                        <FlexField
                          variant="standard"
                          setValue={setFormData}
                          name='BillingContactEmail'
                          as='email'
                          defaultVal={organization?.BillingContactEmail}
                          label="Billing Contact Email"
                          required={true}
                        />
                      </Grid>
                      <Grid item xs={12} md={6} lg={6}>
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
                      <Grid item xs={12} md={6} lg={6}>
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
                      <Grid item xs={12} md={6} lg={6}>
                        <FlexField
                          variant="standard"
                          setValue={setFormData}
                          name='BillingAddress2'
                          defaultVal={organization?.BillingAddress2}
                          as='text'
                          label="Apartment, suite, etc."
                        />
                      </Grid>
                      <Grid item xs={12} md={6} lg={6}>
                        <FlexField
                          variant="standard"
                          setValue={setFormData}
                          name='BillingCity'
                          as='text'
                          defaultVal={organization?.BillingCity}
                          label="Billing City"
                        />
                      </Grid>
                      <Grid item xs={12} md={6} lg={6}>
                        <FlexField
                          variant="standard"
                          setValue={setFormData}
                          name='BillingState'
                          as='text'
                          defaultVal={organization?.BillingState}
                          label="Billing State"
                        />
                      </Grid>
                      <Grid item xs={12} md={6} lg={6}>
                        <FlexField
                          variant="standard"
                          setValue={setFormData}
                          name='BillingPostalCode'
                          defaultVal={organization?.BillingPostalCode}
                          label="Postal Code"
                          as='text'
                        />
                      </Grid>
                      <Grid item xs={12} md={6} lg={6}>
                        <SelectDropdown
                          setValue={setFormData}
                          label="Country"
                          name="BillingCountry"
                          data={countryList}
                          variant="standard"
                          defaultVal={organization?.BillingCountry ?? null}
                          searchable={true}
                          showAll={false}
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
                      <Table className='custom-responsive'>
                        <TableBody>
                          <TableRow>
                            <TableCell component="th" sx={{ fontWeight: 800, width: '50%' }}>Contact First Name</TableCell>
                            <TableCell>{organization?.BillingContactFirstName}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell component="th" sx={{ fontWeight: 800, width: '50%' }}>Contact Last Name</TableCell>
                            <TableCell>{organization?.BillingContactLastName}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell component="th" sx={{ fontWeight: 800, width: '50%' }}>Contact Email</TableCell>
                            <TableCell>{organization?.BillingContactEmail}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell component="th" sx={{ fontWeight: 800, width: '50%' }}>Contact Phone</TableCell>
                            <TableCell>{organization?.BillingContactPhone}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell component="th" sx={{ fontWeight: 800, width: '50%' }}>Billing Address</TableCell>
                            <TableCell>{organization?.BillingAddress}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell component="th" sx={{ fontWeight: 800, width: '50%' }}>Apartment, suite, etc.</TableCell>
                            <TableCell>{organization?.BillingAddress2}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell component="th" sx={{ fontWeight: 800, width: '50%' }}>Billing City</TableCell>
                            <TableCell>{organization?.BillingCity}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell component="th" sx={{ fontWeight: 800, width: '50%' }}>Billing State/Province</TableCell>
                            <TableCell>{organization?.BillingState}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell component="th" sx={{ fontWeight: 800, width: '50%' }}>Billing Postal Code</TableCell>
                            <TableCell>{organization?.BillingPostalCode}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell component="th" sx={{ fontWeight: 800, width: '50%' }}>Billing Country</TableCell>
                            <TableCell>{organization?.BillingCountry}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  }
                </FlexCard>
              </Grid>
              <Grid item xs={12}>
                <FlexCard>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: 800, marginBottom: 1, fontSize: { xs: "1.4rem", md: "1.7rem" } }}>Users</Typography>
                  </div>
                  <TableContainer component={Paper} sx={{ boxShadow: "none", border: 0 }}>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell component="th" sx={{ fontWeight: 700 }}>First Name</TableCell>
                          <TableCell component="th" sx={{ fontWeight: 700 }}>Last Name</TableCell>
                          <TableCell component="th" sx={{ fontWeight: 700 }}>Access Level</TableCell>
                          <TableCell component="th" sx={{ fontWeight: 700 }}>User ID</TableCell>
                        </TableRow>
                        {users?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)?.map((item, index) => (
                          <TableRow key={`user_${index}`} onClick={() => router.push(`/team/user/${item?._id}`)} sx={{ cursor: 'pointer' }}>
                            <TableCell>{item?.FirstName}</TableCell>
                            <TableCell>{item?.LastName}</TableCell>
                            <TableCell>{accessLevel.filter(x => x.level === item?.AccessLevel)[0].label || ""}</TableCell>
                            <TableCell>{item?._id}</TableCell>
                          </TableRow>
                        ))}
                        {(page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users?.length) : 0) > 0 && (
                          <TableRow
                            style={{
                              height: 53 * (page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users?.length) : 0),
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
                    count={users?.length ?? 0}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </FlexCard>
              </Grid>
              <Grid item xs={12}>
                <FlexCard>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: 800, marginBottom: 1, fontSize: { xs: "1.4rem", md: "1.7rem" } }}>Placements</Typography>
                  </div>
                  <TableContainer component={Paper} sx={{ boxShadow: "none", border: 0 }}>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell component="th" sx={{ fontWeight: 700 }}>Job Title</TableCell>
                          <TableCell component="th" sx={{ fontWeight: 700 }}>Status</TableCell>
                          <TableCell component="th" sx={{ fontWeight: 700 }}>Start Date</TableCell>
                          <TableCell component="th" sx={{ fontWeight: 700 }}>Placement ID</TableCell>
                        </TableRow>
                        {list?.placements?.slice(placementPage * placementRowsPerPage, placementPage * placementRowsPerPage + placementRowsPerPage)?.map(item => (
                          <TableRow onClick={() => router.push(`/placements/${item?._id}`)} sx={{ cursor: 'pointer' }} key={`placement_${item?._id}`}>
                            <TableCell>{item?.JobTitle}</TableCell>
                            <TableCell><AgentStatusChip status={item?.Status} /></TableCell>
                            <TableCell>{moment(item?.StartDate).format('MM-DD-YYYY')}</TableCell>
                            <TableCell>{item?._id}</TableCell>
                          </TableRow>
                        ))}
                        {(placementPage > 0 ? Math.max(0, (1 + placementPage) * placementRowsPerPage - list?.placements?.length) : 0) > 0 && (
                          <TableRow
                            style={{
                              height: 53 * (placementPage > 0 ? Math.max(0, (1 + placementPage) * placementRowsPerPage - list?.placements?.length) : 0),
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
                    count={list?.placements?.length ?? 0}
                    rowsPerPage={placementRowsPerPage}
                    page={placementPage}
                    onPageChange={handleChangePlacementPage}
                    onRowsPerPageChange={handleChangePlacementRowsPerPage}
                  />
                </FlexCard>
              </Grid>
              <Grid item xs={12}>
                <FlexCard>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: 800, marginBottom: 1, fontSize: { xs: "1.4rem", md: "1.7rem" } }}>Contracts</Typography>
                  </div>
                  <TableContainer component={Paper} sx={{ boxShadow: "none", border: 0 }}>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell component="th" sx={{ fontWeight: 700 }}>Job Title</TableCell>
                          <TableCell component="th" sx={{ fontWeight: 700 }}>Status</TableCell>
                          <TableCell component="th" sx={{ fontWeight: 700 }}>Start Date</TableCell>
                          <TableCell component="th" sx={{ fontWeight: 700 }}>Contract ID</TableCell>
                        </TableRow>
                        {list?.contracts?.slice(contractPage * contractRowsPerPage, contractPage * contractRowsPerPage + contractRowsPerPage)?.map(item => (
                          <TableRow onClick={() => router.push(`/contracts/${item?._id}`)} sx={{ cursor: 'pointer' }} key={`contract_${item?._id}`}>
                            <TableCell>{item?.JobTitle}</TableCell>
                            <TableCell><AgentStatusChip status={item?.Status} /></TableCell>
                            <TableCell>{moment(item?.StartDate).format('MM-DD-YYYY')}</TableCell>
                            <TableCell>{item?._id}</TableCell>
                          </TableRow>
                        ))}
                        {(contractPage > 0 ? Math.max(0, (1 + contractPage) * contractRowsPerPage - list?.contracts?.length) : 0) > 0 && (
                          <TableRow
                            style={{
                              height: 53 * (contractPage > 0 ? Math.max(0, (1 + contractPage) * contractRowsPerPage - list?.contracts?.length) : 0),
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
                    count={list?.contracts?.length ?? 0}
                    rowsPerPage={contractRowsPerPage}
                    page={contractPage}
                    onPageChange={handleChangeContractPage}
                    onRowsPerPageChange={handleChangeContractRowsPerPage}
                  />
                </FlexCard>
              </Grid>
            </Grid>
          </>
          :
          <Loader show={!organization ? true : false} />
        }
      </Layout>
      <SnackAlert
        show={showSnack}
        type={type}
        handleClose={() => setShowSnack(false)}
        msg={msg}
      />
      <DialogBox
        open={orgDeleteModal}
        handleClose={() => setOrgDeleteModal(false)}
        title="Delete Organization"
      >
        <MessageModal
          msg={"Are you sure you want to delete this organization?"}
          handleClose={() => setOrgDeleteModal(false)}
          handleRemove={() => deleteOrganization.mutate()}
          removeBtnTitle="Delete"
        />
      </DialogBox>
    </>
  );
}


