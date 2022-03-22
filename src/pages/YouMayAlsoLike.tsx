import type { FC } from 'react';
import { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
} from '@mui/material';
import axios from 'utils/axios';
import PhotoPreview from 'components/photo/PhotoPreview';


const YouMayAlsoLike : FC = () => {
  const [photos, setPhotos] = useState<any>([]);

  const fetchRecommendations = () => {
    axios.get('/recommendations/photos').then(res => {
      setPhotos(res.data.photos);
      console.log(res.data.photos);
    })
  }

  useEffect(() => {
    fetchRecommendations();
  }, [])

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4">You May Also Like</Typography>
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
            There are no recommendations. Upload some photos and try again.
          </Typography>
        </Grid>
      )}
    </Grid>
  );
}

export default YouMayAlsoLike;