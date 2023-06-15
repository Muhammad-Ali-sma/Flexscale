import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#203B3C',
      dark: '#203B3C',
      light: '#203B3C',
    },
    secondary: {
      main: '#8AA080',
    },
    error: {
      main: red.A400,
    },
    action: {
        hover: 'rgba(0, 0, 0, 0.04)'
    }
  },
  drawerWidth: 250
});

export default theme;
