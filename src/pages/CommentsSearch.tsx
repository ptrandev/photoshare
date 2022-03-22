import type { FC, ChangeEvent } from 'react';
import { useState } from 'react';
import {
  Grid,
  Typography,
  Stack,
  TextField,
  Button,
  ListItem,
  ListItemIcon,
  Avatar,
  ListItemText,
  List,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import axios from 'utils/axios';

interface Results {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  matches: number;
}

const CommentsSearch : FC = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [formValue, setFormValue] = useState({
    text: '',
  })

  const [results, setResults] = useState<Results[]>([]);

  const handleChange = (e : ChangeEvent<HTMLInputElement>) => {
    setFormValue({
      ...formValue,
      [e.target.name]: e.target.value
    });
  }

  const handleSubmit = () => {
    if (!formValue.text) {
      return enqueueSnackbar("Fill out all required fields.", {
        variant: "error",
      });
    }

    axios.get(`/comments/search?text=${formValue.text}`).then((res) => {
      setResults(res.data.comments);
    });
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4">Comments Search</Typography>
      </Grid>
      <Grid item xs={12}>
        <form>
          <Stack
            spacing={2}
            direction={{
              xs: "column",
              sm: "row",
            }}
          >
            <TextField
              label="Search Comment"
              variant="outlined"
              name="text"
              fullWidth
              value={formValue.text}
              onChange={handleChange}
              required
            />
            <Button
              variant="contained"
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              Search
            </Button>
          </Stack>
        </form>
      </Grid>
      <List>
        {results.map((result) => (
          <ListItem key={result.user_id}>
            <ListItemIcon>
              <Avatar>{result.first_name[0]} {result.last_name[0]}</Avatar>
            </ListItemIcon>
            <ListItemText
              primary={`${result.first_name} ${result.last_name} (${result.email})`}
              secondary={`Matches: ${result.matches}`}
            />
          </ListItem>
        ))}
      </List>
      {results?.length === 0 && (
        <Grid item xs={12}>
          <Typography variant="body1">
            There are no results or you have not entered a search yet.
          </Typography>
        </Grid>
      )}
    </Grid>
  );
}

export default CommentsSearch;