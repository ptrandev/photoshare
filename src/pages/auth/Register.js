import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Typography, Box, Link, TextField, Stack, Button } from '@mui/material';
import DatePicker from '@mui/lab/DatePicker';

import AuthCard from 'components/auth/AuthCard';

const Register = () => {
  const [value, setValue] = useState();

  return (
    <AuthCard title="Register">
      <Box
        component="form"
        noValidate
        autoComplete="off"
        display="flex"
        flexDirection="column"
      >
        <Stack spacing={2}>
          <TextField id="firstName" label="First Name" fullWidth />
          <TextField id="lastName" label="Last Name" fullWidth />
          <TextField id="email" label="Email Name" fullWidth />
          <DatePicker
            id="dob"
            label="Date of Birth"
            fullWidth
            inputFormat="MM/dd/yyyy"
            value={value}
            onChange={(newValue) => {
              setValue(newValue);
            }}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
          <TextField id="password" label="Password" type="password" fullWidth />
          <TextField
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            fullWidth
          />
          <Button type="submit" variant="contained">Register</Button>
        </Stack>
      </Box>
      <Box display="flex" mt={2}>
        <Typography mr={1}>Have an Account?</Typography>
        <Typography>
          <Link component={RouterLink} to="/auth/login">
            Login
          </Link>
        </Typography>
      </Box>
    </AuthCard>
  );
}

export default Register;