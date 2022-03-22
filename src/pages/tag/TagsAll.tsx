import type { FC } from 'react';
import { useEffect, useState } from 'react';
import {
  Grid,
  Typography,
  Box,
  Link,
  Button,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import axios from '../../utils/axios';

interface Tag {
  tag_id: number;
  tag_name: string;
}

const TagsAll : FC = () => {
  const [tags, setTags] = useState<Tag[]>();

  const fetchTags = () => {
    axios.get('/tags/all').then(res => {
      setTags(res.data.tags);
    })
  }

  useEffect(() => {
    fetchTags()
  }, [])

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="h4" mb={2}>
          All Tags
        </Typography>
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
          {tags?.length === 0 && (
            <Typography variant="body1">No tags found.</Typography>
          )}
        </Box>
      </Grid>
    </Grid>
  );
}

export default TagsAll;