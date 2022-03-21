import type { FC } from 'react';

import { useEffect, useState } from 'react';
import {
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
  Button,
  Divider,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import axios from '../../utils/axios';

interface Photos {
  data: string;
  photo_id: number;
  caption: string;
  comments: any;
  num_comments: number;
  tags: any;
}

const AlbumDeletePhoto : FC = () => {
  const { album_id } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const [photos, setPhotos] = useState<Photos[]>();

  const fetchPhotos = () => {
    axios
      .get(`/albums?album_id=${album_id}`)
      .then((res) => {
        setPhotos(res.data.images);
        console.log(res.data.images);
      });
  }

  const deletePhoto = (photo_id) => {
    axios.post(`/albums/photo/delete`, {
      photo_id,
    }).then((res) => {
      enqueueSnackbar(res.data.message, {
        variant: res.data.success ? "success" : "error",
      })

      if (res.data.success) window.location.reload()
    }).catch(() => {
      enqueueSnackbar("Error deleting photo.", {
        variant: "error",
      });
    })
  }

  useEffect(() => {
    fetchPhotos();
  }, [])

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" mb={2}>
          Delete Photo
        </Typography>
        <Stack spacing={2}>
          {photos?.map((photo) => (
            <>
              <img
                src={photo.data.replace("./public", "")}
                alt={photo.caption}
              />
              <Typography variant="body2">{photo.caption}</Typography>
              <Stack direction="row" spacing={2}>
                {photo?.tags?.map((tag) => (
                  <Chip key={tag.tag_name} label={tag.tag_name} />
                ))}
              </Stack>
              <Button variant="contained" color="error" onClick={() => deletePhoto(photo.photo_id)}>
                Delete
              </Button>
              <Divider />
            </>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}

export default AlbumDeletePhoto;