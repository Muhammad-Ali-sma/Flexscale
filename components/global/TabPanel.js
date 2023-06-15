import { Box } from "@mui/material";

export const tabProps = (index) => {
    return {
        sx: { px: {xs: 2, sm: 3, md: 4}, textTransform: "capitalize", fontWeight: 400 },
        id: `team-tab-${index}`,
        'aria-controls': `team-tabpanel-${index}`,
    };
}

export const TabPanel = (props) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`team-tabpanel-${index}`}
            aria-labelledby={`team-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ py: 2 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}