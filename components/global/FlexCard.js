import { Box } from "@mui/material";

const FlexCard = ({ children, containerStyle, onClick }) => {
    return (
        <Box className="search-area" sx={[{ width: '100%', background: "white", px: 3, py: 2, borderRadius: 1, mb: 2 }, containerStyle]} onClick={onClick}>
            {children}
        </Box>
    )
}

export default FlexCard;