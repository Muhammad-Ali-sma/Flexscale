import React from 'react';
import Head from 'next/head';
import { Box } from '@mui/system';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { INTERNAL_ADMIN, INTERNAL_MANAGER } from '../../utils';
import { Typography } from '@mui/material';
import SelectDropdown from '../../components/global/SelectDropdown';
import { selectAuth, setOrganization } from '../../store/authSlice';

const SetOrg = () => {
    const user = useSelector(selectAuth)?.userData;
    const dispatch = useDispatch();
    const router = useRouter();


    const toggleOrg = (e) => {
        dispatch(setOrganization({ org: e.target.value }));
        if (user?.AccessLevel === INTERNAL_MANAGER.level || user?.AccessLevel === INTERNAL_ADMIN.level) {
            router.push('/organization');
        } else {
            router.push('/team');
        }
    }

    return (
        <>
            <Head>
                <title>Forgot Password | Flexscale</title>
            </Head>
            <Box sx={{ background: "white", height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }} >
                <Typography sx={{ fontWeight: 800, marginBottom: 1, fontSize: { xs: "1.4rem", md: "1.7rem" } }}>Switch Organization</Typography>
                <div style={{ width: '40vw' }}>
                    <SelectDropdown
                        variant="standard"
                        setValue={toggleOrg}
                        label="Organization(s)"
                        required={true}
                        showAll={false}
                        data={user?.Organization}
                    />
                </div>
            </Box >
        </>
    )
}

export default SetOrg