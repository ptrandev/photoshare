import type { FC } from 'react';
import { useEffect, useState } from 'react';
import axios from '../../utils/axios';
import {
  Typography,
  CardContent,
  Card,
  List,
  ListItem,
  ListItemIcon,
  Avatar,
  ListItemText,
  IconButton,
} from "@mui/material";
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { useSnackbar } from 'notistack';

interface Friend {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
}

const FriendsList : FC = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [friends, setFriends] = useState<Friend[]>([]);

  const fetchFriends = () => {
    axios
    .get("/friends/list")
    .then((res) => {
      setFriends(res.data);
    });
  }

  const handleRemoveFriend = (userId) => {
    axios.post(`/friends/remove`, {
      friend_id: userId,
    }).then(res => {
      enqueueSnackbar(res.data.message, {
        variant: "success",
      })

      window.location.reload()
    }).catch(err => {
      enqueueSnackbar(err.response.data.message, {
        variant: "error",
      })
    })
  }

  useEffect(() => {
    fetchFriends()
  }, [])

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" mb={2}>
          Friends List
        </Typography>
        <List>
          {friends?.map((friend) => (
            <ListItem
              key={`${friend.user_id}-${friend.first_name}`}
              secondaryAction={
                <IconButton
                  onClick={() => {
                    handleRemoveFriend(friend.user_id);
                  }}
                >
                  <RemoveCircleIcon />
                </IconButton>
              }
            >
              <ListItemIcon>
                <Avatar>
                  {friend.first_name[0]} {friend.last_name[0]}
                </Avatar>
              </ListItemIcon>
              <ListItemText
                primary={`${friend.first_name} ${friend.last_name} (${friend.email})`}
              />
            </ListItem>
          ))}
        </List>
        {friends.length === 0 && (
          <Typography variant="body1">No friends yet.</Typography>
        )}
      </CardContent>
    </Card>
  );
}

export default FriendsList;