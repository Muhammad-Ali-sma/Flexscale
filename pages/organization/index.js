import Head from "next/head";
import { useRouter } from 'next/router';
import { Box, Grid } from '@mui/material';
import { useSelector } from "react-redux";
import { CLIENT_USER, INTERNAL_ADMIN } from '../../utils';
import { DataGrid } from '@mui/x-data-grid';
import { selectAuth } from "../../store/authSlice";
import { OrganizationColumns } from "../../utils/data";
import { Layout } from '../../components/global/Layout';
import { useState, useReducer, useEffect } from "react";
import FlexCard from "../../components/global/FlexCard";
import { formReducer } from "../../utils/globalFunctions";
import CustomBtn from '../../components/global/CustomBtn';
import FlexField from '../../components/global/FlexField';
import { BodyHeader } from '../../components/global/BodyHeader';
import SelectDropdown from '../../components/global/SelectDropdown';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';


export default function Organization() {

    const router = useRouter();
    const user = useSelector(selectAuth)?.userData;
    const [formData, setFormData] = useReducer(formReducer, {});
    const [filteredOrganization, setFilteredOrganization] = useState([]);
    const organizationsList = useSelector(state => state.dataSlice.OrganizationList);


    const filterOrganizationByValue = (value, type) => {
        let tempOrganization = organizationsList;
        if (value || type) {
            if (value) {
                tempOrganization = tempOrganization?.filter(x => x?.Name?.toLowerCase()?.indexOf(value?.toLowerCase()) > -1);
            }
            if (type) {
                tempOrganization = tempOrganization?.filter(x => value ? x?.Name?.toLowerCase()?.indexOf(value?.toLowerCase()) > -1 && x?.OrganizationType === type : x?.OrganizationType === type);
            }
        }
        if (tempOrganization) {
            setFilteredOrganization(tempOrganization);
        }
    }

    useEffect(() => {
        if (organizationsList?.length > 0) {
            setFilteredOrganization(organizationsList)
        }
    }, [organizationsList])

    return (
        <>
            <Head>
                <title>Organization | Flexscale</title>
            </Head>
            <Layout>
                <BodyHeader
                    title={"Organizations"}
                    button={user?.AccessLevel === INTERNAL_ADMIN.level &&
                        <CustomBtn
                            onClick={() => router.push("organization/create")}
                            variant="contained"
                            title={"Create New Organization"}
                            icon={<AddCircleOutlineIcon />}
                        />
                    }
                    containerStyle={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}
                />
                {user?.AccessLevel !== CLIENT_USER.level &&
                    <div className="custom-search">
                        <FlexCard>
                            <Grid container spacing={2} className="custom-inputs">
                                <Grid item xs={12} md={2} lg={1}>
                                    <p className="filter-text">Filters</p>
                                </Grid>
                                <Grid item xs={12} md={5} lg={8}>
                                    <FlexField
                                        id="filled-search"
                                        label="Search"
                                        as="search"
                                        variant="outlined"
                                        setValue={(e) => { setFormData(e); filterOrganizationByValue(e.target.value, formData['Type']); }}
                                        name='Search'
                                    />
                                </Grid>
                                <Grid item xs={12} md={5} lg={3}>
                                    <SelectDropdown
                                        setValue={(e) => { setFormData(e); filterOrganizationByValue(formData['Search'], e.target.value); }}
                                        label="Type"
                                        name="Type"
                                        data={['Client', 'Partner']}
                                    />
                                </Grid>
                            </Grid>
                        </FlexCard>
                    </div>
                }
                <Box sx={{ width: '100%', background: "white" }}>
                    <DataGrid
                        className='clickable-rows'
                        autoHeight={true}
                        showColumnRightBorder={false}
                        onCellClick={(params) => {
                            if (params.field === 'Action') {
                                window.open(`/organization/details/${params.row._id}`, '_blank');
                            } else {
                                router.push(`/organization/details/${params.row._id}`);
                            }
                        }}
                        rows={filteredOrganization}
                        columns={OrganizationColumns}
                        hideFooterSelectedRowCount={true}
                        pageSize={20}
                        getRowId={(row) => row._id}
                        editMode='row'
                        rowsPerPageOptions={[5, 10, 20, 50]}
                    />
                </Box>
            </Layout>
        </>
    );
}

