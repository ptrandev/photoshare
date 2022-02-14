import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Button,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from "@mui/material";
import { Link as RouterLink } from 'react-router-dom';

import MenuIcon from '@mui/icons-material/Menu';
import GroupIcon from '@mui/icons-material/Group';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import StyleIcon from '@mui/icons-material/Style';
import SearchIcon from '@mui/icons-material/Search';
import RecommendIcon from '@mui/icons-material/Recommend';
import HomeIcon from '@mui/icons-material/Home';

const drawerWidth = 240;

const DrawerList = () => {
  const drawerItems = [
    {
      label: 'Home',
      icon: <HomeIcon />,
      link: '/',
    },
    {
      label: 'Friends List',
      icon: <GroupIcon/>,
      link: '/friends',
    },
    {
      label: 'Leaderboard',
      icon: <LeaderboardIcon/>,
      link: '/leaderboard',
    },
    {
      label: 'Tags',
      icon: <StyleIcon/>,
      link: '/tags',
    },
    {
      label: 'Photo Search',
      icon: <SearchIcon/>,
      link: '/search',
    },
    {
      label: 'You May Also Like',
      icon: <RecommendIcon/>,
      link: '/recommended',
    },
  ]

  return (
    <>
      <Box p={2}>
        <Typography variant="h6">Photoshare</Typography>
      </Box>
      <Divider />
      <List>
        {drawerItems.map((drawerItem) => {
          return (
            <ListItem
              button
              key={drawerItem.label}
              component={RouterLink}
              to={drawerItem.link}
            >
              <ListItemIcon>{drawerItem.icon}</ListItemIcon>
              <ListItemText primary={drawerItem.label} />
            </ListItem>
          );
        })}
      </List>
    </>
  );
}

const Navbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleClick = () => {
    setIsDrawerOpen(!isDrawerOpen);
  }

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="static"
          sx={{
            width: {
              lg: `calc(100% - ${drawerWidth}px)`,
            },
            ml: {
              lg: `${drawerWidth}px`,
            },
          }}
        >
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{
                mr: 1,
                display: {
                  sm: "inline-flex",
                  lg: "none",
                },
              }}
              onClick={handleClick}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              component="div"
              display={{ xs: "inline-flex", lg: "none" }}
            >
              Photoshare
            </Typography>
            <Box display="flex" justifyContent="flex-end" sx={{ flexGrow: 1 }}>
              <Button color="inherit" component={RouterLink} to="/auth/login">
                Login
              </Button>
              <Button color="inherit" component={RouterLink} to="/auth/register">
                Register
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={isDrawerOpen}
        onClose={handleClick}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: {
            xs: "block",
            lg: "none",
          },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
      >
        <DrawerList />
      </Drawer>
      {/* Laptop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", lg: "block" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
        open
      >
        <DrawerList />
      </Drawer>
    </>
  );
}

export default Navbar;