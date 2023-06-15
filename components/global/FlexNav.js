import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { Avatar, ListSubheader, MenuItem } from '@mui/material';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { logoutAuth, selectAuth } from "../../store/authSlice";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ListItemButton from '@mui/material/ListItemButton';
import PaymentsIcon from '@mui/icons-material/Payments';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import { useDispatch, useSelector } from "react-redux";
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PaymentIcon from '@mui/icons-material/Payment';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import { MoreVert } from '@mui/icons-material';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import Toolbar from '@mui/material/Toolbar';
import { useEffect, useState } from 'react';
import { CLIENT_USER, INTERNAL_ADMIN, INTERNAL_MANAGER } from '../../utils';
import AppBar from '@mui/material/AppBar';
import { useRouter } from "next/router";
import List from '@mui/material/List';
import theme from "../../utils/theme";
import Box from '@mui/material/Box';
import DrawerBox from './DrawerBox';
import MenuBox from './MenuBox';
import Link from 'next/link';
import UserService from '../../Services/UserService';
import ErrorIcon from '@mui/icons-material/Error';

const drawerWidth = theme.drawerWidth;
const drawerItems = [
    {
        heading: "People",
        items: [
            {
                label: "Team",
                slug: "/team",
                icon: <PeopleOutlineIcon sx={{ color: "white" }} />
            },
            {
                label: "Hiring",
                slug: "/hiring",
                icon: <PersonAddAltIcon sx={{ color: "white" }} />
            }
        ]
    },
    {
        heading: "Billing",
        items: [
            {
                label: "Billing",
                slug: "/billing",
                icon: <AttachMoneyIcon sx={{ color: "white" }} />
            },
            {
                label: "Payment Methods",
                slug: "/payment-methods",
                icon: <PaymentIcon sx={{ color: "white" }} />
            }
        ]
    },
    {
        heading: "Company",
        items: [
            {
                label: "Company Settings",
                slug: "/company-settings",
                icon: <HomeIcon sx={{ color: "white" }} />
            },
            // {
            //     label: "Help Center",
            //     slug: "/help-center",
            //     icon: <QuestionAnswerIcon sx={{ color: "white" }} />
            // }
        ]
    }
];
const internalSuperAdminPaths = [
    {
        heading: "Clients",
        items: [
            {
                label: "Organizations",
                slug: "/organization",
                icon: <HomeIcon sx={{ color: "white" }} />
            },
            {
                label: "Users",
                slug: "/team",
                icon: <PeopleOutlineIcon sx={{ color: "white" }} />
            },
            {
                label: "Placements",
                slug: "/placements",
                icon: <SupportAgentIcon sx={{ color: "white" }} />
            },
            {
                label: "Contracts",
                slug: "/contracts",
                icon: <FileCopyIcon sx={{ color: "white" }} />
            }
        ]
    },
    {
        heading: "Billing",
        items: [
            {
                label: "Invoices",
                slug: "/invoice",
                icon: <RequestQuoteIcon sx={{ color: "white" }} />
            },
            {
                label: "Payments",
                slug: "/payments",
                icon: <PaymentsIcon sx={{ color: "white" }} />
            },
            {
                label: "Timesheets",
                slug: "/timesheets",
                icon: <AccessTimeIcon sx={{ color: "white" }} />
            }
        ]
    },
    {
        heading: "Error Logs",
        items: [
            {
                label: "Error Logs",
                slug: "/error-logs",
                icon: <ErrorIcon sx={{ color: "white" }}/>
            }
        ]
    },
];
const clientUserPaths = [
    {
        heading: "People",
        items: [
            {
                label: "Team",
                slug: "/team",
                icon: <PeopleOutlineIcon sx={{ color: "white" }} />
            },
            {
                label: "Hiring",
                slug: "/hiring",
                icon: <PersonAddAltIcon sx={{ color: "white" }} />
            }
        ]
    },
    {
        heading: "Company",
        items: [
            {
                label: "Company Settings",
                slug: "/company-settings",
                icon: <HomeIcon sx={{ color: "white" }} />
            },
            // {
            //     label: "Help Center",
            //     slug: "/help-center",
            //     icon: <QuestionAnswerIcon sx={{ color: "white" }} />
            // }
        ]
    }
];
const internalManagerPaths = [
    {
        heading: "Clients",
        items: [
            {
                label: "Organizations",
                slug: "/organization",
                icon: <HomeIcon sx={{ color: "white" }} />
            },
            {
                label: "Users",
                slug: "/team",
                icon: <PeopleOutlineIcon sx={{ color: "white" }} />
            },
            {
                label: "Placements",
                slug: "/placements",
                icon: <SupportAgentIcon sx={{ color: "white" }} />
            },
            {
                label: "Contracts",
                slug: "/contracts",
                icon: <FileCopyIcon sx={{ color: "white" }} />
            }
        ]
    },
    {
        heading: "Billing",
        items: [
            {
                label: "Timesheets",
                slug: "/timesheets",
                icon: <AccessTimeIcon sx={{ color: "white" }} />
            }
        ]
    },
];

