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

import { SearchAddFriend } from "components/friends";

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
        <Card>
          <CardContent>
            <Typography variant="h5">Your Friends List</Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <Avatar>H</Avatar>
                </ListItemIcon>
                <ListItemText primary="John Doe" />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default Friends;