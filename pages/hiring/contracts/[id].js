import React from 'react';
import moment from 'moment';
import Head from "next/head";
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import Loader from '../../../components/global/Loader';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FlexCard from '../../../components/global/FlexCard';
import { Layout } from '../../../components/global/Layout';
import CustomBtn from '../../../components/global/CustomBtn';
import ContractService from '../../../Services/ContractService';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { BodyHeader } from '../../../components/global/BodyHeader';
import { formatNum, getUser } from '../../../utils/globalFunctions';
import AgentStatusChip from '../../../components/global/AgentStatusChip';
import { Box, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';

export default function ContractDetails() {

    const router = useRouter()
    const { id } = router.query;

    const { data: contract } = useQuery(['getContractById'], () => ContractService.getContractById(id), {
        enabled: id ? true : false,
    });
    const creator = getUser('_id', contract?.data?.CreatedBy)[0];

    return (
        <>
            <Head>
                <title>{contract?.data?.User?.FirstPreferredNameName ?? contract?.data?.User?.FirstName}, {contract?.data?.JobTitle} | Contract | Flexscale</title>
            </Head>
            <Layout>
                <BodyHeader
                    title={contract?.data?.JobTitle}
                    subtitle={`${contract?.data?.User?.FirstName} ${contract?.data?.User?.LastName}`}
                    showAvatar={false}
                    containerStyle={{ justifyContent: 'space-between' }}
                    button={<CustomBtn
                        onClick={() => router.back()}
                        variant="outlined"
                        icon={<ArrowBackIcon />}
                        title="Go Back"
                    />
                    }
                />
                {contract?.data ?
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={9} lg={8}>
                            <FlexCard>
                                <Typography sx={{ fontWeight: 700, marginBottom: 1, textTransform: 'capitalize', fontSize: { xs: "1.4rem", md: "1.5rem" } }}>Contract Details</Typography>
                                <TableContainer component={Paper} sx={{ boxShadow: "none", border: 0 }}>
                                    <Table>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell component="th" sx={{ fontWeight: 700 }}>Status</TableCell>
                                                <TableCell>{contract?.data?.Status} {contract?.data?.LastName}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell component="th" sx={{ fontWeight: 700 }}>JobTitle</TableCell>
                                                <TableCell>{contract?.data?.JobTitle}</TableCell>
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
                                                <TableCell component="th" sx={{ fontWeight: 700 }}>Number of Paid Time Off Days</TableCell>
                                                <TableCell>{contract?.data?.NoOfPaidTimeOffDays}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell component="th" sx={{ fontWeight: 700 }}>Start Date</TableCell>
                                                <TableCell>{moment(contract?.data?.StartDate).format('MM-DD-YYYY')}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell component="th" sx={{ fontWeight: 700 }}>Go Live Date</TableCell>
                                                <TableCell>{moment(contract?.data?.GoLiveDate).format('MM-DD-YYYY')}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell component="th" sx={{ fontWeight: 700 }}>End Date</TableCell>
                                                <TableCell>{moment(contract?.data?.EndDate).format('MM-DD-YYYY')}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell component="th" sx={{ fontWeight: 700 }}>Created Date</TableCell>
                                                <TableCell>{moment(contract?.data?.createdAt).format('MM-DD-YYYY')}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell component="th" sx={{ fontWeight: 700 }}>Created By</TableCell>
                                                <TableCell>{creator?.FirstName} {creator?.LastName}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell component="th" sx={{ fontWeight: 700 }}>Contract Id</TableCell>
                                                <TableCell>{contract?.data?._id}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </FlexCard>
                        </Grid>
                        <Grid item xs={12} md={3} lg={4}>
                            <FlexCard>
                                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div>
                                        <Typography sx={{ fontWeight: 700, fontSize: "1rem", mb: 0.5 }}>Status</Typography>
                                        <AgentStatusChip status={contract?.data?.Status} />
                                    </div>
                                </Box>
                                <Box sx={{ mb: 2 }}>
                                    <Typography sx={{ fontWeight: 700, fontSize: "1rem", mb: 0.5 }}>Team Member</Typography>
                                    <Typography variant='body2'>{contract?.data?.User?.FirstName} {contract?.data?.User?.LastName}  <span onClick={() => router.push(`/team/user-details/${contract?.data?._id}`)} style={{ color: 'darkblue', marginLeft: 50, cursor: 'pointer' }}>View Profile <ArrowOutwardIcon style={{ height: '0.7em' }} /></span></Typography>
                                </Box>
                            </FlexCard>
                        </Grid>
                    </Grid>
                    :
                    <Loader show={!contract?.data ? true : false} />
                }
            </Layout>
        </>
    );
}
