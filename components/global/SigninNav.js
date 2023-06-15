import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import AppBar from '@mui/material/AppBar';
import theme from "../../utils/theme";
import Box from '@mui/material/Box';
import CustomBtn from './CustomBtn';
import DrawerBox from './DrawerBox';
import Link from 'next/link';


const drawerWidth = 530;



const SigninNav = () => {

    const drawer = (
        <div style={{ color: 'white', height: '100%', display: "flex", justifyContent: "space-between", flexDirection: "column" }}>
            <Box sx={{ marginLeft: '70px', marginRight: '40px', marginTop: '50px' }}>
                <Link href="/team">
                    <img src="/assets/images/logo.svg" />
                </Link>
                <br /><br />
                <Typography variant="h4" sx={{ fontWeight: '900', mb: 1, mt: 5 }}>Welcome</Typography>
                <Typography variant="body2">Get started by answering a few questions and creating your account.</Typography>
                <br /><br /><br />
                <Typography variant="body2">Want to speak with someone instead?</Typography>
                <br />
                <Link href='https://meetings.hubspot.com/matthew-weyand/flexscale-discovery-call'>
                    <CustomBtn
                        title={"Get in touch"}
                        btnStyle={{ border: '1px solid white', color: 'white' }}
                    />
                </Link>


            </Box>
        </div>
    );

    return (
        <>
            <AppBar
                position="fixed"
                sx={{
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    ml: { md: `${drawerWidth}px` },
                    display: { md: 'none' }
                }}
            >
                <Toolbar style={{ backgroundColor: "#203B3C", color: "black", display: "flex", justifyContent: "space-between", alignItems: "center" }}>

                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 }, display: { md: 'block', sm: 'none' } }}
                aria-label="mailbox folders"
            >
                <DrawerBox
                    variant="permanent"
                    containerStyle={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, background: theme.palette.primary.main },
                    }}
                >
                    {drawer}
                </DrawerBox>
            </Box>
        </>
    )
}
export default SigninNav;

