import type { FC } from 'react';

import {
  Typography,
  Grid,
  Button,
  Stack
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import AlbumAddPhoto from 'components/album/AlbumAddPhoto';
import AlbumDeletePhoto from 'components/album/AlbumDeletePhoto';
import axios from '../../utils/axios';

const AlbumEdit : FC = () => {
  const { album_id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const deleteAlbum = () => {
    axios.post(`/albums/delete`, {
      album_id,
    }).then((res) => {
      enqueueSnackbar(res.data.message, {
        variant: res.data.success ? "success" : "error",
      })

      if (res.data.success) navigate('/')
    }).catch(() => {
      enqueueSnackbar("Error deleting album.", {
        variant: "error",
      });
    })
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Stack
          mb={2}
          spacing={2}
          direction={{
            xs: "column",
            sm: "row",
          }}
          alignItems={{
            xs: "flex-start",
            sm: "center",
          }}
        >
          <Typography variant="h4">Album Edit</Typography>
          <Button variant="contained" color="error" onClick={() => deleteAlbum()}>
            Delete Album
          </Button>
        </Stack>
      </Grid>
      <Grid item xs={12} md={6}>
        <AlbumAddPhoto />
      </Grid>
      <Grid item xs={12} md={6}>
        <AlbumDeletePhoto />
      </Grid>
    </Grid>
  );
}

export default AlbumEdit