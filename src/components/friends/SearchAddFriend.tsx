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
  IconButton,
} from "@mui/material";
import { useSnackbar } from 'notistack';
import axios from '../../utils/axios';
import AddCircleIcon from '@mui/icons-material/AddCircle';

interface SearchResults {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
}

const SearchAddFriend : FC = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [formValue, setFormValue] = useState({
    firstName: '',
    lastName: '',
  })

  const [searchResults, setSearchResults] = useState<SearchResults[]>([]);

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
      setSearchResults(res.data);
    })
  }

  const handleAddFriend = (userId : number) => {
    axios.post(`/friends/add`, {
      friend_id: userId,
    }).then(res => {
      enqueueSnackbar(res.data.message, {
        variant: res.data.success ? "success" : "error",
      });

      if (res.data.success) window.location.reload()
    }).catch(() => {
      enqueueSnackbar("An error occurred", {
        variant: "error",
      });
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
          {searchResults?.map((result) => (
            <ListItem
              key={`${result.user_id}-${result.first_name}`}
              secondaryAction={
                <IconButton
                  onClick={() => {
                    handleAddFriend(result.user_id);
                  }}
                >
                  <AddCircleIcon />
                </IconButton>
              }
            >
              <ListItemIcon>
                <Avatar>
                  {result.first_name[0]} {result.last_name[0]}
                </Avatar>
              </ListItemIcon>
              <ListItemText
                primary={`${result.first_name} ${result.last_name} (${result.email})`}
              />
            </ListItem>
          ))}
        </List>
        {searchResults.length === 0 && (
          <Typography variant="body1">
            No results. Try entering a new search term.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

export default SearchAddFriend;