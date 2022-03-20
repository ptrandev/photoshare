import {
  Grid,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Avatar,
  ListItemIcon,
} from "@mui/material";

import { FriendsList, SearchAddFriend } from "components/friends";

const Friends = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4">Friends List</Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <SearchAddFriend />
      </Grid>
      <Grid item xs={12} md={6}>
        <FriendsList />
      </Grid>
    </Grid>
  );
}

export default Friends;