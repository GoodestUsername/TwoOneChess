import { ProSidebar, SidebarHeader, SidebarFooter, SidebarContent, Menu, MenuItem } from 'react-pro-sidebar';
import { Box, Typography } from '@mui/material';

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

  const handleCollapseToggle = () => {
    handleSideBarToggle(false, !sideBarCollapsed);
  }

  return (
    <ProSidebar
      style={{ height: "100vh", minWidth:"70px", maxWidth:"200px"}}
      collapsed={sideBarCollapsed}
      toggled={toggled}
      onToggle={handleCollapseToggle}
      breakPoint="md"
    >
      <SidebarHeader>
        <Box style={{ padding: "20px 20px", display:"flex"}}>
            <Typography sx={{
              overflow: "hidden",
            }}> {!sideBarCollapsed && "Two One Chess"}</Typography>
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
          <MenuItem icon={ <PlayArrowIcon /> }> Play Game</MenuItem>
          <MenuItem icon={ <SchoolIcon /> }> Tutorial</MenuItem>
          <MenuItem icon={ <PlaylistAddCheckOutlinedIcon /> }> Features</MenuItem>
          <MenuItem icon={ <PlaylistAddCheckCircleIcon /> }> Planned</MenuItem>
          <MenuItem icon={ <InfoOutlinedIcon /> }> About Me</MenuItem>
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
  