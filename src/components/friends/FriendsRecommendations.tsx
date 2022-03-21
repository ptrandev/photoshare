import type { FC } from 'react';

import { useState, useEffect } from 'react';
import {
  Typography,
  Card,
  CardContent,
} from '@mui/material';
import axios from '../../utils/axios';

interface Recommendation {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
}

const FriendsRecommendations = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>();

  const fetchRecommendations = () => {
    axios.get('/recommendations/friends').then(res => {
      setRecommendations(res.data.recommendations);
      console.log(res)
    })
  }

  useEffect(() => {
    setTimeout(() => fetchRecommendations(), 1000);
  }, [])

  return (
    <Card>
      <CardContent>
        <Typography variant="h5">
          Friends Recommendations
        </Typography>
      </CardContent>
    </Card>
  )
}

export default FriendsRecommendations;