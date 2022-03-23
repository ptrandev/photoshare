import type { ChangeEvent } from 'react';

import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Typography, Box, Link, Stack, TextField, Button } from '@mui/material';
import { useSnackbar } from 'notistack';
import useToken from '../../hooks/useToken';

import AuthCard from 'components/auth/AuthCard';
import axios from '../../utils/axios';

const Login = () => {
  const { setToken } = useToken();

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [formValue, setFormValue] = useState({
    email: '',
    password: '',
  })

  const handleChange = (e : ChangeEvent<HTMLInputElement>) => {
    setFormValue({
      ...formValue,
      [e.target.name]: e.target.value
    });
  }

  const handleSubmit = () => {
    if (!formValue.email || !formValue.password) {
      return enqueueSnackbar("Fill out all required fields.", {
        variant: "error",
      });
    }

    axios.post('/token', formValue).then(res => {
      setToken(res.data.access_token);
      navigate('/');
    }).catch(() => {
      enqueueSnackbar("Invalid email or password", {
        variant: "error",
      });
    })
  }

  return (
    <AuthCard title="Log In">
      <Box
        component="form"
        noValidate
        autoComplete="off"
        display="flex"
        flexDirection="column"
      >
        <form>
          <Stack spacing={2}>
            <TextField
              name="email"
              id="email"
              label="Email"
              fullWidth
              value={formValue.email}
              onChange={handleChange}
              required
            />
            <TextField
              id="password"
              label="Password"
              type="password"
              name="password"
              fullWidth
              value={formValue.password}
              onChange={handleChange}
              required
            />
            <Button
              type="submit"
              variant="contained"
              onClick={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              Login
            </Button>
          </Stack>
        </form>
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