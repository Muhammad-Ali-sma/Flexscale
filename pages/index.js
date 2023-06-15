import Head from "next/head";
import { useEffect } from 'react';
import { Box } from '@mui/material';
import { INTERNAL_ADMIN, INTERNAL_MANAGER } from '../utils';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { selectAuth } from '../store/authSlice';
import { Layout } from '../components/global/Layout';



export default function Home() {

  const authState = useSelector(selectAuth);
  const router = useRouter();

  useEffect(() => {
    if (authState?.token) {
      (authState?.userData.AccessLevel === INTERNAL_ADMIN.level || authState?.userData.AccessLevel === INTERNAL_MANAGER.level) ? router.push('/organization') : router.push('/team');
    }   
  }, [])

  return (
    <>
      <Head>
        <title>Flexscale</title>
      </Head>
      <Layout>
        <Box sx={{ display: 'flex' }}>
          Dashboard
        </Box>
      </Layout>
    </>
  );
}
