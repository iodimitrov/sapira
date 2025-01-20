import { createTheme } from '@material-ui/core/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2282ff',
    },
    secondary: {
      main: '#454545',
    },
    error: {
      main: '#ff1744',
    },
    background: {
      default: '#fff',
    },
  },
});

export default theme;
