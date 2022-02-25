import {
  Box,
  Typography,
  Button,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const NotFound = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >
      <Typography variant="h4" mb={2}>
        Page Not Found
      </Typography>
      <Button component={RouterLink} variant="contained" to="/">
        Return to Home
      </Button>
    </Box>
  );
}

export default NotFound;