import theme from "../../utils/theme";
import { Box } from "@mui/material";
import Footer from "./Footer";
import Header from "./Header";

export const Layout = ({ children }) => {
    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <Header />
                <Box component="main" sx={{ flexGrow: 1, px: {xs: 3, sm: 4, md: 8 }, py: 3, mt: {xs: 8, md: 2}, width: { xs: '100%', md: `calc(100% - ${theme.drawerWidth}px)` } }}>
                    {children}
                </Box>
                <Footer />
            </Box>
        </>
    )
}