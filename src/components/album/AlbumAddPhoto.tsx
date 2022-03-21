import type { FC, ChangeEvent } from 'react';
import { useState } from 'react';
import {
  Typography,
  Card,
  CardContent,
  Stack,
  TextField,
  Button,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import axios from '../../utils/axios';

const AlbumAddPhoto : FC = () => {
  const { album_id } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const [formValue, setFormValue] = useState({
    caption: '',
    tags: '',
  });

  const handleChange = (e : ChangeEvent<HTMLInputElement>) => {
    setFormValue({
      ...formValue,
      [e.target.name]: e.target.value
    });
  }

  const handleSubmit = () => {
    const tags = formValue.tags.split(',').map(tag => tag.trim());
    const file = document.querySelector('#file') as HTMLInputElement;

    if (!album_id) return;

    const formData = new FormData();

    formData.append('caption', formValue.caption);
    formData.append('album_id', album_id);
    formData.append('tags', JSON.stringify(tags));

    // @ts-ignore
    formData.append('file', file.files[0]);

    if (
      !formValue.caption ||
      !tags ||
      // @ts-ignore
      file.files.length === 0
    ) {
      enqueueSnackbar("Fill out all required fields.", {
        variant: "error",
      });

      return;
    }

    axios
      .post("/albums/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        enqueueSnackbar(res.data.message, {
          variant: res.data.success ? "success" : "error",
        })

        if (res.data.success) window.location.reload();
      })
      .catch(() => {
        enqueueSnackbar("Something went wrong.", {
          variant: "error",
        })
      });
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" mb={2}>
          Add Photo
        </Typography>
        <form>
          <Stack spacing={2}>
            <TextField
              label="Caption"
              variant="outlined"
              name="caption"
              value={formValue.caption}
              onChange={handleChange}
              required
            />
            <TextField
              label="Tags"
              variant="outlined"
              name="tags"
              value={formValue.tags}
              onChange={handleChange}
              placeholder="Separate tags with commas (ex: baseball, football, basketball)"
              required
            />
            <input id="file" type="file" name="file" accept="image/*" />
            <Button
              type="submit"
              variant="contained"
              onClick={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              Add Photo
            </Button>
          </Stack>
        </form>
      </CardContent>
    </Card>
  );
}

export default AlbumAddPhoto