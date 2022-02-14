import { Link as RouterLink } from 'react-router-dom';
import { Typography, Box, Link, Stack, TextField, Button } from '@mui/material';

import AuthCard from 'components/auth/AuthCard';

const Login = () => {
  return (
    <AuthCard title="Log In">
      <Box
        component="form"
        noValidate
        autoComplete="off"
        display="flex"
        flexDirection="column"
      >
        <Stack spacing={2}>
          <TextField id="email" label="Email" fullWidth />
          <TextField id="password" label="Password" type="password" fullWidth />
          <Button type="submit" variant="contained">Register</Button>
        </Stack>
      </Box>
      <Box display="flex" mt={2}>
        <Typography mr={1}>No Account?</Typography>
        <Typography>
          <Link component={RouterLink} to="/auth/register">
            Register
          </Link>
        </Typography>
      </Box>
    </AuthCard>
  );
}

export default Login;