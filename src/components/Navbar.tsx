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
import axios from '../utils/axios';
import useToken from '../hooks/useToken';

import MenuIcon from '@mui/icons-material/Menu';
import GroupIcon from '@mui/icons-material/Group';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import StyleIcon from '@mui/icons-material/Style';
import SearchIcon from '@mui/icons-material/Search';
import RecommendIcon from '@mui/icons-material/Recommend';
import HomeIcon from '@mui/icons-material/Home';
import UploadIcon from '@mui/icons-material/Upload';
import PhotoAlbumIcon from '@mui/icons-material/PhotoAlbum';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

const drawerWidth = 240;

const DrawerList = () => {
  const { token } = useToken();

  const drawerItems = [
    {
      label: 'Home',
      icon: <HomeIcon />,
      link: '/',
      loginRequired: false,
    },
    {
      label: 'Create Album',
      icon: <UploadIcon />,
      link: '/album/create',
      loginRequired: true,
    },
    {
      label: 'My Albums',
      icon: <PhotoAlbumIcon />,
      link: '/albums/my',
      loginRequired: true,
    },
    {
      label: 'My Tags',
      icon: <LocalOfferIcon />,
      link: '/tags/my',
      loginRequired: true,
    },
    {
      label: 'Friends',
      icon: <GroupIcon/>,
      link: '/friends',
      loginRequired: true,
    },
    {
      label: 'Leaderboard',
      icon: <LeaderboardIcon/>,
      link: '/leaderboard',
      loginRequired: false,
    },
    {
      label: 'All Tags',
      icon: <StyleIcon/>,
      link: '/tags',
      loginRequired: false,
    },
    {
      label: 'Most Popular Tags',
      icon: <StyleIcon />,
      link: '/tags/popular',
      loginRequired: false,
    },
    {
      label: 'Photos Search',
      icon: <SearchIcon/>,
      link: '/photos/search',
      loginRequired: false,
    },
    {
      label: 'Comments Search',
      icon: <SearchIcon/>,
      link: 'comments/search',
      loginRequired: false,
    },
    {
      label: 'You May Also Like',
      icon: <RecommendIcon/>,
      link: '/recommended',
      loginRequired: true,
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
          if (!token && drawerItem.loginRequired) {
            return null;
          }

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
  const { token, removeToken } = useToken();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleClick = () => {
    setIsDrawerOpen(!isDrawerOpen);
  }

  const handleLogout = () => {
    axios.post('/logout').then(() => {
      removeToken();
      window.location.href = '/';
    });
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
                display: {
                  sm: "inline-flex",
                  lg: "none",
                },
              }}
              onClick={handleClick}
            >
              <MenuIcon />
            </IconButton>
            <Button color="inherit" component={RouterLink} to="/" sx={{
              display: {
                xs: 'inline-block',
                md: 'none',
              }
            }}>
              Photoshare
            </Button>
            <Box display="flex" justifyContent="flex-end" sx={{ flexGrow: 1 }}>
              {
                token ? (
                  <Button color="inherit" onClick={handleLogout}>
                    Logout
                  </Button>
                ) : (
                  <>
                    <Button color="inherit" component={RouterLink} to="/auth/login">
                      Login
                    </Button>
                    <Button color="inherit" component={RouterLink} to="/auth/register">
                      Register
                    </Button>
                  </>
                )
              }
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