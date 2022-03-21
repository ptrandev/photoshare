import type { FC } from 'react';
import { useState, useEffect } from 'react';
import {
  Typography,
  Grid,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from '../../utils/axios';
import PhotoPreview from 'components/photo/PhotoPreview';

interface Photos {
  data: string;
  photo_id: number;
  caption: string;
  album_id: number;
  first_name: string;
  last_name: string;
}

interface Tag {
  tag_id: number;
  tag_name: string;
}

const TagMyPhotos : FC = () => {
  const { tag_id } = useParams();
  const [photos, setPhotos] = useState<Photos[]>([]);
  const [tag, setTag] = useState<Tag>();

  const fetchTagName = () => {
    axios
      .get(`/tag/name?tag_id=${tag_id}`)
      .then((res) => {
        setTag(res.data.tag);
      });
  }

  const fetchPhotos = () => {
    axios.get(`/tag/user/photos?tag_id=${tag_id}`).then(res => {
      setPhotos(res.data.photos);
    })
  }

  useEffect(() => {
    fetchTagName();
    setTimeout(() => fetchPhotos(), 500);
  }, [])

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="h4" mb={2}>
          Tag: {tag?.tag_name}
        </Typography>
      </Grid>
      <Grid container item xs={12}>
        {photos?.map((image) => {
          const album = {
            album_id: image.album_id,
            first_name: image.first_name,
            last_name: image.last_name,
          };

          return (
            <Grid item xs={12} md={6}>
              <PhotoPreview image={image} album={album} />
            </Grid>
          );
        })}
        {photos?.length === 0 && (
          <Typography variant="body1">No images in this tag</Typography>
        )}
      </Grid>
    </Grid>
  );
}

export default TagMyPhotos;