import type { FC, ChangeEvent } from 'react';
import { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Stack,
  TextField,
  Button,
} from '@mui/material';
import { useSnackbar } from 'notistack';

const CommentsSearch : FC = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [formValue, setFormValue] = useState({
    text: '',
  })

  const [results, setResults] = useState([]);

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

    enqueueSnackbar("Submitted", {
      variant: "success",
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