import type { FC, ChangeEvent } from 'react';

import { useState } from 'react';
import {
  Typography,
  Grid,
  Paper,
  TextField,
  Stack,
  Box,
  Button,
} from "@mui/material";
import { useSnackbar } from 'notistack';
import axios from '../../utils/axios';
import { useNavigate } from 'react-router-dom';


const AlbumCreate : FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [formValue, setFormValue] = useState({
    album_name: '',
  })

  const handleChange = (e : ChangeEvent<HTMLInputElement>) => {
    setFormValue({
      ...formValue,
      [e.target.name]: e.target.value
    });
  }

  const handleSubmit = () => {
    if (!formValue.album_name) {
      enqueueSnackbar("Fill out album name.", {
        variant: "error",
      });
      return;
    }

    axios.post('/albums/create', formValue).then(res => {
      enqueueSnackbar(res.data.message, {
        variant: res.data.success ? "success" : "error",
      });

      if (res.data.success) {
        navigate(`/album/edit/${res.data.album_id}`);
      }
    }).catch(() => {
      enqueueSnackbar("Something went wrong.", {
        variant: "error",
      });
    })
  }
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box display="flex" justifyContent="center">
          <Paper
            sx={{
              width: "100%",
              maxWidth: "320px",
              p: 4,
            }}
          >
            <Typography variant="h4" mb={2}>
              Create Album
            </Typography>
            <form>
              <Stack spacing={2}>
                <TextField
                  label="Album Name"
                  variant="outlined"
                  name="album_name"
                  fullWidth
                  required
                  value={formValue.album_name}
                  onChange={handleChange}
                />
                <Button
                  type="submit"
                  variant="contained"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }}
                >
                  Create
                </Button>
              </Stack>
            </form>
          </Paper>
        </Box>
      </Grid>
    </Grid>
  );
}

export default AlbumCreate;