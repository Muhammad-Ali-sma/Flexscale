import moment from 'moment';
import Head from "next/head";
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { Person } from '@mui/icons-material';
import Loader from '../../components/global/Loader';
import FlexCard from '../../components/global/FlexCard';
import { Layout } from '../../components/global/Layout';
import { formatNum } from '../../utils/globalFunctions';
import { BodyHeader } from '../../components/global/BodyHeader';
import ProfileSection from '../../components/global/ProfileSection';
import AgentStatusChip from '../../components/global/AgentStatusChip';
import { Box, Grid, Paper, Tab, Table, TableBody, TableCell, TableContainer, TableRow, Tabs, Typography } from '@mui/material';
import { TabPanel, tabProps } from '../../components/global/TabPanel';

export default function TeamUserDetails() {

    const router = useRouter()
    const { id } = router.query;
    const user = useSelector(state => state.dataSlice.usersList)?.filter(x => x?._id === id)[0];

    return (
        <>
            <Head>
                <title>{user?.PreferredName ?? user?.FirstName} | Users | Flexscale</title>
            </Head>
            <Layout>
                {user ?
                    <>
                        <BodyHeader title={`${user?.FirstName} ${user?.LastName}`} subtitle={""} showAvatar={true} />
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={0}>
                                <Tab label={`Profile`} {...tabProps(0)} />
                            </Tabs>
                        </Box>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={9} lg={8}>
                                <TabPanel value={0} index={0}>
                                    <ProfileSection title="Basics" icon={<Person sx={{ color: "#2196F3" }} />} iconBg="#EEF7FE">
                                        <TableContainer component={Paper} sx={{ boxShadow: "none", border: 0 }}>
                                            <Table>
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell component="th" sx={{ fontWeight: 800, width: '50%' }}>Full Name</TableCell>
                                                        <TableCell>{user?.FirstName} {user?.LastName}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell component="th" sx={{ fontWeight: 800, width: '50%' }}>Preferred Name</TableCell>
                                                        <TableCell>{user?.PreferredName}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell component="th" sx={{ fontWeight: 800, width: '50%' }}>Pronouns</TableCell>
                                                        <TableCell>{user?.Gender}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell component="th" sx={{ fontWeight: 800, width: '50%' }}>Email</TableCell>
                                                        <TableCell>{user?.Email}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell component="th" sx={{ fontWeight: 800, width: '50%' }}>Nationality</TableCell>
                                                        <TableCell>{user?.Location}</TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </ProfileSection>
                                </TabPanel>
                            </Grid>
                        </Grid>
                    </>
                    :
                    <Loader show={!user ? true : false} />
                }
            </Layout>
        </>
    );
}
