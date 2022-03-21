import type { FC } from 'react';
import { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  Box,
  Link,
  Button,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'utils/axios';

interface Tag {
  tag_id: number;
  tag_name: string;
  num_photos: number;
}

const TagsMostPopular : FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);

  const fetchPopularTags = () => {
    axios.get('/tags/popular').then(res => {
      setTags(res.data.tags);
      console.log(res.data.tags);
    })
  }

  useEffect(() => {
    fetchPopularTags();
  }, [])

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box mb={2}>
          <Typography variant="h4">Most Popular Tags</Typography>
          {tags?.length > 0 && (
            <Typography variant="body1">
              Photos in each tag: {tags[0].num_photos}
            </Typography>
          )}
        </Box>
        <Box display="flex">
          {tags?.map((tag) => (
            <Link component={RouterLink} to={`/tag/${tag.tag_id}`}>
              <Button
                sx={{
                  mr: 2,
                }}
                variant="contained"
              >
                {tag.tag_name}
              </Button>
            </Link>
          ))}
        </Box>
        {tags?.length === 0 && (
          <Typography variant="body1" mb={2}>
            No tags found.
          </Typography>
        )}
      </Grid>
    </Grid>
  );
}

export default TagsMostPopular;