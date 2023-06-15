import Head from "next/head";
import { useRouter } from 'next/router';
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { Box, Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Loader from '../../components/global/Loader';
import { Layout } from '../../components/global/Layout';
import FlexCard from "../../components/global/FlexCard";
import { AdminContractColumns } from "../../utils/data";
import { useEffect, useState, useReducer } from "react";
import CustomBtn from "../../components/global/CustomBtn";
import { formReducer } from "../../utils/globalFunctions";
import FlexField from '../../components/global/FlexField';
import ContractService from "../../Services/ContractService";
import { BodyHeader } from '../../components/global/BodyHeader';
import SelectDropdown from '../../components/global/SelectDropdown';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';


export default function Contract() {


    const organizations = useSelector(state => state.dataSlice.OrganizationList);
    const [formData, setFormData] = useReducer(formReducer, {});
    const [filteredContracts, setFilteredContracts] = useState([]);
    const router = useRouter();


    const { data: list, isLoading } = useQuery(['getAllContracts'], () => ContractService.getAllContracts());

    const filterContractsByValue = (value, orgName, status) => {
        let tempContracts = JSON.parse(JSON.stringify(list?.contracts));
        if (value || orgName || status) {
            if (value) {
                tempContracts = tempContracts?.filter(x => x?.JobTitle?.toLowerCase()?.indexOf(value?.toLowerCase()) !== -1);
            }
            if (orgName) {
                if (!value) {
                    tempContracts = tempContracts?.filter(x => x?.Organization?._id === orgName);
                } else {
                    tempContracts = tempContracts?.filter(x => x?.JobTitle?.toLowerCase()?.indexOf(value?.toLowerCase()) !== -1 && x?.Organization?._id === orgName);
                }
            }
            if (status) {
                if (!value && !orgName) {
                    tempContracts = tempContracts?.filter(x => x?.Status?.toLowerCase() === status?.toLowerCase());
                } else if (!value) {
                    tempContracts = tempContracts?.filter(x => x?.Status?.toLowerCase() === status?.toLowerCase() && x?.Organization?._id === orgName);
                } else if (!orgName) {
                    tempContracts = tempContracts?.filter(x => x?.JobTitle?.toLowerCase()?.indexOf(value?.toLowerCase()) !== -1 && x?.Status?.toLowerCase() === status?.toLowerCase());
                } else {
                    tempContracts = tempContracts?.filter(x => x?.JobTitle?.toLowerCase()?.indexOf(value?.toLowerCase()) !== -1 && x?.Organization?._id === orgName && x?.Status?.toLowerCase() === status?.toLowerCase());
                }
            }
        }
        if (tempContracts) {
            setFilteredContracts(tempContracts);
        }
    }

    useEffect(() => {
        if (list?.contracts?.length > 0) {
            setFilteredContracts(list?.contracts)
        }
    }, [list])

    return (
        <>
            <Head>
                <title>Contracts | Flexscale</title>
            </Head>
            <Layout>
                <BodyHeader
                    title={"Contracts"}
                    button={
                        <CustomBtn
                            onClick={() => router.push("/contracts/create")}
                            variant="contained"
                            title={"Create New Contract"}
                            icon={<AddCircleOutlineIcon />}
                        />}
                    containerStyle={{justifyContent: 'space-between',flexWrap:'wrap', gap:'16px'}}
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
                                    label="Search by job title"
                                    as="search"
                                    variant="outlined"
                                    setValue={(e) => { filterContractsByValue(e.target.value, formData['Organization'], formData['Status']); setFormData(e) }}
                                    name='Search'
                                />
                            </Grid>
                            <Grid item lg={2} md={2} xs={12}>
                                <SelectDropdown
                                    setValue={(e) => { filterContractsByValue(formData['Search'], e.target.value, formData['Status']); setFormData(e) }}
                                    label="Organization"
                                    name="Organization"
                                    data={organizations}
                                    getId={true}
                                />
                            </Grid>
                            <Grid item lg={2} md={2} xs={12}>
                                <SelectDropdown
                                    setValue={(e) => { filterContractsByValue(formData['Search'], formData['Organization'], e.target.value); setFormData(e) }}
                                    label="Status"
                                    name="Status"
                                    data={["Onboarding", "Active", "On Leave", "Inactive", "Ended"]}
                                />
                            </Grid>
                        </Grid>
                    </FlexCard>
                </div>
                {!isLoading ?
                    <>
                        <Box sx={{ width: '100%', background: "white" }}>
                            <DataGrid
                                className='clickable-rows'
                                autoHeight={true}
                                showColumnRightBorder={false}
                                columns={AdminContractColumns}
                                hideFooterSelectedRowCount={true}
                                pageSize={10}
                                rows={filteredContracts}
                                editMode='row'
                                rowsPerPageOptions={[5, 10, 20, 50]}
                                getRowId={(row) => row._id}
                                onCellClick={(params) => {
                                    if (params.field === 'Action') {
                                        window.open(`/contracts/${params.row._id}`, '_blank');
                                    } else {
                                        router.push(`/contracts/${params.row._id}`);
                                    }
                                }}
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

