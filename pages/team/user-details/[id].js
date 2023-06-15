import moment from 'moment';
import Head from "next/head";
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import { Person } from '@mui/icons-material';
import Loader from '../../../components/global/Loader';
import FlexCard from '../../../components/global/FlexCard';
import { Layout } from '../../../components/global/Layout';
import { formatNum } from '../../../utils/globalFunctions';
import { ClientTimesheetColumns } from '../../../utils/data';
import ContractService from '../../../Services/ContractService';
import TimesheetService from '../../../Services/TimesheetService';
import { BodyHeader } from '../../../components/global/BodyHeader';
import ProfileSection from '../../../components/global/ProfileSection';
import { tabProps, TabPanel } from '../../../components/global/TabPanel';
import AgentStatusChip from '../../../components/global/AgentStatusChip';
import { Box, Grid, Paper, Tab, Table, TableBody, TableCell, TableContainer, TableRow, Tabs, Typography } from '@mui/material';

export default function TeamUserDetails() {

  const router = useRouter()
  const { id } = router.query;
  const organization = useSelector(state => state.authUser.selectedOrganization);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [value, setValue] = useState(0);

  const { data: contract } = useQuery(['getContractById'], () => ContractService.getContractById(id), {
    enabled: id ? true : false,
  });
  const { data: list } = useQuery(['getTimesheetByUserId'], () => TimesheetService.getTimesheetByUserId(contract?.data?.User?._id, organization?._id, id), {
    enabled: contract?.data ? true : false,
  });

  return (
    <>
      <Head>
        <title>{contract?.data?.User?.PreferredName ?? contract?.data?.User?.FirstName} | Team | Flexscale</title>
      </Head>
      <Layout>
        {contract?.data ?
          <>
            <BodyHeader title={contract?.data?.User ? `${contract?.data?.User?.FirstName} ${contract?.data?.User?.LastName}` : ''} subtitle={""} showAvatar={true} />
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="auto">
                <Tab label="Profile" {...tabProps(0)} />
                <Tab label="Managers" {...tabProps(1)} />
                <Tab label="Timesheets" {...tabProps(1)} />
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={9} lg={8}>
                  <ProfileSection title="Basics" icon={<Person sx={{ color: "#2196F3" }} />} iconBg="#EEF7FE">
                    <TableContainer component={Paper} sx={{ boxShadow: "none", border: 0 }}>
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell component="th" sx={{ fontWeight: 800, width: '50%' }}>Full Name</TableCell>
                            <TableCell>{contract?.data?.User?.FirstName} {contract?.data?.User?.LastName}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell component="th" sx={{ fontWeight: 800, width: '50%' }}>Preferred Name</TableCell>
                            <TableCell>{contract?.data?.User?.PreferredName}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell component="th" sx={{ fontWeight: 800, width: '50%' }}>Pronouns</TableCell>
                            <TableCell>{contract?.data?.User?.Gender}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell component="th" sx={{ fontWeight: 800, width: '50%' }}>Email</TableCell>
                            <TableCell>{contract?.data?.User?.Email}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell component="th" sx={{ fontWeight: 800, width: '50%' }}>Nationality</TableCell>
                            <TableCell>{contract?.data?.User?.Location}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </ProfileSection>

                  <ProfileSection title="Employment" icon={<Person sx={{ color: "#4CAF50" }} />} iconBg="#F1F9F1">
                    <TableContainer component={Paper} sx={{ boxShadow: "none", border: 0 }}>
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell component="th" sx={{ fontWeight: 800, width: '50%' }}>Job Title</TableCell>
                            <TableCell>{contract?.data?.JobTitle}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell component="th" sx={{ fontWeight: 800, width: '50%' }}>Type of Employment</TableCell>
                            <TableCell>{contract?.data?.TypeofEmployment}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell component="th" sx={{ fontWeight: 800, width: '50%' }}>Work Hours (per week)</TableCell>
                            <TableCell>{contract?.data?.WorkHoursPerWeek}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell component="th" sx={{ fontWeight: 800, width: '50%' }}>Rate (per hour)</TableCell>
                            <TableCell>{contract?.data?.RatePerHour && `$${formatNum(contract?.data?.RatePerHour)} USD`}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell component="th" sx={{ fontWeight: 800, width: '50%' }}>Number of Paid Time Off Days</TableCell>
                            <TableCell>{contract?.data?.NoOfPaidTimeOffDays}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </ProfileSection>
                </Grid>
                <Grid item xs={12} md={3} lg={4}>
                  <FlexCard>
                    <Box sx={{ mb: 2 }}>
                      <Typography sx={{ fontWeight: 800, fontSize: "1rem", mb: 0.5 }}>Status</Typography>
                      <AgentStatusChip status={contract?.data?.Status} />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography sx={{ fontWeight: 800, fontSize: "1rem", mb: 0.5 }}>Country</Typography>
                      <Typography variant='body2'>{contract?.data?.User?.Location}</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography sx={{ fontWeight: 800, fontSize: "1rem", mb: 0.5 }}>Start Date</Typography>
                      <Typography variant='body2'>{moment(contract?.data?.StartDate).format('MM-DD-YYYY')}</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography sx={{ fontWeight: 800, fontSize: "1rem", mb: 0.5 }}>Live Date</Typography>
                      <Typography variant='body2'>{moment(contract?.data?.LiveDate).format('MM-DD-YYYY')}</Typography>
                    </Box>
                  </FlexCard>
                </Grid>
              </Grid>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <Grid container>
                <Box sx={{ pt: '1px', pr: { md: 2, sm: 0 }, width: { lg: '66%', md: '75%', xs: '100%' } }}>
                  {contract?.data?.User?.Manager?.map((user, index) =>
                    <Grid item key={`manager_${index}`}>
                      <ProfileSection title="Manager" icon={<Person sx={{ color: "#ED6C02" }} />} iconBg="#FEF4EB">
                        <TableContainer component={Paper} sx={{ boxShadow: "none", border: 0 }}>
                          <Table>
                            <TableBody>
                              <TableRow>
                                <TableCell component="th" sx={{ fontWeight: 800, width: '50%' }}>Full Name</TableCell>
                                <TableCell>{user?.FirstName}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell component="th" sx={{ fontWeight: 800, width: '50%' }}>Preferred Name</TableCell>
                                <TableCell>{user?.PreferredName}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell component="th" sx={{ fontWeight: 800, width: '50%' }}>Pronouns</TableCell>
                                <TableCell>{user?.Gender}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell component="th" sx={{ fontWeight: 800, width: '50%' }}>Email</TableCell>
                                <TableCell>{user?.Email}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell component="th" sx={{ fontWeight: 800, width: '50%' }}>Phone</TableCell>
                                <TableCell>{user?.Phone}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell component="th" sx={{ fontWeight: 800, width: '50%' }}>Location</TableCell>
                                <TableCell>{user?.Location}</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </ProfileSection>
                    </Grid>
                  )}
                </Box>
                <Grid item xs={12} md={3} lg={4}>
                  <FlexCard>
                    <Box sx={{ mb: 2 }}>
                      <Typography sx={{ fontWeight: 800, fontSize: "1rem", mb: 0.5 }}>Status</Typography>
                      <AgentStatusChip status={contract?.data?.Status} />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography sx={{ fontWeight: 800, fontSize: "1rem", mb: 0.5 }}>Country</Typography>
                      <Typography variant='body2'>{contract?.data?.User?.Location}</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography sx={{ fontWeight: 800, fontSize: "1rem", mb: 0.5 }}>Start Date</Typography>
                      <Typography variant='body2'>{moment(contract?.data?.StartDate).format('MM-DD-YYYY')}</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography sx={{ fontWeight: 800, fontSize: "1rem", mb: 0.5 }}>Live Date</Typography>
                      <Typography variant='body2'>{moment(contract?.data?.LiveDate).format('MM-DD-YYYY')}</Typography>
                    </Box>
                  </FlexCard>
                </Grid>
              </Grid>
            </TabPanel>
            <TabPanel value={value} index={2}>
              <Box sx={{ width: '100%', background: "white" }}>
                <DataGrid
                  autoHeight={true}
                  showColumnRightBorder={false}
                  rows={list?.timesheets ?? []}
                  columns={ClientTimesheetColumns}
                  hideFooterSelectedRowCount={true}
                  pageSize={5}
                  className='clickable-rows'
                  editMode='row'
                  rowsPerPageOptions={[5]}
                  getRowId={(row) => row._id}
                  onCellClick={(params) => {
                    if (params.field === 'Action') {
                      window.open(`/billing/timesheet/${params.row._id}`, '_blank');
                    } else {
                      router.push(`/billing/timesheet/${params.row._id}`);
                    }
                  }}
                />
              </Box>
            </TabPanel>
          </>
          :
          <Loader show={!contract?.data ? true : false} />
        }
      </Layout>
    </>
  );
}
