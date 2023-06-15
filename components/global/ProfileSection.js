import { Box, Typography } from "@mui/material";
import { Person } from "@mui/icons-material";
import FlexCard from "./FlexCard";

const ProfileSection = ({children, title = "", icon = <Person color="#2196F3" />, iconBg = "#EEF7FE"}) => {
    return (
        <FlexCard>
            <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
                <Box sx={{display: "flex", alignItems: "center", justifyContent: 'center', background: iconBg, width: '40px', height: '40px', borderRadius: 1}}>
                    {icon}
                </Box>
                <Typography sx={{ fontWeight: 700, fontSize: { xs: "1rem", md: "1.25rem" } }}>{title}</Typography>
            </Box>
            <Box sx={{ px: 5, py: 2 }}>
                {children}
            </Box>
        </FlexCard>
    )
}

export default ProfileSection;

