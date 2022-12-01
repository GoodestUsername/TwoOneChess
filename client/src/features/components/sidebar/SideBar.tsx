import { ProSidebar, SidebarHeader, SidebarFooter, SidebarContent, Menu, MenuItem } from 'react-pro-sidebar';
import { Box, Typography } from '@mui/material';
import { Link } from "react-router-dom";

// hooks
import { useMediaQuery } from 'react-responsive';
import { useSelector, useDispatch } from 'react-redux';

// redux
import { selectCollapse, selectToggle, toggleCollapse, toggleSidebar } from './sidebarSlice';

// icons
import PlaylistAddCheckOutlinedIcon from '@mui/icons-material/PlaylistAddCheckOutlined';
import PlaylistAddCheckCircleIcon from '@mui/icons-material/PlaylistAddCheckCircle';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import GitHubIcon from '@mui/icons-material/GitHub';
import SchoolIcon from '@mui/icons-material/School';
/**
 * sidebar component of app
 * @returns Sidebar component
 */
const SideBar = () => {
  // media query hook
  const minFullSizeWidth = useMediaQuery({maxWidth: 950});

  // redux hooks
  const toggle = useSelector(selectToggle);
  const collapse = useSelector(selectCollapse);
  const dispatch = useDispatch();

  /** function called when collapse is toggled */
  const handleCollapseToggle = () => {
    dispatch(toggleCollapse())
    dispatch(toggleSidebar())
  }
  return (
    <ProSidebar
      style={{
        height: "100vh",
        minWidth:"70px",
        maxWidth:"200px",
        position: minFullSizeWidth? "fixed": "sticky",
        top: 0
      }}
      collapsed={collapse}
      toggled={toggle}
      onToggle={handleCollapseToggle}
      breakPoint={"md"}
    >
      <SidebarHeader>
        <Box style={{ padding: "20px 20px", display:"flex"}}>
          {/* hide text if collapsed */}
            <Typography sx={{
              overflow: "hidden"
            }}> {!collapse && "Two-One Chess"}</Typography>
            {/* change to > icon if collapsed < if not collapsed */}
            <MenuItem
                icon={ collapse ? <ArrowForwardIosIcon /> : <ArrowBackIosIcon /> }
                style={{
                  float: "right", 
                  listStyleType: "none", 
                  paddingLeft: collapse ?  "4px" : "15px"
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
        {/* link to github source code */}
          <div
              className="sidebar-btn-wrapper"
              style={{ padding: "20px 24px", overflow: "hidden",
              whiteSpace: 'nowrap',}}>
              <a href="https://github.com/GoodestUsername/TwoOneChess"
                  target="_blank"
                  className="sidebar-btn"
                  rel="noopener noreferrer">
                  <GitHubIcon />
                  <span> {!collapse && "Source"} </span>
              </a>
          </div>
      </SidebarFooter>
    </ProSidebar>
  );
};
  
export default SideBar;
  