import type { FC, ChangeEvent } from 'react';
import { useState } from 'react';
import {
  Grid,
  Typography,
  Stack,
  TextField,
  Button,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import axios from 'utils/axios';
import PhotoPreview from 'components/photo/PhotoPreview';


const PhotosSearch : FC = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [formValue, setFormValue] = useState({
    text: '',
  })

  const [photos, setPhotos] = useState<any>([]);

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

    axios.get(`/tags/search?tags=${formValue.text}`).then((res) => {
      setPhotos(res.data.photos);
    });
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4">Photos Search</Typography>
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
              label="Search Photos by Tags"
              placeholder="Separate tags with a space (ex: baseball football)"
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
      {
        photos?.map((photo) => {
          const album = {
            first_name: photo.first_name,
            last_name: photo.last_name,
          }

          return (
            <Grid item xs={12} md={6}>
              <PhotoPreview image={photo} album={album} />
            </Grid>
          );
      })
      }
      {photos?.length === 0 && (
        <Grid item xs={12}>
          <Typography variant="body1">
            There are no results or you have not entered a search yet.
          </Typography>
        </Grid>
      )}
    </Grid>
  );
}

export default PhotosSearch;