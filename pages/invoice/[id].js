import moment from 'moment';
import Head from "next/head";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from "react-query";
import Loader from '../../components/global/Loader';
import { Layout } from '../../components/global/Layout';
import FlexCard from '../../components/global/FlexCard';
import DownloadIcon from '@mui/icons-material/Download';
import { formatNum } from "../../utils/globalFunctions";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CustomBtn from '../../components/global/CustomBtn';
import InvoiceService from '../../Services/InvoiceService';
import SnackAlert from '../../components/global/SnackAlert';
import DialogBox from '../../components/dialogBox/DialogBox';
import { BodyHeader } from '../../components/global/BodyHeader';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import AgentStatusChip from '../../components/global/AgentStatusChip';
import InvoiceStatusModal from '../../components/dialogBox/InvoiceStatusModal';
import InvoiceReminderModal from '../../components/dialogBox/InvoiceReminderModal';
import { Grid, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';


export default function InvoiceDetails() {

    const router = useRouter()
    const { id } = router.query;
    const [type, setType] = useState(null);
    const [msg, setMsg] = useState(false);
    const [showPopup, setShowPopup] = useState(0);
    const [isLoaded, setIsLoaded] = useState(true);
    const [showSnack, setShowSnack] = useState(false);


    const { data } = useQuery(['getInvoiceById'], () => InvoiceService.getInvoiceById(id), {
        enabled: (id && isLoaded) ? true : false
    });

    useEffect(() => {
        setIsLoaded(true);
        if (!data) {
            router.push('/invoice')
        }
    }, [])
    return (
        <>
            <Head>
                <title>Invoice | Flexscale</title>
            </Head>
            <Layout>
                <BodyHeader
                    title={data?.stripeInvoice?.number}
                    subtitle={data?.invoice?.Organization?.Name}
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
                    btnIcon={<DownloadIcon />}
                    firstBtnTitle={'Download'}
                    handleOnHire={() => router.push(data?.stripeInvoice?.invoice_pdf)}
                    handleOnSendReminder={(data?.stripeInvoice?.status !== 'paid' && data?.stripeInvoice?.status !== 'void') ? () => setShowPopup(2) : null}
                    handleOnStatusChange={(data?.stripeInvoice?.status !== 'paid' && data?.stripeInvoice?.status !== 'void') ? () => setShowPopup(1) : null}
                />
                {data?.stripeInvoice ?
                    <>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={12} lg={12}>
                                <FlexCard>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography sx={{ fontWeight: 700, marginBottom: 1, fontSize: { xs: "1.4rem", md: "1.5rem" } }}>General</Typography>
                                    </div>
                                    <TableContainer component={Paper} sx={{ boxShadow: "none", border: 0 }}>
                                        <Table className="custom-responsive">
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell component="th" sx={{ fontWeight: 700 }}>Invoice Number</TableCell>
                                                    <TableCell>{data?.stripeInvoice?.number}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" sx={{ fontWeight: 700 }}>ID</TableCell>
                                                    <TableCell>{data?.stripeInvoice?.id}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" sx={{ fontWeight: 700 }}>Payment Page</TableCell>
                                                    <TableCell onClick={() => window.open(`${data?.stripeInvoice?.hosted_invoice_url}`, '_blank')} sx={{ color: 'darkcyan', cursor: 'pointer' }}>Go to link <ArrowOutwardIcon sx={{ fontSize: 14 }} /></TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" sx={{ fontWeight: 700 }}>Organization</TableCell>
                                                    <TableCell onClick={() => router.push(`/organization/details/${data?.invoice?.Organization?._id}`)} sx={{ color: 'darkcyan', cursor: 'pointer' }}>{data?.invoice?.Organization?.Name} <ArrowOutwardIcon sx={{ fontSize: 14 }} /></TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" sx={{ fontWeight: 700 }}>Billed To</TableCell>
                                                    <TableCell>{data?.invoice?.BilledTo?.Email}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" sx={{ fontWeight: 700 }}>Amount</TableCell>
                                                    <TableCell>${formatNum(data?.stripeInvoice?.total / 100)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" sx={{ fontWeight: 700 }}>Currency</TableCell>
                                                    <TableCell sx={{ textTransform: 'uppercase' }}>{data?.stripeInvoice?.currency}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" sx={{ fontWeight: 700 }}>Due Date</TableCell>
                                                    <TableCell>{data?.stripeInvoice?.due_date && moment.unix(data?.stripeInvoice?.due_date).format('MM-DD-YYYY')}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" sx={{ fontWeight: 700 }}>Billing Method</TableCell>
                                                    <TableCell>{data?.stripeInvoice?.collection_method}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" sx={{ fontWeight: 700 }}>Created Date</TableCell>
                                                    <TableCell>{moment(data?.invoice?.createdAt).format('MM-DD-YYYY')}</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </FlexCard>
                            </Grid>
                        </Grid>
                        {data?.charge &&
                            <Grid container>
                                <Grid item xs={12}>
                                    <FlexCard>
                                        <Typography sx={{ fontWeight: 700, marginBottom: 1, fontSize: { xs: "1.4rem", md: "1.5rem" } }}>Payments</Typography>
                                        <TableContainer component={Paper} sx={{ boxShadow: "none", border: 0 }}>
                                            <Table>
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell component="th" sx={{ fontWeight: 700 }}>Amount</TableCell>
                                                        <TableCell component="th" sx={{ fontWeight: 700 }}>Status</TableCell>
                                                        <TableCell component="th" sx={{ fontWeight: 700 }}>Last Activity</TableCell>
                                                        <TableCell component="th" sx={{ fontWeight: 700 }}>ID</TableCell>
                                                    </TableRow>
                                                    <TableRow sx={{ cursor: 'pointer' }} onClick={() => router.push(`/payments/${id}`)}>
                                                        <TableCell>${formatNum(data?.charge?.amount / 100)}</TableCell>
                                                        <TableCell><AgentStatusChip status={data?.charge?.status} /> </TableCell>
                                                        <TableCell>{moment.unix(data?.charge?.created)?.format('MMM DD YYYY')}</TableCell>
                                                        <TableCell>{data?.charge?.payment_intent}</TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </FlexCard>
                                </Grid>
                            </Grid>
                        }
                    </>
                    :
                    <Loader show={!data?.stripeInvoice ? true : false} />
                }
                <SnackAlert
                    show={showSnack}
                    type={type}
                    handleClose={() => setShowSnack(false)}
                    msg={msg}
                />
                <DialogBox
                    handleClose={() => setShowPopup(0)}
                    title="Change Invoice status"
                    msg={"Mark invoice as: "}
                    open={showPopup === 1 ? true : false}
                >
                    <InvoiceStatusModal
                        handleClose={() => setShowPopup(0)}
                        invoiceData={data?.invoice}
                        handleSave={() => {
                            setShowPopup(0);
                            setMsg("Invoice status updated successfully.");
                            setType('success');
                            setShowSnack(true);
                        }}
                    />
                </DialogBox>
                <DialogBox
                    handleClose={() => setShowPopup(0)}
                    title="Send reminder"
                    open={showPopup === 2 ? true : false}
                >
                    <InvoiceReminderModal
                        handleClose={() => setShowPopup(0)}
                        invoiceData={data?.invoice ? Object.assign(data?.invoice, data?.stripeInvoice) : null}
                        handleSave={() => {
                            setShowPopup(0);
                            setMsg("Reminder sent successfully.");
                            setType('success');
                            setShowSnack(true);
                        }}
                    />
                </DialogBox>
            </Layout>
        </>
    );
}


