import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { Typography, Grid, Box, Link, Button } from "@mui/material";
import { Link as RouterLink } from 'react-router-dom';
import axios from '../../utils/axios';

interface Tag {
  tag_id: number;
  tag_name: string;
}

const TagsMyTags : FC = () => {
  const [tags, setTags] = useState<Tag[]>();

  const fetchTags = () => {
    axios.get('/tags/user').then(res => {
      setTags(res.data.tags);
    }
  )}

  useEffect(() => {
    fetchTags()
  }, [])

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="h4" mb={2}>
          My Tags
        </Typography>
        <Box display="flex">
          {tags?.map((tag) => (
            <Link component={RouterLink} to={`/tag/my/${tag.tag_id}`}>
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

export default TagsMyTags;