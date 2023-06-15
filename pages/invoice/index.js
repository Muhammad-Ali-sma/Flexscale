import Head from "next/head";
import { useQuery } from "react-query";
import { useRouter } from 'next/router';
import { useSelector } from "react-redux";
import { Box, Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { invoiceStatus } from "../../utils";
import { InvoiceColumns } from "../../utils/data";
import Loader from '../../components/global/Loader';
import { useEffect, useState, useReducer } from "react";
import { Layout } from '../../components/global/Layout';
import FlexCard from "../../components/global/FlexCard";
import FlexField from '../../components/global/FlexField';
import CustomBtn from "../../components/global/CustomBtn";
import { formReducer } from "../../utils/globalFunctions";
import InvoiceService from "../../Services/InvoiceService";
import DialogBox from "../../components/dialogBox/DialogBox";
import { BodyHeader } from '../../components/global/BodyHeader';
import SelectDropdown from '../../components/global/SelectDropdown';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CreateInvoiceModal from "../../components/dialogBox/CreateInvoiceModal";



export default function Invoice() {

    const organizations = useSelector(state => state.dataSlice.OrganizationList);
    const [filteredInvoices, setFilteredInvoices] = useState([]);
    const [formData, setFormData] = useReducer(formReducer, {});
    const [showPopup, setShowPopup] = useState(false);
    const [isLoaded, setIsLoaded] = useState(true);
    const router = useRouter();

    const { data } = useQuery(['getAllInvoices'], () => InvoiceService.getAllInvoices(), {
        enabled: isLoaded,
        onSuccess: (res) => { setIsLoaded(false); setFilteredInvoices(res?.list) }
    });

    const filterInvoicesByValue = (value, orgId, status) => {
        let invoices = JSON.parse(JSON.stringify(data?.list));
        if (value || orgId || status) {
            if (value) {
                invoices = invoices?.filter(x => x?.id?.toLowerCase()?.indexOf(value?.toLowerCase()) !== -1);
            }
            if (orgId) {
                if (!value) {
                    invoices = invoices?.filter(x => x?._doc?.Organization?._id == orgId);
                } else {
                    invoices = invoices?.filter(x => x?.id?.toLowerCase()?.indexOf(value?.toLowerCase()) !== -1 && x?._doc?.Organization?._id == orgId);
                }
            }
            if (status) {
                if (!value && !orgId) {
                    invoices = invoices?.filter(x => x?.status?.toLowerCase() == status?.toLowerCase());
                } else if (!value) {
                    invoices = invoices?.filter(x => x?._doc?.Organization?._id == orgId && x?.status?.toLowerCase() == status?.toLowerCase());
                } else if (!orgId) {
                    invoices = invoices?.filter(x => x?.id?.toLowerCase()?.indexOf(value?.toLowerCase()) !== -1 && x?.status?.toLowerCase() == status?.toLowerCase());
                } else {
                    invoices = invoices?.filter(x => x?.id?.toLowerCase()?.indexOf(value?.toLowerCase()) !== -1 && x?._doc?.Organization?._id == orgId && x?.status?.toLowerCase() == status?.toLowerCase());
                }
            }
        }
        if (invoices) {
            setFilteredInvoices(invoices);
        }
    }

    useEffect(() => {
        setIsLoaded(true);
    }, [])

    return (
        <>
            <Head>
                <title>Invoice | Flexscale</title>
            </Head>
            <Layout>
                <BodyHeader
                    title={"Invoices"}
                    button={
                        <CustomBtn
                            onClick={() => setShowPopup(true)}
                            variant="contained"
                            title={"Create New Invoice"}
                            icon={<AddCircleOutlineIcon />}
                        />}
                    containerStyle={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}
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
                                    label="Search by Invoice ID"
                                    as="search"
                                    variant="outlined"
                                    setValue={(e) => { filterInvoicesByValue(e.target.value, formData['Organization'], formData['Status']); setFormData(e) }}
                                    name='Search'
                                />
                            </Grid>
                            <Grid item lg={2} md={2} xs={12}>
                                <SelectDropdown
                                    setValue={(e) => { filterInvoicesByValue(formData['Search'], e.target.value, formData['Status']); setFormData(e) }}
                                    label="Organization"
                                    name="Organization"
                                    data={organizations}
                                    getId={true}
                                />
                            </Grid>
                            <Grid item lg={2} md={2} xs={12}>
                                <SelectDropdown
                                    setValue={(e) => { filterInvoicesByValue(formData['Search'], formData['Organization'], e.target.value); setFormData(e) }}
                                    label="Status"
                                    name="Status"
                                    data={invoiceStatus}
                                />
                            </Grid>
                        </Grid>
                    </FlexCard>
                </div>
                {!isLoaded ?
                    <>
                        <Box sx={{ width: '100%', background: "white" }}>
                            <DataGrid
                                className='clickable-rows'
                                autoHeight={true}
                                showColumnRightBorder={false}
                                onCellClick={(params) => {
                                    if (params.field === 'Action') {
                                        window.open(`/invoice/${params.row.id}`, '_blank');
                                    } else {
                                        router.push(`/invoice/${params.row.id}`);
                                    }
                                }}
                                rows={filteredInvoices}
                                columns={InvoiceColumns}
                                hideFooterSelectedRowCount={true}
                                pageSize={10}
                                editMode='row'
                                rowsPerPageOptions={[5, 10, 20, 50]}
                            />
                        </Box>
                    </>
                    :
                    <Loader
                        show={isLoaded ? true : false}
                    />
                }
            </Layout>
            <DialogBox
                open={showPopup}
                handleClose={() => setShowPopup(false)}
                title="Create new invoice"
            >
                <CreateInvoiceModal
                    handleClose={() => { setShowPopup(false) }}
                />
            </DialogBox>
        </>
    );
}

