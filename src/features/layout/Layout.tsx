import { CookiesProvider } from "react-cookie";
import { Outlet } from "react-router-dom";
import { useState } from "react";

// components
import ViewHeadlineIcon from '@mui/icons-material/ViewHeadline';
import SideBar from 'features/components/sidebar/SideBar';
import { CssBaseline, Grid } from '@mui/material';

// context
import { SocketContext, socket } from "context/socketContext";

// css/ styles
import { ThemeProvider } from '@mui/material/styles';
import darkTheme from 'theme/muiTheme/MUITheme';
import "react-pro-sidebar/dist/css/styles.css";

// hooks
import { useMediaQuery } from "react-responsive";

const Layout = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 760px)' })

  // sidebar states
  const [toggled, setToggled] = useState<boolean>(isMobile);
  const [sideBarCollapsed, setSideBarCollapsed] = useState<boolean>(false);
  
  const handleSideBarToggle = (newToggle: boolean, newCollapsed: boolean) => {
    setToggled(newToggle);
    setSideBarCollapsed(newCollapsed);
  };

  return (
      <SocketContext.Provider value={socket}>
        <CookiesProvider>
          <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <div className="Layout" style={{
                  display: 'flex',
                  flexDirection: 'row',
            }}>
              {isMobile && <ViewHeadlineIcon style={{
                position: "absolute",
                width: "4rem",
                height: "4rem"
                }} className="btn-toggle" onClick={() => handleSideBarToggle(true, false)} /> }
              <SideBar 
                sideBarCollapsed={sideBarCollapsed} 
                setSideBarCollapsed={setSideBarCollapsed}
                toggled={toggled} 
                handleSideBarToggle={handleSideBarToggle}/>
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
