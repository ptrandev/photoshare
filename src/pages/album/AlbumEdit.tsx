import type { FC } from 'react';

import {
  Typography,
  Grid,
} from '@mui/material';
import AlbumAddPhoto from 'components/album/AlbumAddPhoto';
import AlbumDeletePhoto from 'components/album/AlbumDeletePhoto';

const AlbumEdit : FC = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4" mb={2}>
          Album Edit
        </Typography>
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