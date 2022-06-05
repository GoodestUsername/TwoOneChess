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
import { useState } from 'react';

const SideBar = () => {
    const [toggled, setToggled] = useState<boolean>(false);
    const [collapsed, setCollapsed] = useState<boolean>(true);
    const handleSideBarToggle = () => {
      setToggled(!toggled);
    };

    return (
      <ProSidebar
        style={{ height: "100vh", minWidth:"30px"}}
        image={undefined}
        collapsed={collapsed}
        toggled={true}
        onToggle={handleSideBarToggle}
        breakPoint="md"
      >
        <SidebarHeader>
          <Box style={{ padding: "20px 20px", }}>
              <Typography sx={{
                overflow: "hidden",
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                Two One Chess
              </Typography>
          </Box>
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
            <div
                className="sidebar-btn-wrapper"
                style={{ padding: "20px 24px", overflow: "hidden",
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',}}>
                <a href="https://github.com/GoodestUsername/TwoOneChess"
                    target="_blank"
                    className="sidebar-btn"
                    rel="noopener noreferrer">
                    <GitHubIcon />
                    <span> Source </span>
                </a>
            </div>
        </SidebarFooter>
      </ProSidebar>
    );
  };
  
  export default SideBar;
  