const FlexNav = ({ className, window }) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activePage, setActivePage] = useState("Dashboard");

    const user = useSelector(selectAuth)?.userData;
    const organization = useSelector(state => state.authUser.selectedOrganization);
    const container = window !== undefined ? () => window().document.body : undefined;
    const dispatch = useDispatch();
    const router = useRouter();

    const logoutUser = () => {
        //API will be here
        dispatch(logoutAuth());
        router.push('/login');
    }

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawerSlugs = (user?.AccessLevel === INTERNAL_ADMIN.level ? internalSuperAdminPaths : user?.AccessLevel === INTERNAL_MANAGER.level ? internalManagerPaths : user?.AccessLevel === CLIENT_USER.level ? clientUserPaths : drawerItems)?.flatMap(x => x.items.map(y => { return { label: y.label, slug: y.slug } }));

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    const clearDatabase = () => {
        UserService.ClearDatabase()
            .then(res => console.log(res))
            .catch(err => console.log(err))
    }
    useEffect(() => {
        drawerSlugs.forEach(x => {
            if (router.pathname.includes(x.slug)) {
                setActivePage(x.label);
            }
        });
    }, [router.pathname]);

    const drawer = (
        <div style={{ color: 'white', height: '100%', display: "flex", justifyContent: "space-between", flexDirection: "column" }}>
            <Box>
                <Link href="/team">
                    <img src="/assets/images/logo.svg" style={{ padding: "25px" }} />
                </Link>
                <List>
                    {(user?.AccessLevel === INTERNAL_ADMIN.level ? internalSuperAdminPaths : user?.AccessLevel === INTERNAL_MANAGER.level ? internalManagerPaths : user?.AccessLevel === CLIENT_USER.level ? clientUserPaths : drawerItems)?.map((list, index) => (
                        <Box component={'span'} key={`nav_${index}`}>
                            <ListSubheader sx={{ backgroundColor: theme.palette.primary.main, color: "#FFF", opacity: 0.6, letterSpacing: 1.5, lineHeight: 1.8, fontSize: 12, textTransform: "uppercase", mt: 2 }}>{list.heading}</ListSubheader>
                            {list?.items.map((item, itemIndex) => (
                                <ListItem key={`${itemIndex}_${item.label}`} disablePadding>
                                    <Link href={item.slug} passHref legacyBehavior>
                                        <ListItemButton selected={activePage === item.label}>
                                            <ListItemIcon>
                                                {item.icon}
                                            </ListItemIcon>
                                            <ListItemText primary={item.label} />
                                        </ListItemButton>
                                    </Link>
                                </ListItem>
                            ))}
                        </Box>
                    ))}
                </List>
            </Box>
            <Box>
                <Divider color='#364F4F' />
                <ListItem>
                    <ListItemIcon>
                        {user?.ProfileImage ? <Avatar alt="Remy Sharp" src={user?.ProfileImage} /> :
                            <Avatar sx={{ bgcolor: "#BDBDBD", fontSize: "18px" }}>{user?.FirstName?.substring(0, 1)?.toUpperCase()}{user?.LastName?.substring(0, 1)?.toUpperCase()}</Avatar>}
                    </ListItemIcon>
                    <ListItemText>
                        <Typography>{user?.FirstName} {user?.LastName}</Typography>
                        <Typography sx={{ opacity: 0.6, fontSize: "0.9rem" }}>{organization ? organization?.Name : user?.Organization && user?.Organization[0]?.Name}</Typography>
                    </ListItemText>
                    <ListItemIcon onClick={handleMenuClick} sx={{ minWidth: 24, cursor: "pointer" }}>
                        <MoreVert sx={{ color: "white" }} />
                    </ListItemIcon>
                    <MenuBox
                        anchorEl={anchorEl}
                        open={open}
                        handleClose={handleMenuClose}
                    >
                        {user?.Organization?.length > 1 &&
                            <MenuItem
                                onClick={() => router.push({
                                    pathname: '/set-organization',
                                    query: { returnUrl: router.asPath }
                                })}
                            >Change Organization</MenuItem>
                        }
                        {user?._id === '6386106b8534e766fcbada14' &&
                            <MenuItem onClick={() => clearDatabase()}>Clear Database</MenuItem>
                        }
                        <MenuItem onClick={() => { handleMenuClose(); logoutUser() }}>Logout</MenuItem>
                    </MenuBox>
                </ListItem>
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
                    display: { md: 'none' },
                    mb: '64px',
                }}
            >
                <Toolbar style={{ backgroundColor: "white", color: "black", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="b" noWrap sx={{ gap: 1, display: "flex" }}>
                        <img src="/assets/images/smallLogo.svg" />
                        {activePage}
                    </Typography>
                    <IconButton
                        color={"primary"}
                        aria-label="open drawer"
                        edge="end"
                        onClick={handleDrawerToggle}
                        sx={{ ml: 2, display: { md: 'none' } }}
                    >
                        <MenuIcon color={"primary"} />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
                aria-label="mailbox folders"
            >
                <DrawerBox
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    containerStyle={{
                        display: { sm: 'block', md: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, background: theme.palette.primary.main },
                    }}
                >
                    {drawer}
                </DrawerBox>
                <DrawerBox
                    variant="permanent"
                    containerStyle={{
                        display: { md: 'block', xs: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, background: theme.palette.primary.main },
                    }}
                >
                    {drawer}
                </DrawerBox>
            </Box>
        </>
    )
}
export default FlexNav;

