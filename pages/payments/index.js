import Head from "next/head";
import { useQuery } from "react-query";
import { useRouter } from 'next/router';
import { useSelector } from "react-redux";
import { Box, Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { PaymentColumns } from "../../utils/data";
import Loader from '../../components/global/Loader';
import { useEffect, useState, useReducer } from "react";
import FlexCard from "../../components/global/FlexCard";
import { Layout } from '../../components/global/Layout';
import FlexField from '../../components/global/FlexField';
import { formReducer } from "../../utils/globalFunctions";
import PaymentService from "../../Services/PaymentService";
import { BodyHeader } from '../../components/global/BodyHeader';
import SelectDropdown from '../../components/global/SelectDropdown';



export default function Payments() {

  const organizations = useSelector(state => state.dataSlice.OrganizationList);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [formData, setFormData] = useReducer(formReducer, {});
  const [paymentsList, setPaymentsList] = useState([]);
  const [isLoaded, setIsLoaded] = useState(true);
  const router = useRouter();

  const { isLoading } = useQuery(['getAllPaymentsList'], () => PaymentService.getAllPayments(), {
    enabled: isLoaded,
    onSuccess: (res) => { setIsLoaded(false); setFilteredPayments([...filteredPayments, ...res?.list]); setPaymentsList([...paymentsList, ...res?.list]); }
  });

  const filterPaymentsByValue = (value, organization, status) => {
    let payments = JSON.parse(JSON.stringify(paymentsList));
    if (value || organization || status) {
      if (value) {
        payments = payments?.filter(x => x?.payment.id?.toLowerCase()?.indexOf(value?.toLowerCase()) !== -1);
      }
      if (organization) {
        if (!value) {
          payments = payments?.filter(x => x?.payment?.metadata?.orgName?.toLowerCase() == organization?.Name?.toLowerCase());
        } else {
          payments = payments?.filter(x => x?.payment.id?.toLowerCase()?.indexOf(value?.toLowerCase()) !== -1 && x.payment?.metadata?.orgName?.toLowerCase() === organization?.Name?.toLowerCase());
        }
      }
      if (status) {
        if (!value && !organization) {
          payments = payments?.filter(x => x.payment?.status == status?.toLowerCase());
        } else if (!value) {
          payments = payments?.filter(x => x.payment?.metadata?.orgName?.toLowerCase() === organization?.Name?.toLowerCase() && x.payment?.status == status?.toLowerCase());
        } else if (!organization) {
          payments = payments?.filter(x => x?.payment.id?.toLowerCase()?.indexOf(value?.toLowerCase()) !== -1 && x.payment?.status == status?.toLowerCase());
        } else {
          payments = payments?.filter(x => x?.payment.id?.toLowerCase()?.indexOf(value?.toLowerCase()) !== -1 && x.payment?.metadata?.orgName?.toLowerCase() === organization?.Name?.toLowerCase() && x.payment?.status == status?.toLowerCase());
        }
      }
    }
    if (payments) {
      setFilteredPayments(JSON.parse(JSON.stringify(payments)));
    }
  }

  return (
    <>
      <Head>
        <title>Payment | Flexscale</title>
      </Head>
      <Layout>
        <BodyHeader
          title={"Payments"}
        />
        <div className="custom-search">
          <FlexCard>
            <Grid container spacing={2} className="custom-inputs">
              <Grid item lg={1} md={2} xs={12}>
                <p className="filter-text">Filters</p>
              </Grid>
              <Grid item lg={7} md={6} xs={12}>
                <FlexField
                  id="filled-search"
                  label="Search by Payment ID"
                  as="search"
                  variant="outlined"
                  setValue={(e) => { filterPaymentsByValue(e.target.value, formData['Organization'], formData['Status']); setFormData(e) }}
                  name='Search'
                />
              </Grid>
              <Grid item lg={2} md={2} xs={12}>
                <SelectDropdown
                  setValue={(e) => { filterPaymentsByValue(formData['Search'], e.target.value, formData['Status']); setFormData(e) }}
                  label="Organization"
                  name="Organization"
                  data={organizations}
                />
              </Grid>
              <Grid item lg={2} md={2} xs={12}>
                <SelectDropdown
                  setValue={(e) => { filterPaymentsByValue(formData['Search'], formData['Organization'], e.target.value); setFormData(e) }}
                  label="Status"
                  name="Status"
                  data={['succeeded', 'pending', 'failed']}
                />
              </Grid>
            </Grid>
          </FlexCard>
        </div>
        {!isLoading ?
          <>
            <Box sx={{ width: '100%', background: "white" }}>
              <DataGrid
                getRowId={(row) => row?._id}
                className='clickable-rows'
                autoHeight={true}
                showColumnRightBorder={false}
                onCellClick={(params) => {
                  if (params.field === 'Action') {
                    window.open(`/payments/${params.row.payment.invoice}`, '_blank');
                  } else {
                    router.push(`/payments/${params.row.payment.invoice}`);
                  }
                }}
                rows={filteredPayments}
                columns={PaymentColumns}
                hideFooterSelectedRowCount={true}
                pageSize={10}
                editMode='row'
                rowsPerPageOptions={[5, 10, 20, 50]}
              />
            </Box>
          </>
          :
          <Loader
            show={isLoading}
          />
        }
      </Layout>
    </>
  );
}

