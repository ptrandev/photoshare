import type { FC } from 'react';

import { useEffect, useState } from 'react';
import {
  Grid,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
  Button,
  Box,
  Link,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import axios from '../utils/axios';

interface Album {
  album_id: number;
  album_name: string;
  user_id: number;
  first_name: string;
  last_name: string;
  images: any;
}

const Home : FC = () => {
  const [albums, setAlbums] = useState<Album[]>();

  const fetchAllAlbums = () => {
    axios.get('/albums/all').then(res => {
      setAlbums(res.data.albums);
      console.log(res.data.albums);
    })
  }

  useEffect(() => {
    fetchAllAlbums()
  }, [])

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4" mb={2}>
          Home
        </Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <Typography variant="h5" mb={2}>
          All Albums
        </Typography>
        <Stack spacing={2}>
          {albums?.map((album) => (
            <Card>
              <CardContent>
                <Box mb={2}>
                  <Typography variant="h5">{album.album_name}</Typography>
                  <Typography variant="body2" mb={2}>
                    By {album.first_name} {album.last_name}
                  </Typography>
                </Box>
                <Link
                  component={RouterLink}
                  to={`/album/${album.album_id}`}
                >
                  <Button variant="contained">View</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Grid>
      <Grid item xs={12} md={6}>
        <Typography variant="h5" mb={2}>
          All Photos
        </Typography>
        <Stack spacing={3}>
          {albums?.map((album) =>
            album?.images?.map((image) => {
              return (
                <Card>
                  <CardContent>
                    <img
                      src={image.data.replace("./public", "")}
                      alt={image.caption}
                      width="100%"
                    />
                    <Typography variant="body1" mt={2}>
                      {image.caption}
                    </Typography>
                    <Typography variant="body2">
                      By {album.first_name} {album.last_name}
                    </Typography>
                    <Stack direction="row" spacing={2} my={2}>
                      {image?.tags?.map((tag) => (
                        <Chip key={tag.tag_name} label={tag.tag_name} />
                      ))}
                    </Stack>
                    <Link
                      component={RouterLink}
                      to={`/photo/${image.photo_id}`}
                    >
                      <Button variant="contained">View</Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })
          )}
        </Stack>
      </Grid>
    </Grid>
  );
}

export default Home;