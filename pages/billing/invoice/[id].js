import moment from 'moment';
import Head from "next/head";
import { useEffect, useState } from 'react';
import { useQuery } from "react-query";
import { useRouter } from 'next/router';
import Link from "../../../components/global/Link";
import Loader from '../../../components/global/Loader';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FlexCard from '../../../components/global/FlexCard';
import { Layout } from '../../../components/global/Layout';
import { formatNum } from "../../../utils/globalFunctions";
import CustomBtn from '../../../components/global/CustomBtn';
import InvoiceService from '../../../Services/InvoiceService';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { BodyHeader } from '../../../components/global/BodyHeader';
import AgentStatusChip from "../../../components/global/AgentStatusChip";
import { Grid, Paper, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, Typography } from '@mui/material';

export default function InvoiceDetails() {

    const router = useRouter()
    const { id } = router.query;
    const [page, setPage] = useState(0);
    const [isLoaded, setIsLoaded] = useState(true);
    const [rowsPerPage, setRowsPerPage] = useState(5);


    const { data } = useQuery(['getInvoiceById'], () => InvoiceService.getInvoiceById(id), {
        enabled: (id && isLoaded) ? true : false,
        onSuccess: () => setIsLoaded(false)
    });

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    useEffect(() => {
        setIsLoaded(true);
    }, [])

    return (
        <>
            <Head>
                <title>Invoice {data?.stripeInvoice?.number} | Billing | Flexscale</title>
            </Head>
            <Layout>
                {data ?
                    <>
                        <BodyHeader
                            title={`Invoice ${data?.stripeInvoice?.number}`}
                            subtitle={'View your invoice and make a payment.'}
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
                            firstBtnTitle={'Pay Invoice'}
                            handleOnHire={Number(data?.stripeInvoice?.amount_remaining / 100) !== 0 ? () => window.open(`${data?.stripeInvoice?.hosted_invoice_url}`, '_blank') : null}
                        />

                        <Grid container spacing={2} mt={2}>
                            <Grid item xs={12} md={12} lg={12}>
                                <FlexCard>
                                    <Typography sx={{ fontWeight: 800, fontSize: { xs: "1.4rem", md: "1.7rem" } }}>Invoice Details</Typography>
                                    <Typography sx={{ marginBottom: 1, }}>From Flexscale LLC to {data?.invoice?.Organization?.Name}</Typography>
                                    <Grid container mt={3} sx={{ alignItems: 'center' }}>
                                        <Grid item>
                                            <AgentStatusChip status={data?.stripeInvoice?.status} />
                                        </Grid>
                                        <Grid item ml={3}>
                                            <Link href={`${data?.stripeInvoice?.invoice_pdf}`} target={'_blank'} rel="noreferrer" underline="none" sx={{ fontSize: 14 }}><FileCopyIcon sx={{ verticalAlign: 'text-bottom', color: 'rgba(0, 0, 0, 0.54)', fontSize: 16 }} /> View Invoice Document</Link>
                                        </Grid>
                                    </Grid>
                                    <TableContainer component={Paper} sx={{ boxShadow: "none", border: 0, mt: 3 }}>
                                        <Table className='custom-responsive'>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell component="th" sx={{ fontWeight: 700 }}>Invoice Number</TableCell>
                                                    <TableCell>{data?.stripeInvoice?.number}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" sx={{ fontWeight: 700 }}>Issue Date</TableCell>
                                                    <TableCell>{moment(data?.invoice?.createdAt).format('MM-DD-YYYY')}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" sx={{ fontWeight: 700 }}>Payment Due Date</TableCell>
                                                    <TableCell>{data?.stripeInvoice?.due_date && moment.unix(data?.stripeInvoice?.due_date).format('MM-DD-YYYY')}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" sx={{ fontWeight: 700 }}>Amount</TableCell>
                                                    <TableCell>${formatNum(data?.stripeInvoice?.total / 100)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" sx={{ fontWeight: 700 }}>Amount Due</TableCell>
                                                    <TableCell>${formatNum(data?.stripeInvoice?.amount_remaining / 100)}</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </FlexCard>
                            </Grid>
                        </Grid>
                        {data?.invoice?.Timesheets?.length > 0 &&
                            <Grid container>
                                <Grid item xs={12}>
                                    <FlexCard>
                                        <Typography sx={{ fontWeight: 800, marginBottom: 1, fontSize: { xs: "1.4rem", md: "1.7rem" } }}>Timesheets</Typography>
                                        <TableContainer component={Paper} sx={{ boxShadow: "none", border: 0 }}>
                                            <Table>
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell component="th" sx={{ fontWeight: 700 }}>Name</TableCell>
                                                        <TableCell component="th" sx={{ fontWeight: 700 }}>Time Period</TableCell>
                                                        <TableCell component="th" sx={{ fontWeight: 700 }}>Hours</TableCell>
                                                        <TableCell component="th" sx={{ fontWeight: 700 }}>Action</TableCell>
                                                    </TableRow>
                                                    {data?.invoice?.Timesheets?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)?.map(item => (
                                                        <TableRow>
                                                            <TableCell>{item?.User?.FirstName} {item?.User?.LastName}</TableCell>
                                                            <TableCell>For {moment(item?.TimePeriodStart)?.format('MMM DD ')} - {moment(item?.TimePeriodEnd)?.format('DD, YYYY')}</TableCell>
                                                            <TableCell>{item?.TimeLog?.reduce((acc, val) => acc + Number(val?.hours), 0)}</TableCell>
                                                            <TableCell><Link href={`/billing/timesheet/${item?._id}`} target={'_blank'} rel="noreferrer" underline="none">View <ArrowOutwardIcon style={{ height: '0.7em' }} /></Link></TableCell>
                                                        </TableRow>
                                                    ))}
                                                    {(page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data?.invoice?.Timesheets?.length) : 0) > 0 && (
                                                        <TableRow
                                                            style={{
                                                                height: 53 * (page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data?.invoice?.Timesheets?.length) : 0),
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
                                                count={data?.invoice?.Timesheets?.length ?? 0}
                                                rowsPerPage={rowsPerPage}
                                                page={page}
                                                onPageChange={handleChangePage}
                                                onRowsPerPageChange={handleChangeRowsPerPage}
                                            />
                                        </TableContainer>
                                    </FlexCard>
                                </Grid>
                            </Grid>
                        }
                    </>
                    :
                    <Loader show={!data ? true : false} />
                }
            </Layout>
        </>
    );
}


