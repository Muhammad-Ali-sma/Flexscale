import * as React from 'react';
import Head from "next/head";
import { useState } from 'react';
import { Box,Tab, Tabs } from '@mui/material';
import { Layout } from '../../components/global/Layout';
import { BodyHeader } from '../../components/global/BodyHeader';
import { tabProps, TabPanel } from '../../components/global/TabPanel';

export default function UserManagement() {
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [value, setValue] = useState(0);

  return (
    <>
      <Head>
        <title>User Management | Flexscale</title>
      </Head>
      <Layout>
        <BodyHeader title={"User Management"} subtitle={"Manage your users and monitor their performance."} />
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="auto">
            <Tab label="Active (5)" {...tabProps(0)} />
            <Tab label="Inactive (1)" {...tabProps(1)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          Item One
        </TabPanel>
        <TabPanel value={value} index={1}>
          Item Two
        </TabPanel>
      </Layout>
    </>
  );
}
