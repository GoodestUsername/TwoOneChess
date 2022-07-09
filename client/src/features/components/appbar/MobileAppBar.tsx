import { AppBar, Container, Toolbar, Box, IconButton, Typography } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';

// redux
import { toggleCollapse, toggleSidebar } from "features/components/sidebar/sidebarSlice";
import { useDispatch } from "react-redux";

const MobileAppBar = () => {
    const dispatch = useDispatch();
    return (
        <AppBar position="sticky">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Box sx={{ flexGrow: 1 }}>
                        <IconButton color="inherit" onClick={() => {
                            dispatch(toggleCollapse())
                            dispatch(toggleSidebar())
                        }} >
                            <MenuIcon sx={{ height: "2.5rem", width: "2.5rem" }}/>
                        </IconButton>
                    </Box>
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                    Two-One Chess
                    </Typography>
                </Toolbar>
            </Container>
        </AppBar>
    )
}
export default MobileAppBar;