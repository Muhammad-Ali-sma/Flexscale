import moment from "moment";
import Head from "next/head";
import { useQuery } from 'react-query'
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import { invoiceStatus } from "../../utils";
import Loader from "../../components/global/Loader";
import { Box, Grid, Tab, Tabs } from '@mui/material';
import { Layout } from '../../components/global/Layout';
import { useState, useEffect, useReducer } from 'react';
import FlexCard from '../../components/global/FlexCard';
import Calendar from '../../components/global/Calendar';
import { formReducer } from "../../utils/globalFunctions";
import PaymentService from "../../Services/PaymentService";
import InvoiceService from '../../Services/InvoiceService';
import { BodyHeader } from '../../components/global/BodyHeader';
import SelectDropdown from '../../components/global/SelectDropdown';
import { tabProps, TabPanel } from '../../components/global/TabPanel';
import { BillingColumns, ClientPaymentColumns } from '../../utils/data';


export default function Billing() {

  const router = useRouter();
  const [value, setValue] = useState(0);
  const [isLoaded, setIsLoaded] = useState(true);
  const [invoicesList, setInvoicesList] = useState([]);
  const [formData, setFormData] = useReducer(formReducer, {});
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const organization = useSelector(state => state.authUser.selectedOrganization);

  const { data } = useQuery(['getAllPaymentsList'], () => PaymentService.getCustomerPayments(organization?.StripeId), {
    enabled: isLoaded,
    onSuccess: (res) => { setFilteredPayments(res?.list); }
  });
  const getInvoices = () => {
    setIsLoaded(true);
    InvoiceService.getInvoiceByOrgId(organization?._id)
      .then(res => {
        setFilteredInvoices(res?.list);
        setInvoicesList(res?.list);
        setIsLoaded(false);
      })
      .catch(err => setIsLoaded(false));
  }
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const filterInvoicesByValue = (status, date) => {
    let invoices = JSON.parse(JSON.stringify(invoicesList));
    if (status || date) {
      if (status) {
        invoices = invoices?.filter(x => x?.status?.toLowerCase() == status?.toLowerCase());
      }
      if (date) {
        if (!status) {
          invoices = invoices?.filter(x => moment(x?._doc?.createdAt).format('MM-DD-YYYY') == date);
        } else {
          invoices = invoices?.filter(x => x?.status?.toLowerCase() == status?.toLowerCase() && moment(x?._doc?.createdAt).format('MM-DD-YYYY') == date);
        }
      }
    }
    if (invoices) {
      setFilteredInvoices(invoices);
    }
  }
  const filterPaymentsByValue = (method, status, date) => {
    let paymentData = JSON.parse(JSON.stringify(data?.list));
    if (method || status || date) {
      if (method) {
        paymentData = paymentData?.filter(x => x?.payment?.charges?.data[0]?.payment_method_details?.type?.toLowerCase() == method?.toLowerCase());
      }
      if (status) {
        if (!method) {
          paymentData = paymentData?.filter(x => x.payment?.status?.toLowerCase() == status?.toLowerCase());
        } else {
          paymentData = paymentData?.filter(x => x?.payment?.charges?.data[0]?.payment_method_details?.type?.toLowerCase() == method?.toLowerCase() && x.payment?.status?.toLowerCase() == status?.toLowerCase());

        }
      }
      if (date) {
        if (!status && !method) {
          paymentData = paymentData?.filter(x => moment.unix(x.payment?.created).format('MM-DD-YYYY') == date);
        } else if (!status) {
          paymentData = paymentData?.filter(x => x?.payment?.charges?.data[0]?.payment_method_details?.type?.toLowerCase() == method?.toLowerCase() && moment.unix(x.payment?.created).format('MM-DD-YYYY') == date);
        } else if (!method) {
          paymentData = paymentData?.filter(x => x.payment?.status?.toLowerCase() == status?.toLowerCase() && moment.unix(x.payment?.created).format('MM-DD-YYYY') == date);
        } else {
          paymentData = paymentData?.filter(x => x?.payment?.charges?.data[0]?.payment_method_details?.type?.toLowerCase() == method?.toLowerCase() && x.payment?.status?.toLowerCase() == status?.toLowerCase() && moment.unix(x.payment?.created).format('MM-DD-YYYY') == date);
        }
      }
    }
    if (paymentData) {
      setFilteredPayments(paymentData);
    }
  }

  useEffect(() => {
    getInvoices();
    const controller = new AbortController();
    return () => {
      controller.abort()
    }
  }, [])

  return (
    <>
      <Head>
        <title>Billing | Flexscale</title>
      </Head>
      <Layout>
        <BodyHeader
          title={"Billing"}
          subtitle={"Manage invoices, payments and receipts."}
        />
        {!isLoaded ?
          <>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={value} onChange={handleChange}>
                <Tab label="Invoices" {...tabProps(0)} />
                <Tab label="Payments" {...tabProps(1)} />
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
              <div className="custom-search">
                <FlexCard>
                  <Grid container spacing={2} className="custom-inputs">
                    <Grid item xs={1}>
                      <p className="filter-text">Filters</p>
                    </Grid>
                    <Grid item ml={2} md={3} sm={4} xs={12}>
                      <SelectDropdown
                        setValue={(e) => { filterInvoicesByValue(e.target.value, formData['IssuedDate']); setFormData(e) }}
                        label="Invoice Status"
                        name="Status"
                        data={invoiceStatus}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={3} sm={4} xs={12}>
                      <Calendar
                        label={"Issued Date"}
                        setValue={(e) => { filterInvoicesByValue(formData['Status'], e.target.value); setFormData(e) }}
                        name="IssuedDate"
                        variant="outlined"
                      />
                    </Grid>
                  </Grid>
                </FlexCard>
              </div>
              <DataGrid
                className='clickable-rows'
                autoHeight={true}
                showColumnRightBorder={false}
                onRowClick={(params) => router.push(`/billing/invoice/${params.row.id}`)}
                rows={filteredInvoices}
                columns={BillingColumns}
                hideFooterSelectedRowCount={true}
                pageSize={10}
                editMode='row'
                rowsPerPageOptions={[5, 10, 20, 50]}
              />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <div className="custom-search">
                <FlexCard>
                  <Grid container spacing={2} className="custom-inputs">
                    <Grid item xs={1}>
                      <p className="filter-text">Filters</p>
                    </Grid>
                    <Grid item sm={3} xs={12} ml={2}>
                      <SelectDropdown
                        setValue={(e) => { filterPaymentsByValue(e.target.value, formData['ReceiptStatus'], formData['PmIssuedDate']); setFormData(e) }}
                        label="Payment method"
                        name="PaymentMethod"
                        data={[{ _id: 'card', Name: 'Card' }, { _id: "ach_debit", Name: 'Ach' }]}
                        getId={true}
                      />
                    </Grid>
                    <Grid item sm={3} xs={12}>
                      <SelectDropdown
                        setValue={(e) => { filterPaymentsByValue(formData['PaymentMethod'], e.target.value, formData['PmIssuedDate']); setFormData(e) }}
                        label="Receipt status"
                        name="ReceiptStatus"
                        data={['succeeded', 'pending', 'failed']}
                      />
                    </Grid>
                    <Grid item sm={3} xs={12}>
                      <Calendar
                        label={"Issued date"}
                        setValue={(e) => { filterPaymentsByValue(formData['PaymentMethod'], formData['ReceiptStatus'], e.target.value); setFormData(e) }}
                        variant="outlined"
                        name="PmIssuedDate"
                      />
                    </Grid>
                  </Grid>
                </FlexCard>
              </div>
              <DataGrid
                getRowId={(row) => row._id}
                className='clickable-rows'
                autoHeight={true}
                showColumnRightBorder={false}
                onRowClick={(params) => router.push(`/billing/payment/${params.row.payment.invoice}`)}
                rows={filteredPayments}
                columns={ClientPaymentColumns}
                hideFooterSelectedRowCount={true}
                pageSize={10}
                editMode='row'
                rowsPerPageOptions={[5, 10, 20, 50]}
              />
            </TabPanel>
          </>
          :
          <Loader show={isLoaded} />
        }
      </Layout>
    </>
  );
}
