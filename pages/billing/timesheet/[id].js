import moment from 'moment';
import Head from "next/head";
import { useState } from 'react';
import { useEffect } from 'react';
import { useQuery } from "react-query";
import { useRouter } from 'next/router';
import Loader from '../../../components/global/Loader';
import { getUser } from '../../../utils/globalFunctions';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Layout } from '../../../components/global/Layout';
import FlexCard from '../../../components/global/FlexCard';
import CustomBtn from '../../../components/global/CustomBtn';
import TimesheetService from '../../../Services/TimesheetService';
import { BodyHeader } from '../../../components/global/BodyHeader';
import { Grid, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';


export default function TimesheetDetails() {

    const router = useRouter()
    const { id } = router.query;
    const [dates, setDates] = useState([]);

    const { data } = useQuery(['getTimesheetById'], () => TimesheetService.getTimesheetById(id), {
        enabled: id ? true : false
    });
    const creator = getUser('_id', data?.timesheet?.CreatedBy)[0];

    useEffect(() => {
        if (data?.timesheet?.TimeLog?.length > 0) {
            setDates(JSON.parse(JSON.stringify(data?.timesheet?.TimeLog)));
        }
    }, [data])

    return (
        <>
            <Head>
                <title>Timesheet | Flexscale</title>
            </Head>
            <Layout>
                <BodyHeader
                    title={`${moment(data?.timesheet?.TimePeriodStart)?.format('MMM DD ')} - ${moment(data?.timesheet?.TimePeriodEnd)?.format('DD, YYYY')}`}
                    subtitle={`${data?.timesheet?.Organization?.Name} - ${data?.timesheet?.User?.FirstName} ${data?.timesheet?.User?.LastName}`}
                    showAvatar={false}
                    containerStyle={{ justifyContent: 'space-between' }}
                    button={
                        <CustomBtn
                            onClick={() => router.back()}
                            variant="outlined"
                            icon={<ArrowBackIcon />}
                            title="Go Back"
                        />
                    }
                />
                {data ?
                    <>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={12} lg={12}>
                                <FlexCard>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography sx={{ fontWeight: 800, marginBottom: 1, fontSize: { xs: "1.4rem", md: "1.7rem" } }}>General</Typography>
                                    </div>
                                    <TableContainer component={Paper} sx={{ boxShadow: "none", border: 0 }}>
                                        <Table>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell component="th" sx={{ fontWeight: 700 }}>Team Member</TableCell>
                                                    <TableCell>{data?.timesheet?.User?.FirstName} {data?.timesheet?.User?.LastName}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" sx={{ fontWeight: 700 }}>Organization</TableCell>
                                                    <TableCell >{data?.timesheet?.Organization?.Name}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" sx={{ fontWeight: 700 }}>Contract</TableCell>
                                                    <TableCell>{data?.timesheet?.Contract?.JobTitle}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" sx={{ fontWeight: 700 }}>Timesheet ID</TableCell>
                                                    <TableCell>{data?.timesheet?._id}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" sx={{ fontWeight: 700 }}>Time Period Start</TableCell>
                                                    <TableCell>{moment(data?.timesheet?.TimePeriodStart).format('MM-DD-YYYY')}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" sx={{ fontWeight: 700 }}>Time Period End</TableCell>
                                                    <TableCell>{moment(data?.timesheet?.TimePeriodEnd).format('MM-DD-YYYY')}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" sx={{ fontWeight: 700 }}>Created Date</TableCell>
                                                    <TableCell>{moment(data?.timesheet?.createdAt).format('MM-DD-YYYY')}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" sx={{ fontWeight: 700 }}>Created By</TableCell>
                                                    <TableCell>{creator?.FirstName} {creator?.LastName}</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </FlexCard>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={12} lg={12}>
                                <FlexCard>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography sx={{ fontWeight: 800, marginBottom: 1, fontSize: { xs: "1.4rem", md: "1.7rem" } }}>Hours</Typography>
                                    </div>
                                    <TableContainer component={Paper} sx={{ boxShadow: "none", border: 0 }}>
                                        <Table>
                                            <TableBody>
                                                <TableRow>
                                                    {data?.timesheet?.TimeLog?.map(item => (
                                                        <TableCell key={`data_${item?.date}`}>{moment(item?.date).format('DD-MMM')}</TableCell>
                                                    ))}
                                                </TableRow>
                                                <TableRow>
                                                    {data?.timesheet?.TimeLog?.map((item, index) => (
                                                        <TableCell key={`check_${index}`}>{item?.hours}{item?.check == 'true' && ' - OL'}</TableCell>
                                                    ))}
                                                </TableRow>
                                            </TableBody>
                                        </Table>

                                        <Grid container spacing={2} sx={{ mt: 1, pl: 2, pb: 2, }}>
                                            <Typography><b>Total Hours</b> {dates?.reduce((x, i) => x + Number(i.hours), 0)}</Typography>
                                        </Grid>

                                    </TableContainer>
                                </FlexCard>
                            </Grid>
                        </Grid>
                    </>
                    :
                    <Loader show={!data ? true : false} />
                }
            </Layout>
        </>
    );
}


