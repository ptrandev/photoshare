import {
  Grid,
  Typography,
  Stack
} from "@mui/material";

import { FriendsList, FriendsRecommendations, SearchAddFriend } from "components/friends";

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
        <Stack spacing={2}>
          <FriendsList />
          <FriendsRecommendations />
        </Stack>
      </Grid>
    </Grid>
  );
}

export default Friends;