import type { FC } from 'react';

import { useEffect, useState } from 'react';
import {
  Typography,
  Card,
  CardContent,
} from '@mui/material';
import axios from '../../utils/axios';

const AlbumDeletePhoto : FC = () => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h4">Delete Photo</Typography>
      </CardContent>
    </Card>
  );
}

export default AlbumDeletePhoto;