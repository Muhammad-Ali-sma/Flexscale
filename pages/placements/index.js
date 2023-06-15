import moment from 'moment';
import Head from 'next/head';
import { Box } from '@mui/system';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import { selectAuth } from '../../store/authSlice';
import Loader from '../../components/global/Loader';
import FlexNav from '../../components/global/FlexNav';
import { Grid, Link, Typography } from '@mui/material';
import FlexCard from '../../components/global/FlexCard';
import { Layout } from '../../components/global/Layout';
import { formReducer } from '../../utils/globalFunctions';
import FlexField from '../../components/global/FlexField';
import CustomBtn from '../../components/global/CustomBtn';
import PlacementService from '../../Services/PlacementService';
import React, { useEffect, useReducer, useState } from 'react';
import { BodyHeader } from '../../components/global/BodyHeader';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import SelectDropdown from '../../components/global/SelectDropdown';
import AgentStatusChip from '../../components/global/AgentStatusChip';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { PlacementColumns } from '../../utils/data';


const Placements = () => {

    const router = useRouter();
    const user = useSelector(selectAuth)?.userData;
    const [formData, setFormData] = useReducer(formReducer, {});
    const [filteredPlacements, setFilteredPlacements] = useState([]);
    const organizations = useSelector(state => state.dataSlice.OrganizationList);

   
    const { data: placements, isLoading } = useQuery(['getAllPlacements'], () => PlacementService.getAllPlacements(), {
        enabled: user?.Organization?.length > 0 ? true : false
    });
    const filterPlacementsByValue = (value, orgName, status) => {
        let tempPlacements = JSON.parse(JSON.stringify(placements?.list));
        if (value || orgName || status) {
            if (value) {
                tempPlacements = tempPlacements?.filter(x => x?.JobTitle?.toLowerCase()?.indexOf(value?.toLowerCase()) !== -1);
            }
            if (orgName) {
                if (!value) {
                    tempPlacements = tempPlacements?.filter(x => x?.Organization?._id === orgName);
                } else {
                    tempPlacements = tempPlacements?.filter(x => x?.JobTitle?.toLowerCase()?.indexOf(value?.toLowerCase()) !== -1 && x?.Organization?._id === orgName);
                }
            }
            if (status) {
                if (!value && !orgName) {
                    tempPlacements = tempPlacements?.filter(x => x?.Status?.toLowerCase() === status?.toLowerCase());
                } else if (!value) {
                    tempPlacements = tempPlacements?.filter(x => x?.Status?.toLowerCase() === status?.toLowerCase() && x?.Organization?._id === orgName);
                } else if (!orgName) {
                    tempPlacements = tempPlacements?.filter(x => x?.JobTitle?.toLowerCase()?.indexOf(value?.toLowerCase()) !== -1 && x?.Status?.toLowerCase() === status?.toLowerCase());
                } else {
                    tempPlacements = tempPlacements?.filter(x => x?.JobTitle?.toLowerCase()?.indexOf(value?.toLowerCase()) !== -1 && x?.Organization?._id === orgName && x?.Status?.toLowerCase() === status?.toLowerCase());
                }
            }
        }
        if (tempPlacements) {
            setFilteredPlacements(tempPlacements);
        }
    };
    useEffect(() => {
        if (placements?.list?.length > 0) {
            setFilteredPlacements(placements?.list)
        }
    }, [placements]);

    return (
        <>
            <Head>
                <title>Placements | Flexscale</title>
            </Head>
            <FlexNav />
            <Layout>
                <BodyHeader
                    title={"Placements"}
                    button={<CustomBtn
                        onClick={() => router.push("/placements/addnew")}
                        variant="contained"
                        title={"Create New Placement"}
                        icon={<AddCircleOutlineIcon />}
                    />
                    }
                    containerStyle={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}
                />
                {!isLoading ?
                    <>
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
                                            setValue={(e) => { filterPlacementsByValue(e.target.value, formData['Organization'], formData['Status']); setFormData(e) }}
                                            name='Search'
                                        />
                                    </Grid>
                                    <Grid item lg={2} md={2} xs={12}>
                                        <SelectDropdown
                                            setValue={(e) => { filterPlacementsByValue(formData['Search'], e.target.value, formData['Status']); setFormData(e) }}
                                            label="Organization"
                                            name="Organization"
                                            data={organizations}
                                            getId={true}
                                        />
                                    </Grid>
                                    <Grid item lg={2} md={2} xs={12}>
                                        <SelectDropdown
                                            setValue={(e) => { filterPlacementsByValue(formData['Search'], formData['Organization'], e.target.value); setFormData(e) }}
                                            label="Status"
                                            name="Status"
                                            data={['Active', 'Inactive']}
                                        />
                                    </Grid>
                                </Grid>
                            </FlexCard>
                        </div>
                        <Box sx={{ width: '100%', background: "white" }}>
                            <DataGrid
                                getRowId={(row) => row._id}
                                className='clickable-rows'
                                autoHeight={true}
                                showColumnRightBorder={false}
                                onCellClick={(params) => {
                                    if (params.field === 'Action') {
                                        window.open(`/placements/${params.row._id}`, '_blank');
                                    } else {
                                        router.push(`/placements/${params.row._id}`);
                                    }
                                }}
                                rows={filteredPlacements}
                                columns={PlacementColumns}
                                hideFooterSelectedRowCount={true}
                                pageSize={10}
                                editMode='row'
                                rowsPerPageOptions={[5, 10, 20, 50]}
                            />
                        </Box>
                    </>
                    :
                    <Loader show={isLoading} />
                }
            </Layout>
        </>
    )
}

export default Placements