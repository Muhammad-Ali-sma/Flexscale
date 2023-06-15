import moment from 'moment';
import Head from "next/head";
import { useEffect, useState } from 'react';
import { useQuery } from "react-query";
import { useRouter } from 'next/router';
import Loader from '../../components/global/Loader';
import { Layout } from '../../components/global/Layout';
import FlexCard from '../../components/global/FlexCard';
import { formatNum } from "../../utils/globalFunctions";
import CustomBtn from '../../components/global/CustomBtn';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InvoiceService from "../../Services/InvoiceService";
import { BodyHeader } from '../../components/global/BodyHeader';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import AgentStatusChip from "../../components/global/AgentStatusChip";
import { Grid, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';



export default function PaymentDetails() {

    const router = useRouter()
    const { id } = router.query;
    const [isLoaded, setIsLoaded] = useState(true);

    const { data } = useQuery(['getInvoiceById'], () => InvoiceService.getInvoiceById(id), {
        enabled: (isLoaded && id) ? true : false,
        onSuccess: () => setIsLoaded(false)
    });

    useEffect(() => {
        setIsLoaded(true);
        if (!data) {
            router.push('/payments')
        }
    }, [])

    return (
        <>
            <Head>
                <title>Payment | Flexscale</title>
            </Head>
            <Layout>
                {data ?
                    <>
                        <BodyHeader
                            title={`Payment to ${data?.invoice?.Organization?.Name}`}
                            subtitle={`${data?.charge?.payment_intent} - $${formatNum(data?.charge?.amount / 100)}`}
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
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={12} lg={12}>
                                <FlexCard>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography sx={{ fontWeight: 800, marginBottom: 1, fontSize: { xs: "1.4rem", md: "1.7rem" } }}>General</Typography>
                                    </div>
                                    <TableContainer component={Paper} sx={{ boxShadow: "none", border: 0 }}>
                                        <Table className="custom-responsive">
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell component="th" sx={{ fontWeight: 700 }}>Payment ID</TableCell>
                                                    <TableCell>{data?.charge?.payment_intent}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" sx={{ fontWeight: 700 }}>Status</TableCell>
                                                    <TableCell>{data?.charge?.status}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" sx={{ fontWeight: 700 }}>Receipt</TableCell>
                                                    <TableCell onClick={() => router.push(data?.charge?.receipt_url)} sx={{ color: 'darkcyan', cursor: 'pointer' }}>Go to link <ArrowOutwardIcon sx={{ fontSize: 14 }} /></TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" sx={{ fontWeight: 700 }}>Organization</TableCell>
                                                    <TableCell onClick={() => router.push(`/organization/details/${data?.invoice?.Organization?._id}`)} sx={{ color: 'darkcyan', cursor: 'pointer' }}>{data?.invoice?.Organization?.Name} <ArrowOutwardIcon sx={{ fontSize: 14 }} /></TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" sx={{ fontWeight: 700 }}>Amount</TableCell>
                                                    <TableCell>${formatNum(data?.charge?.amount / 100 ?? 0)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" sx={{ fontWeight: 700 }}>Payment Type</TableCell>
                                                    <TableCell sx={{ textTransform: 'capitalize' }}>{data?.charge?.payment_method_details?.type === "ach_debit" ? "ACH Direct Debit" : `${data?.charge?.payment_method_details?.card?.brand}card ${data?.charge?.payment_method_details?.card?.funding}`} Card</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" sx={{ fontWeight: 700 }}>Created Date</TableCell>
                                                    <TableCell>{moment.unix(data?.charge?.created).format('MM-DD-YYYY')}</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </FlexCard>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={12}>
                                <FlexCard>
                                    <Typography sx={{ fontWeight: 700, marginBottom: 1, fontSize: { xs: "1.4rem", md: "1.5rem" } }}>Invoice</Typography>
                                    <TableContainer component={Paper} sx={{ boxShadow: "none", border: 0 }}>
                                        <Table>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell component="th" sx={{ fontWeight: 700 }}>Invoice ID</TableCell>
                                                    <TableCell component="th" sx={{ fontWeight: 700 }}>Amount</TableCell>
                                                    <TableCell component="th" sx={{ fontWeight: 700 }}>Status</TableCell>
                                                </TableRow>
                                                <TableRow onClick={() => router.push(`/invoice/${id}`)} sx={{ cursor: 'pointer' }}>
                                                    <TableCell>{data?.stripeInvoice?.id}</TableCell>
                                                    <TableCell>${formatNum(data?.stripeInvoice?.total / 100)}</TableCell>
                                                    <TableCell><AgentStatusChip status={data?.stripeInvoice?.status} /></TableCell>
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


