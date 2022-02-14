import {
  Box,
  Grid,
  Table,
  Button,
  Typography,
} from "@mui/material";

const Friends = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4">Friends List</Typography>
      </Grid>
      <Grid item xs={12} md={12}>
        Hello
      </Grid>
    </Grid>
  )
}

export default Friends;