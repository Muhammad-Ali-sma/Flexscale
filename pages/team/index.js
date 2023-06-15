import Head from "next/head";
import { useRouter } from 'next/router';
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { accessLevel, INTERNAL_ADMIN, INTERNAL_MANAGER } from '../../utils';
import { DataGrid } from '@mui/x-data-grid';
import { selectAuth } from "../../store/authSlice";
import Loader from '../../components/global/Loader';
import UserService from '../../Services/UserService';
import { Box, Grid, Link, Tab, Tabs } from '@mui/material';
import { useEffect, useState, useReducer } from "react";
import { Layout } from '../../components/global/Layout';
import FlexCard from "../../components/global/FlexCard";
import FlexField from '../../components/global/FlexField';
import CustomBtn from "../../components/global/CustomBtn";
import { formReducer } from "../../utils/globalFunctions";
import { BodyHeader } from '../../components/global/BodyHeader';
import SelectDropdown from '../../components/global/SelectDropdown';
import { tabProps, TabPanel } from '../../components/global/TabPanel';
import { AdminUserColumns, ClientUserColumns } from "../../utils/data";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';



export default function Team() {


  const organization = useSelector(state => state.authUser.selectedOrganization);
  const organizations = useSelector(state => state.dataSlice.OrganizationList);
  const usersList = useSelector(state => state.dataSlice.usersList);
  const [formData, setFormData] = useReducer(formReducer, {});
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const user = useSelector(selectAuth)?.userData;
  const [value, setValue] = useState(0);
  const router = useRouter();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const { data: list, isLoading } = useQuery(['getTeamMembers'], () => UserService.getTeamMembers(organization?._id), {
    enabled: (user?.AccessLevel !== INTERNAL_MANAGER.level && user?.AccessLevel !== INTERNAL_ADMIN.level) ? true : false
  });

  const filterUsersByValue = (value, orgName, userLevel) => {
    let tempUsers = JSON.parse(JSON.stringify(usersList));
    if (value || orgName || userLevel) {
      if (value) {
        tempUsers = tempUsers?.filter(x => x?.FirstName?.toLowerCase()?.indexOf(value?.toLowerCase()) !== -1 || x?.LastName?.toLowerCase()?.indexOf(value?.toLowerCase()) !== -1 || x?.Email?.toLowerCase()?.indexOf(value?.toLowerCase()) !== -1);
      }
      if (orgName) {
        if (!value) {
          tempUsers = tempUsers?.filter(x => x?.Organization?.some(org => org?._id == orgName));
        } else {
          tempUsers = tempUsers?.filter(x => (x?.FirstName?.toLowerCase()?.indexOf(value?.toLowerCase()) !== -1 || x?.LastName?.toLowerCase()?.indexOf(value?.toLowerCase()) !== -1 || x?.Email?.toLowerCase()?.indexOf(value?.toLowerCase()) !== -1) && x?.Organization?.some(org => org?._id == orgName));
        }
      }
      if (userLevel) {
        if (!value && !orgName) {
          tempUsers = tempUsers?.filter(x => x?.AccessLevel === userLevel);
        } else if (!value) {
          tempUsers = tempUsers?.filter(x => x?.Organization?.some(org => org?._id == orgName) && x?.AccessLevel === userLevel);
        } else if (!orgName) {
          tempUsers = tempUsers?.filter(x => (x?.FirstName?.toLowerCase()?.indexOf(value?.toLowerCase()) !== -1 || x?.LastName?.toLowerCase()?.indexOf(value?.toLowerCase()) !== -1 || x?.Email?.toLowerCase()?.indexOf(value?.toLowerCase()) !== -1) && x?.AccessLevel === userLevel);
        } else {
          tempUsers = tempUsers?.filter(x => (x?.FirstName?.toLowerCase()?.indexOf(value?.toLowerCase()) !== -1 || x?.LastName?.toLowerCase()?.indexOf(value?.toLowerCase()) !== -1 || x?.Email?.toLowerCase()?.indexOf(value?.toLowerCase()) !== -1) && x?.Organization?.some(org => org?._id == orgName) && x?.AccessLevel === userLevel);
        }
      }
    }
    if (tempUsers) {
      setFilteredUsers(tempUsers);
    }
  }

  useEffect(() => {
    if ((user?.AccessLevel === INTERNAL_MANAGER.level || user?.AccessLevel === INTERNAL_ADMIN.level)) {
      if (usersList?.length > 0) {
        setFilteredUsers(usersList);
        setIsLoaded(true);
      }
    }
  }, [usersList])

  return (
    <>
      <Head>
        <title>Team | Flexscale</title>
      </Head>
      <Layout>
        <BodyHeader
          title={(user?.AccessLevel === INTERNAL_MANAGER.level || user?.AccessLevel === INTERNAL_ADMIN.level) ? "Users" : "Team"}
          subtitle={(user?.AccessLevel !== INTERNAL_MANAGER.level && user?.AccessLevel !== INTERNAL_ADMIN.level) && "Manage your team and monitor their performance."}
          button={(user?.AccessLevel === INTERNAL_MANAGER.level || user?.AccessLevel === INTERNAL_ADMIN.level) &&
            <CustomBtn
              onClick={() => router.push("team/user/create")}
              variant="contained"
              title={"Create New User"}
              icon={<AddCircleOutlineIcon />}
            />}
          containerStyle={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}
        />
        {(user?.AccessLevel === INTERNAL_MANAGER.level || user?.AccessLevel === INTERNAL_ADMIN.level) &&
          <div className="custom-search">
            <FlexCard>
              <Grid container spacing={2} className="custom-inputs">
                <Grid item lg={1} md={2} xs={12}>
                  <p className="filter-text">Filters</p>
                </Grid>
                <Grid item lg={7} md={6} xs={12}>
                  <FlexField
                    id="filled-search"
                    label="Search by name and email"
                    as="search"
                    variant="outlined"
                    setValue={(e) => { filterUsersByValue(e.target.value, formData['Organization'], formData['AccessLevel']); setFormData(e) }}
                    name='Search'
                  />
                </Grid>
                <Grid item lg={2} md={2} xs={12}>
                  <SelectDropdown
                    setValue={(e) => { filterUsersByValue(formData['Search'], e.target.value, formData['AccessLevel']); setFormData(e) }}
                    label="Organization"
                    name="Organization"
                    data={organizations}
                    getId={true}
                  />
                </Grid>
                <Grid item lg={2} md={2} xs={12}>
                  <SelectDropdown
                    setValue={(e) => { filterUsersByValue(formData['Search'], formData['Organization'], e.target.value); setFormData(e) }}
                    label="Access Level"
                    name="AccessLevel"
                    getAccessMethods={true}
                    data={accessLevel}
                  />
                </Grid>
              </Grid>
            </FlexCard>
          </div>
        }
        {((user?.AccessLevel === INTERNAL_MANAGER.level || user?.AccessLevel === INTERNAL_ADMIN.level) ? isLoaded : !isLoading) ?
          <>
            {(user?.AccessLevel !== INTERNAL_MANAGER.level && user?.AccessLevel !== INTERNAL_ADMIN.level) &&
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange}>
                  <Tab label={`Active (${list?.members ? list?.members?.filter(x => x.Status !== 'Inactive')?.length : 0})`} {...tabProps(0)} />
                  <Tab label={`Inactive (${list?.members ? list?.members?.filter(x => x.Status === 'Inactive')?.length : 0})`} {...tabProps(1)} />
                </Tabs>
              </Box>
            }
            <TabPanel value={value} index={0}>
              <Box sx={{ width: '100%', background: "white" }}>
                <DataGrid
                  getRowId={(row) => row._id}
                  className='clickable-rows'
                  autoHeight={true}
                  showColumnRightBorder={false}
                  onCellClick={(params) => {
                    if (user?.AccessLevel === INTERNAL_MANAGER.level || user?.AccessLevel === INTERNAL_ADMIN.level) {
                      if (params.field === 'Action') {
                        window.open(`/team/user/${params.row._id}`, '_blank');
                      } else {
                        router.push(`/team/user/${params.row._id}`);
                      }
                    } else {
                      router.push(`/team/user-details/${params.row?._id}`);
                    }
                  }}
                  rows={(user?.AccessLevel === INTERNAL_MANAGER.level || user?.AccessLevel === INTERNAL_ADMIN.level) ? filteredUsers : list?.members ? list?.members?.filter(x => x.Status != 'Inactive') : []}
                  columns={(user?.AccessLevel === INTERNAL_MANAGER.level || user?.AccessLevel === INTERNAL_ADMIN.level) ? AdminUserColumns : ClientUserColumns}
                  hideFooterSelectedRowCount={true}
                  pageSize={10}
                  editMode='row'
                  rowsPerPageOptions={[5, 10, 20, 50]}
                />
              </Box>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <Box sx={{ width: '100%', background: "white" }}>
                <DataGrid
                  className='clickable-rows'
                  getRowId={(row) => row._id}
                  autoHeight={true}
                  showColumnRightBorder={false}
                  columns={ClientUserColumns}
                  hideFooterSelectedRowCount={true}
                  pageSize={20}
                  rows={list?.members ? list?.members?.filter(x => x.Status == 'Inactive') : []}
                  editMode='row'
                  onRowClick={(params) => {
                    router.push(`/team/user-details/${params.row?._id}`);
                  }}
                  rowsPerPageOptions={[5, 10, 20, 50]}
                />
              </Box>
            </TabPanel>
          </>
          :
          <Loader
            show={((user?.AccessLevel === INTERNAL_MANAGER.level || user?.AccessLevel === INTERNAL_ADMIN.level) ? !isLoaded : isLoading)}
          />
        }
      </Layout>
    </>
  );
}

