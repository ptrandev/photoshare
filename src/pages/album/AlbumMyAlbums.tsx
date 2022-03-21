import type { FC } from "react";

import { useEffect, useState } from "react";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Stack,
  Link,
} from "@mui/material";
import axios from '../../utils/axios';
import { Link as RouterLink } from "react-router-dom";

interface Album {
  album_id: number;
  album_name: string;
  images: any;
  user_id: number;
}

const AlbumMyAlbums : FC = () => {
  const [albums, setAlbums] = useState<Album[]>([]);

  const fetchAlbums = () => {
    axios.get('/albums/user').then(res => {
      setAlbums(res.data.albums);
      console.log(res.data.albums);
    })
  }

  useEffect(() => {
    fetchAlbums()
  }, [])

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4" mb={2}>
          My Albums
        </Typography>
      </Grid>
      <Grid container item xs={12} spacing={2}>
        {albums?.map((album) => (
          <Grid item xs={12} md={6} lg={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" mb={2}>
                  {album.album_name}
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Link
                    component={RouterLink}
                    to={`/album/edit/${album.album_id}`}
                  >
                    <Button variant="contained">Edit/Delete</Button>
                  </Link>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
        {
          albums.length === 0 && (
            <Grid item xs={12}>
              <Typography variant="h5" mb={2}>
                You have no albums.
              </Typography>
            </Grid>
          )
        }
      </Grid>
    </Grid>
  );
};

export default AlbumMyAlbums;