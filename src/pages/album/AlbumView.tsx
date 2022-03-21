import type { FC } from 'react';
import { useEffect, useState } from 'react';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  Chip,
} from "@mui/material";
import { useParams } from 'react-router-dom';
import axios from '../../utils/axios';

interface Album {
  album_id: number;
  album_name: string;
  user_id: number;
  first_name: string;
  last_name: string;
  images: any;
}

const AlbumView : FC = () => {
  const { album_id } = useParams();

  const [album, setAlbum] = useState<Album>();

  const fetchAlbum = () => {
    axios
      .get(`/albums?album_id=${album_id}`)
      .then((res) => {
        setAlbum(res.data);
        console.log(res.data);
      });
  }

  useEffect(() => {
    fetchAlbum();
  }, [])

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4">{album?.album_name}</Typography>
        <Typography variant="body1">
          By {album?.first_name} {album?.last_name}
        </Typography>
      </Grid>
      {album?.images?.map((image) => (
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <img
                src={image.data.replace("./public", "")}
                alt={image.caption}
                width="100%"
              />
              <Typography variant="body1">{image.caption}</Typography>
              <Stack direction="row" spacing={2} mt={2}>
                {image?.tags?.map((tag) => (
                  <Chip key={tag.tag_name} label={tag.tag_name} />
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default AlbumView;