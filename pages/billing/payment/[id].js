import moment from 'moment';
import Head from "next/head";
import { useQuery } from "react-query";
import { useRouter } from 'next/router';
import Link from "../../../components/global/Link";
import Loader from '../../../components/global/Loader';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { formatNum } from "../../../utils/globalFunctions";
import { Layout } from '../../../components/global/Layout';
import FlexCard from '../../../components/global/FlexCard';
import CustomBtn from '../../../components/global/CustomBtn';
import InvoiceService from "../../../Services/InvoiceService";
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { BodyHeader } from '../../../components/global/BodyHeader';
import AgentStatusChip from "../../../components/global/AgentStatusChip";
import { Grid, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

export default function PaymentDetails() {

    const router = useRouter()
    const { id } = router.query;
    const [isLoaded, setIsLoaded] = useState(true);

    const { data } = useQuery(['getInvoiceById'], () => InvoiceService.getInvoiceById(id), {
        enabled: (id && isLoaded) ? true : false,
        onSuccess: () => setIsLoaded(false)
    });

    useEffect(() => {
        setIsLoaded(true);
    }, [])

    return (
        <>
            <Head>
                <title>Payment on {moment.unix(data?.stripeInvoice?.status_transitions?.paid_at).format('MM-DD-YYYY')} | Billing | Flexscale</title>
            </Head>
            <Layout>
                {data ?
                    <>
                        <BodyHeader
                            title={`Payment on ${moment.unix(data?.stripeInvoice?.status_transitions?.paid_at).format('MM-DD-YYYY')}`}
                            subtitle={'View payment details and download a receipt.'}
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

                        <Grid container spacing={2} mt={2}>
                            <Grid item xs={12} md={12} lg={12}>
                                <FlexCard containerStyle={{ paddingBottom: 5, paddingTop: 4 }}>
                                    <Typography sx={{ fontWeight: 800, fontSize: { xs: "1.4rem", md: "1.7rem" }, mb: 3 }}>Payment Details</Typography>
                                    <Grid container spacing={3} sx={{ alignItems: 'center' }}>
                                        <Grid item>
                                            <AgentStatusChip status={data?.charge?.status} />
                                        </Grid>
                                        <Grid item>
                                            <Link href={`${data?.charge?.receipt_url}`} target={'_blank'} rel="noreferrer" underline="none" sx={{ fontSize: 14 }}><FileCopyIcon sx={{ verticalAlign: 'text-bottom', color: 'rgba(0, 0, 0, 0.54)', fontSize: 16 }} /> View Receipt</Link>
                                        </Grid>
                                    </Grid>
                                    <TableContainer component={Paper} sx={{ boxShadow: "none", border: 0, mt: 3 }}>
                                        <Table className='custom-responsive'>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell component="th" sx={{ fontWeight: 700 }}>Payment ID</TableCell>
                                                    <TableCell>{data?.charge?.payment_intent}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" sx={{ fontWeight: 700 }}>Invoice</TableCell>
                                                    <TableCell onClick={() => router.push(`/billing/invoice/${data?.charge?.invoice}`)} sx={{ color: 'darkcyan', cursor: 'pointer' }}>{data?.stripeInvoice?.number} <ArrowOutwardIcon sx={{ fontSize: 14 }} /></TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" sx={{ fontWeight: 700 }}>Processed Date</TableCell>
                                                    <TableCell>{moment.unix(data?.stripeInvoice?.status_transitions?.paid_at).format('MM-DD-YYYY')}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" sx={{ fontWeight: 700 }}>Amount</TableCell>
                                                    <TableCell>${formatNum(data?.charge?.amount / 100)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" sx={{ fontWeight: 700 }}>Payment Method</TableCell>
                                                    <TableCell>****{data?.charge?.payment_method_details?.type === "ach_debit" ? data?.charge?.payment_method_details?.ach_debit?.last4 : data?.charge?.payment_method_details?.card?.last4}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" sx={{ fontWeight: 700 }}>Payment Type</TableCell>
                                                    <TableCell sx={{ textTransform: 'capitalize' }}>{data?.charge?.payment_method_details?.type === "ach_debit" ? "ACH Direct Debit" : `${data?.charge?.payment_method_details?.card?.brand}card ${data?.charge?.payment_method_details?.card?.funding}`} Card</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
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


