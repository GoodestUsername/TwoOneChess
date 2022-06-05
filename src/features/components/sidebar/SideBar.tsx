import { ProSidebar, SidebarHeader, SidebarFooter, SidebarContent, Menu, MenuItem } from 'react-pro-sidebar';
import { Box, Typography } from '@mui/material';

// icons
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import GitHubIcon from '@mui/icons-material/GitHub';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PlaylistAddCheckCircleIcon from '@mui/icons-material/PlaylistAddCheckCircle';
import PlaylistAddCheckOutlinedIcon from '@mui/icons-material/PlaylistAddCheckOutlined';
import SchoolIcon from '@mui/icons-material/School';

// css
import "react-pro-sidebar/dist/css/styles.css";

const SideBar = () => {
    return (
      <ProSidebar
        style={{ height: "100vh", minWidth:"3rem"}}
        image={undefined}
        // rtl={rtl}
        collapsed={false}
        toggled={false}
        breakPoint="sm"
        // onToggle={handleToggleSidebar}
      >
        <SidebarHeader>
          <div
            style={{
              padding: "1rem",
              textTransform: "uppercase",
              fontWeight: "bold",
              fontSize: 14,
              overflow: "hidden",
            }}
          >
            <Typography>Two One Chess</Typography>
          </div>
        </SidebarHeader>
  
        <SidebarContent>
          <Menu iconShape="circle">
            <MenuItem icon={<PlayArrowIcon />}> Play Game</MenuItem>
            <MenuItem icon={<SchoolIcon />}> Tutorial</MenuItem>
            <MenuItem icon={<PlaylistAddCheckOutlinedIcon />}> Features</MenuItem>
            <MenuItem icon={<PlaylistAddCheckCircleIcon />}> Planned</MenuItem>
            <MenuItem icon={<InfoOutlinedIcon />}> About Me</MenuItem>
          </Menu>
        </SidebarContent>
  
        <SidebarFooter style={{ textAlign: "center" }}>
        <Box sx={{ padding: "1rem 3rem" }}>
            <a href="https://github.com/GoodestUsername/TwoOneChess"
              rel="noopener noreferrer">
              <GitHubIcon />
              <span> Source </span>
            </a>
          </Box>
        </SidebarFooter>
      </ProSidebar>
    );
  };
  
  export default SideBar;
  