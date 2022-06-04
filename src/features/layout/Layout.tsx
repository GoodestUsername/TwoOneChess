import { CssBaseline, Typography } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { SocketContext, socket } from "context/socketContext";
import { CookiesProvider } from "react-cookie";
import { Outlet } from "react-router-dom";
import darkTheme from 'theme/muiTheme/MUITheme';

// Components
const Layout = () => {
  return (
      <SocketContext.Provider value={socket}>
        <CookiesProvider>
          <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <div className="App">
              <Typography variant="h3" component="h3">
                Two-One Chess
              </Typography>
              <Outlet/>
            </div>
          </ThemeProvider>
        </CookiesProvider>
      </SocketContext.Provider>
  );
}

export default Layout;
