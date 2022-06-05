import { CssBaseline, Grid } from '@mui/material';
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
            <div className="Layout">
              <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justifyContent="center"
                style={{ minHeight: '100vh' }}
              >
                <Grid item xs={3}>
                  <Outlet/>
                </Grid>   
              </Grid> 
            </div>
          </ThemeProvider>
        </CookiesProvider>
      </SocketContext.Provider>
  );
}

export default Layout;
