import { CookiesProvider } from "react-cookie";
import { Outlet } from "react-router-dom";
import { useState } from "react";

// components

import SideBar from 'features/components/sidebar/SideBar';
import { CssBaseline, Grid } from '@mui/material';

// context
import { SocketContext, socket } from "context/socketContext";

// css/ styles
import { ThemeProvider } from '@mui/material/styles';
import darkTheme from 'styling/muiTheme/MUITheme';
import "react-pro-sidebar/dist/css/styles.css";

// hooks
import { useMediaQuery } from "react-responsive";
import MobileAppBar from "features/components/appbar/MobileAppBar";

const Layout = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' })
  const minFullSizeWidth = useMediaQuery({maxWidth: 950, minWidth: 769});
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
            {isMobile && <MobileAppBar handleSideBarToggle={handleSideBarToggle} />}
            <div className="Layout"
              style={{
                display: "flex",
                flexDirection: "row",
                overflowX: "hidden",
                overflowY: "auto",
            }}>
              <SideBar
                sideBarCollapsed={sideBarCollapsed}
                toggled={toggled}
                handleSideBarToggle={handleSideBarToggle}/>
              <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                style={{ maxHeight: isMobile ? "calc(100vh - 64px)": '100vh', marginLeft: minFullSizeWidth? "80px" : "0px"}}
              >
                <Grid
                  item sx={{minHeight: "100%"}} xs={"auto"} sm={"auto"} md={1} lg={6} xl={3}>
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
