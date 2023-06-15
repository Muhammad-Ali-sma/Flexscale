import Head from "next/head";
import { useQuery } from "react-query";
import { useRouter } from 'next/router';
import { useSelector } from "react-redux";
import { Box, Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { TimesheetColumns } from "../../utils/data";
import Loader from '../../components/global/Loader';
import { useEffect, useState, useReducer } from "react";
import FlexCard from "../../components/global/FlexCard";
import { Layout } from '../../components/global/Layout';
import FlexField from '../../components/global/FlexField';
import CustomBtn from "../../components/global/CustomBtn";
import { formReducer } from "../../utils/globalFunctions";
import DialogBox from "../../components/dialogBox/DialogBox";
import TimesheetService from "../../Services/TimesheetService";
import { BodyHeader } from '../../components/global/BodyHeader';
import SelectDropdown from '../../components/global/SelectDropdown';
import TimesheetModal from "../../components/dialogBox/TimesheetModal";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';



export default function Timesheet() {

    const organizations = useSelector(state => state.dataSlice.OrganizationList);
    const [formData, setFormData] = useReducer(formReducer, {});
    const [timesheetModal, setTimesheetModal] = useState(0);
    const [filteredSheets, setFilteredSheets] = useState([]);
    const router = useRouter();



    const { data: list, isLoading } = useQuery(['getAllTimesheets'], () => TimesheetService.getAllTimesheets());

    const filterTimesheetsByValue = (value, orgId, member) => {
        let tempSheets = JSON.parse(JSON.stringify(list?.timesheets));
        if (value || orgId || member) {
            if (value) {
                tempSheets = tempSheets?.filter(x => x?._id?.toLowerCase()?.indexOf(value?.toLowerCase()) !== -1);
            }
            if (orgId) {
                if (!value) {
                    tempSheets = tempSheets?.filter(x => x?.Organization?._id == orgId);
                } else {
                    tempSheets = tempSheets?.filter(x => x?._id?.toLowerCase()?.indexOf(value?.toLowerCase()) !== -1 && x?.Organization?._id == orgId);
                }
            }
            if (member) {
                if (!value && !orgId) {
                    tempSheets = tempSheets?.filter(x => (x?.User?.FirstName + x?.User?.LastName)?.toLowerCase()?.includes(member?.toLowerCase()?.replace(/ /g, '')));
                } else if (!value) {
                    tempSheets = tempSheets?.filter(x => x?.Organization?._id == orgId && (x?.User?.FirstName + x?.User?.LastName)?.toLowerCase()?.includes(member?.toLowerCase()?.replace(/ /g, '')));
                } else if (!orgId) {
                    tempSheets = tempSheets?.filter(x => x?._id?.toLowerCase()?.indexOf(value?.toLowerCase()) !== -1 && (x?.User?.FirstName + x?.User?.LastName)?.toLowerCase()?.includes(member?.toLowerCase()?.replace(/ /g, '')));
                } else {
                    tempSheets = tempSheets?.filter(x => x?._id?.toLowerCase()?.indexOf(value?.toLowerCase()) !== -1 && x?.Organization?._id == orgId && (x?.User?.FirstName + x?.User?.LastName)?.toLowerCase()?.includes(member?.toLowerCase()?.replace(/ /g, '')));
                }
            }
        }
        if (tempSheets) {
            setFilteredSheets(tempSheets);
        }
    }

    useEffect(() => {
        if (list?.timesheets?.length > 0) {
            setFilteredSheets(list?.timesheets)
        }
    }, [list])

    return (
        <>
            <Head>
                <title>Timesheet | Flexscale</title>
            </Head>
            <Layout>
                <BodyHeader
                    title={"Timesheets"}
                    button={<CustomBtn
                        onClick={() => setTimesheetModal(1)}
                        variant="contained"
                        title={"Create New Timesheet"}
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
                                    label="Search by Timesheet ID"
                                    as="search"
                                    variant="outlined"
                                    setValue={(e) => { filterTimesheetsByValue(e.target.value, formData['Organization'], formData['TeamMember']); setFormData(e) }}
                                    name='Search'
                                />
                            </Grid>
                            <Grid item lg={2} md={2} xs={12}>
                                <SelectDropdown
                                    setValue={(e) => { filterTimesheetsByValue(formData['Search'], e.target.value, formData['TeamMember']); setFormData(e) }}
                                    label="Organization"
                                    name="Organization"
                                    data={organizations}
                                    getId={true}
                                />
                            </Grid>
                            <Grid item lg={2} md={2} xs={12}>
                                <FlexField
                                    setValue={(e) => { filterTimesheetsByValue(formData['Search'], formData['Organization'], e.target.value); setFormData(e) }}
                                    placeholder="Team Member"
                                    variant="outlined"
                                    as="search"
                                    name="TeamMember"
                                />
                            </Grid>
                        </Grid>
                    </FlexCard>
                </div>
                {!isLoading ?
                    <>
                        <Box sx={{ width: '100%', background: "white" }}>
                            <DataGrid
                                getRowId={(row) => row._id}
                                className='clickable-rows'
                                autoHeight={true}
                                showColumnRightBorder={false}
                                onCellClick={(params) => {
                                    if (params.field === 'Action') {
                                        window.open(`/timesheets/${params.row._id}`, '_blank');
                                    } else {
                                        router.push(`/timesheets/${params.row._id}`);
                                    }
                                }}
                                rows={filteredSheets}
                                columns={TimesheetColumns}
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
            <DialogBox
                maxWidth="md"
                open={timesheetModal > 0 ? true : false}
                handleClose={() => setTimesheetModal(0)}
                title="Create new timesheet"
                msg={timesheetModal == 2 ? "Add hours per date below. Check OL if the team member was On Leave that day. If you need to adjust the Start and End date, go back." : "Fill out details below and click next to add hours."}
            >
                <TimesheetModal
                    timesheetModal={timesheetModal}
                    saveBtnTitle={timesheetModal == 1 ? "Next" : 'Save'}
                    handleSave={(num) => setTimesheetModal(num)}
                    closeBtnTitle={timesheetModal == 2 ? 'Back' : 'Close'}
                    handleClose={() => setTimesheetModal(0)}
                />
            </DialogBox>
        </>
    );
}

