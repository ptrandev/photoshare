import type { FC, ChangeEvent } from 'react';

import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemIcon,
  Avatar,
  ListItemText,
} from "@mui/material";
import { useSnackbar } from 'notistack';
import axios from 'axios';

const SearchAddFriend : FC = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [formValue, setFormValue] = useState({
    firstName: '',
    lastName: '',
  })

  const handleChange = (e : ChangeEvent<HTMLInputElement>) => {
    setFormValue({
      ...formValue,
      [e.target.name]: e.target.value
    });
  }

  const handleSubmit = () => {
    if (!formValue.firstName || !formValue.lastName) {
      return enqueueSnackbar("Fill out all required fields to search.", {
        variant: "error",
      });
    }

    axios.get(`/friends/search?firstName=${formValue.firstName}&lastName=${formValue.lastName}`).then(res => {
      console.log(res)
    })
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" mb={2}>
          Search and Add Friends
        </Typography>
        <Box display="flex" mb={2}>
          <TextField
            label="First Name"
            variant="outlined"
            name="firstName"
            value={formValue.firstName}
            onChange={handleChange}
            required
            sx={{
              mr: 2,
              flex: 1,
            }}
          />
          <TextField
            label="Last Name"
            variant="outlined"
            name="lastName"
            value={formValue.lastName}
            onChange={handleChange}
            required
            sx={{
              mr: 2,
              flex: 1,
            }}
          />
          <Button variant="contained" onClick={handleSubmit}>
            Search
          </Button>
        </Box>
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
  );
}

export default SearchAddFriend;