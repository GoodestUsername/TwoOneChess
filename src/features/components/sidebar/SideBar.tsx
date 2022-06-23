import { ProSidebar, SidebarHeader, SidebarFooter, SidebarContent, Menu, MenuItem } from 'react-pro-sidebar';
import { Box, Typography } from '@mui/material';
import { Link } from "react-router-dom";

// hooks
import { useMediaQuery } from 'react-responsive';

// icons
import PlaylistAddCheckOutlinedIcon from '@mui/icons-material/PlaylistAddCheckOutlined';
import PlaylistAddCheckCircleIcon from '@mui/icons-material/PlaylistAddCheckCircle';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import GitHubIcon from '@mui/icons-material/GitHub';
import SchoolIcon from '@mui/icons-material/School';

interface SideBarInterface {
  toggled: any,
  handleSideBarToggle: Function,
  sideBarCollapsed: any,
}

const SideBar: React.FC<SideBarInterface> = ({
  sideBarCollapsed,
  toggled, 
  handleSideBarToggle
}) => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' })
  
  const handleCollapseToggle = () => {
    handleSideBarToggle(false, !sideBarCollapsed);
  }
  
  return (
    <ProSidebar
      style={{ 
        height: "100vh",
        minWidth:"70px",
        maxWidth:"200px",
        position: isMobile ? "fixed" : "sticky",
        top: 0
      }}
      collapsed={sideBarCollapsed}
      toggled={toggled}
      onToggle={handleCollapseToggle}
      breakPoint={"md"}
    >
      <SidebarHeader>
        <Box style={{ padding: "20px 20px", display:"flex"}}>
            <Typography sx={{
              overflow: "hidden",
            }}> {!sideBarCollapsed && "Two-One Chess"}</Typography>
            <MenuItem
                icon={ sideBarCollapsed ? <ArrowForwardIosIcon /> : <ArrowBackIosIcon /> }
                style={{
                  float: "right", 
                  listStyleType: "none", 
                  paddingLeft: sideBarCollapsed ?  "4px" : "15px"
                }}
                onClick={handleCollapseToggle}>
            </MenuItem>
        </Box>
      </SidebarHeader>

      <SidebarContent>
        <Menu iconShape="circle">
          <MenuItem onClick={() => {window.location.href="/"}} icon={ <PlayArrowIcon /> }>
            <Typography> Play Game </Typography>
          </MenuItem>
          <MenuItem icon={ <SchoolIcon /> }>
            <Link to={"/tutorial"}> Tutorial </Link>
          </MenuItem>
          <MenuItem icon={ <PlaylistAddCheckOutlinedIcon /> }> 
            <Link to={"/features"}> Features </Link>
          </MenuItem>
          <MenuItem icon={ <PlaylistAddCheckCircleIcon /> }>
            < Link to={"/planned"}> Planned </Link>
          </MenuItem>
          <MenuItem icon={ <InfoOutlinedIcon /> }> 
            <Link to={"/about"}> About Me </Link>
          </MenuItem>
        </Menu>
      </SidebarContent>
      <SidebarFooter style={{ textAlign: "center" }}>
          <div
              className="sidebar-btn-wrapper"
              style={{ padding: "20px 24px", overflow: "hidden",
              whiteSpace: 'nowrap',}}>
              <a href="https://github.com/GoodestUsername/TwoOneChess"
                  target="_blank"
                  className="sidebar-btn"
                  rel="noopener noreferrer">
                  <GitHubIcon />
                  <span> {!sideBarCollapsed && "Source"} </span>
              </a>
          </div>
      </SidebarFooter>
    </ProSidebar>
  );
};
  
export default SideBar;
  