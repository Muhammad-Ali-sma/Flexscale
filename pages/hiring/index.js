import moment from 'moment';
import Head from 'next/head';
import { Box } from '@mui/system';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Loader from '../../components/global/Loader';
import FlexNav from '../../components/global/FlexNav';
import { Tab, Tabs, Typography } from '@mui/material';
import { Layout } from '../../components/global/Layout';
import CustomBtn from '../../components/global/CustomBtn';
import PlacementService from '../../Services/PlacementService';
import { BodyHeader } from '../../components/global/BodyHeader';
import { ContractColumns, RequestColumns } from '../../utils/data';
import { TabPanel, tabProps } from '../../components/global/TabPanel';
import AgentStatusChip from '../../components/global/AgentStatusChip';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';


const Hiring = () => {

    const organization = useSelector(state => state.authUser.selectedOrganization);
    const [value, setValue] = useState(0);
    const router = useRouter();

    const CandidatesColumns = [
        {
            field: 'Name',
            flex: 1,
            headerName: 'First Name',
            renderCell: (params) => {
                return (
                    <Typography>{params?.row?.candidateId?.FirstName + " " + params?.row?.candidateId?.LastName}</Typography>
                );
            }
        },
        {
            field: 'JobTitle',
            flex: 1,
            headerName: 'Job Title',
            renderCell: (params) => {
                return (
                    <Typography>{data?.list?.filter(x => x._id === params?.row?.placementId)[0]?.JobTitle}</Typography>
                );
            }
        },
        {
            field: 'Status',
            flex: 1,
            headerName: 'Status',
            renderCell: (params) => {
                return (
                    <AgentStatusChip status={params.row?.candidateStatus} />
                );
            }
        },
        {
            field: 'StartDate',
            flex: 1,
            headerName: 'Ideal Start Date',
            renderCell: (params) => {
                return (
                    <Typography>{moment(data?.list?.filter(x => x._id === params?.row?.placementId)[0]?.StartDate).format('MM-DD-YYYY')}</Typography>
                );
            }
        },
    ];

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const { data, isLoading } = useQuery(['getAllCandidates'], () => PlacementService.getAllCandidates(organization?._id), {
        enabled: organization?._id ? true : false
    });

    return (
        <>
            <Head>
                <title>Hiring | Flexscale</title>
            </Head>
            <FlexNav />
            <Layout>
                <BodyHeader
                    title={"Hiring"}
                    subtitle="Request candidates for a new position and monitor their status."
                    button={<CustomBtn
                        onClick={() => router.push("hiring/addnew")}
                        variant="contained"
                        title={"Add New Hire"}
                        icon={<AddCircleOutlineIcon />}
                    />
                    }
                    containerStyle={{ justifyContent: 'space-between' }}
                />
                {!isLoading ?
                    <>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={value} onChange={handleChange}>
                                <Tab label={`Candidates (${data?.candidates ? data?.candidates?.filter(x => x?.candidateStatus !== 'Hired' && x?.candidateStatus !== 'Rejected')?.length : 0})`} {...tabProps(0)} />
                                <Tab label={`Requests (${data?.list ? data?.list?.length : 0})`} {...tabProps(1)} />
                                <Tab label={`Contracts (${data?.contracts ? data?.contracts?.length : 0})`} {...tabProps(2)} />
                            </Tabs>
                        </Box>
                        <TabPanel value={value} index={0}>
                            <Box sx={{ width: '100%', background: "white" }}>
                                <DataGrid
                                    getRowId={(row) => row._id}
                                    className='clickable-rows'
                                    autoHeight={true}
                                    showColumnRightBorder={false}
                                    onRowClick={(params) => { router.push(`/hiring/candidates/${params.row?._id}&${params.row?.placementId}`) }}
                                    rows={data?.candidates ? data?.candidates?.filter(x => x?.candidateStatus !== 'Hired' && x?.candidateStatus !== 'Rejected') : []}
                                    columns={CandidatesColumns}
                                    hideFooterSelectedRowCount={true}
                                    pageSize={10}
                                    editMode='row'
                                    rowsPerPageOptions={[5, 10, 20, 50]}
                                />
                            </Box>
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            <Box sx={{ width: '100%', background: "white" }}>
                                <DataGrid
                                    getRowId={(row) => row._id}
                                    className='clickable-rows'
                                    autoHeight={true}
                                    showColumnRightBorder={false}
                                    onRowClick={(params) => { router.push(`/hiring/requests/${params.row?._id}`) }}
                                    rows={data?.list ? data?.list : []}
                                    columns={RequestColumns}
                                    hideFooterSelectedRowCount={true}
                                    pageSize={10}
                                    editMode='row'
                                    rowsPerPageOptions={[5, 10, 20, 50]}
                                />
                            </Box>
                        </TabPanel>
                        <TabPanel value={value} index={2}>
                            <Box sx={{ width: '100%', background: "white" }}>
                                <DataGrid
                                    getRowId={(row) => row._id}
                                    className='clickable-rows'
                                    autoHeight={true}
                                    showColumnRightBorder={false}
                                    onRowClick={(params) => { router.push(`/hiring/contracts/${params.row?._id}`) }}
                                    rows={data?.contracts ? data?.contracts : []}
                                    columns={ContractColumns}
                                    hideFooterSelectedRowCount={true}
                                    pageSize={10}
                                    editMode='row'
                                    rowsPerPageOptions={[5, 10, 20, 50]}
                                />
                            </Box>
                        </TabPanel>
                    </>
                    :
                    <Loader show={isLoading} />
                }
            </Layout>
        </>
    )
}

export default Hiring