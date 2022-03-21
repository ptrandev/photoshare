import type { FC, ChangeEvent } from 'react';
import { useEffect, useState } from 'react';
import {
  Typography,
  Stack,
  Chip,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Divider,
} from "@mui/material";
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import axios from '../utils/axios';

const Photo : FC = (props) => {
  const { photo_id } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const [photo, setPhoto] = useState<any>();
  const [formValue, setFormValue] = useState({
    text: '',
  })

  const fetchPhoto = () => {
    axios.get(`/imgs?photo_id=${photo_id}`).then((res) => {
      setPhoto(res.data);
      console.log(res.data);
    })
  }

  const likeImage = () => {
    axios.post(`/imgs/like`, {
      photo_id,
    }).then((res) => {
      enqueueSnackbar(res.data.message, {
        variant: res.data.success ? "success" : "error",
      })

      if (res.data.success) window.location.reload()
    }).catch(() => {
      enqueueSnackbar("Error liking image.", {
        variant: "error",
      });
    })
  }

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

    axios.post('imgs/comment', {
      photo_id,
      text: formValue.text,
    }).then((res) => {
      enqueueSnackbar(res.data.message, {
        variant: res.data.success ? "success" : "error",
      })

      if (res.data.success) window.location.reload()
    }).catch(() => {
      enqueueSnackbar("Error adding comment.", {
        variant: "error",
      });
    })
  }

  useEffect(() => {
    fetchPhoto()
  }, [])

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Stack spacing={2}>
          <Card>
            <CardContent>
              <img
                src={photo?.data.replace("./public", "")}
                alt={photo?.caption}
                width="100%"
              />
              <Typography variant="body2" mb={2}>
                {photo?.caption}
              </Typography>
              <Stack direction="row" spacing={2}>
                {photo?.tags?.map((tag) => (
                  <Chip key={tag.tag_name} label={tag.tag_name} />
                ))}
              </Stack>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography variant="h5" mb={2}>
                Likes
              </Typography>
              <Typography variant="body1">
                Number of likes: {photo?.num_likes}
              </Typography>
              <Box my={2}>
                <Button variant="contained" onClick={() => likeImage()}>
                  Like
                </Button>
              </Box>
              <Typography variant="h6" mb={2}>Liked By: </Typography>
              {photo?.likes?.map((like) => (
                <Box key={like.user_id} mb={2}>
                  <Typography variant="body1" mb={2}>
                    {like.first_name} {like.last_name}
                  </Typography>
                  <Divider />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Stack>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h4" mb={2}>
              Comments
            </Typography>
            <form>
              <Stack direction="row" spacing={2} mb={2}>
                <TextField
                  label="Comment"
                  name="text"
                  variant="outlined"
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
                  Submit
                </Button>
              </Stack>
            </form>
            <Stack spacing={2}>
              {photo?.comments?.map((comment) => (
                <Box>
                  <Typography variant="body1">{comment.text}</Typography>
                  <Typography variant="body2" mb={2}>
                    By {comment.first_name} {comment.last_name}
                  </Typography>
                  <Divider />
                </Box>
              ))}
            </Stack>
            {photo?.comments.length === 0 && (
              <Typography variant="body1">No comments yet</Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default Photo