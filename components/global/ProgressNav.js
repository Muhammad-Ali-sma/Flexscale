import Link from 'next/link';
import Box from '@mui/material/Box';
import CustomBtn from './CustomBtn';
import DrawerBox from './DrawerBox';
import theme from "../../utils/theme";
import { useRouter } from 'next/router';
import AppBar from '@mui/material/AppBar';
import { useSelector } from "react-redux";
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Step, StepContent, StepLabel, Stepper } from '@mui/material';


const drawerWidth = 530;
const steps = [
    {
        label: 'Basic information',
    },
    {
        label: 'Job requirements',
    },
    {
        label: 'Notifications',
    },
    {
        label: 'Review and submit',
    }
];


const ProgressNav = () => {
    const activeStep = useSelector(state => state.authUser.activeStep);
    const router = useRouter();

    const drawer = (
        <div style={{ color: 'white', height: '100%', display: "flex", justifyContent: "space-between", flexDirection: "column" }}>
            <Box sx={{ marginLeft: '70px', marginTop: '50px' }}>
                <Link href="/team">
                    <img src="/assets/images/logo.svg" />
                </Link>
                <Typography variant="h4" sx={{ fontWeight: '900', mb: 1, mt: 5 }}>Add a new hire</Typography>
                <Typography variant="body2">Tell us what you need and we'll find the best candidates for you.</Typography>

                <Stepper activeStep={activeStep} orientation="vertical" sx={{ color: 'white', marginTop: '50px' }}>
                    {steps.map((step, index) => (
                        <Step key={step.label} className="progressnav-label">
                            <StepLabel >
                                {step.label}
                            </StepLabel>
                            <StepContent >
                                <Typography variant="body2">{step.description}</Typography>
                            </StepContent>
                        </Step>
                    ))}
                </Stepper>
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
                <Toolbar className='hiring-nav-container'>
                    <div className='hiring-nav-logo-wrapper'>
                        <img src="/favicon.ico" width={'30px'} />&nbsp;&nbsp;&nbsp;&nbsp;
                        <Typography>Add a new hire</Typography>
                    </div>
                    <CustomBtn
                        title="GO BACK"
                        btnStyle={{ border: '1px solid white', color: 'white' }}
                        icon={<ArrowBackIcon />}
                        onClick={() => router.back()}
                        btnTitleStyle={{ display: { sm: 'inline', xs: 'none' } }}
                    />
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
export default ProgressNav;

