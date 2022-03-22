import type { FC } from 'react';

import { useState, useEffect } from 'react';
import {
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  IconButton,
  ListItemIcon,
  Avatar,
  ListItemText,
} from '@mui/material';
import axios from '../../utils/axios';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useSnackbar } from 'notistack';

interface Recommendation {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
}

const FriendsRecommendations : FC = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  const handleAddFriend = (userId : number) => {
    axios.post(`/friends/add`, {
      friend_id: userId,
    }).then(res => {
      enqueueSnackbar(res.data.message, {
        variant: res.data.success ? "success" : "error",
      });

      if (res.data.success) window.location.reload()
    }).catch(() => {
      enqueueSnackbar("An error occurred", {
        variant: "error",
      });
    })
  }

  const fetchRecommendations = () => {
    axios.get('/recommendations/friends').then(res => {
      setRecommendations(res.data);
    })
  }

  useEffect(() => {
    setTimeout(() => fetchRecommendations(), 500);
  }, [])

  return (
    <Card>
      <CardContent>
        <Typography variant="h5">Friends Recommendations</Typography>
        <List>
          {recommendations?.map((result) => (
            <ListItem
              key={`${result.user_id}-${result.first_name}`}
              secondaryAction={
                <IconButton
                  onClick={() => {
                    handleAddFriend(result.user_id);
                  }}
                >
                  <AddCircleIcon />
                </IconButton>
              }
            >
              <ListItemIcon>
                <Avatar>
                  {result.first_name[0]}{result.last_name[0]}
                </Avatar>
              </ListItemIcon>
              <ListItemText
                primary={`${result.first_name} ${result.last_name} (${result.email})`}
              />
            </ListItem>
          ))}
        </List>
        {recommendations?.length === 0 && (
          <Typography variant="body1">
            No friend recommendations
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

export default FriendsRecommendations;