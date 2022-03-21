import type { ChangeEvent } from 'react';

import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Typography, Box, Link, TextField, Stack, Button } from '@mui/material';
import DatePicker from '@mui/lab/DatePicker';
import axios from '../../utils/axios';
import { useSnackbar } from 'notistack';

import AuthCard from 'components/auth/AuthCard';

interface InterfaceFormValue {
  firstName: string;
  lastName: string;
  email: string;
  dob: Date | null;
  hometown: string;
  gender: string;
  password: string;
  confirmPassword: string;
}

const Register = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [formValue, setFormValue] = useState<InterfaceFormValue>({
    firstName: '',
    lastName: '',
    email: '',
    dob: null,
    hometown: '',
    gender: '',
    password: '',
    confirmPassword: '',
  })

  const handleChange = (e : ChangeEvent<HTMLInputElement>) => {
    setFormValue({
      ...formValue,
      [e.target.name]: e.target.value
    });
  }

  const handleSubmit = () => {
    if (
      !formValue.firstName ||
      !formValue.lastName ||
      !formValue.email ||
      !formValue.dob ||
      !formValue.password ||
      !formValue.confirmPassword
    ) {
      return enqueueSnackbar("Fill out all required fields.", {
        variant: "error",
      });
    }

    if (formValue.password !== formValue.confirmPassword) {
      return enqueueSnackbar("Passwords do not match", {
        variant: "error",
      });
    }

    axios.post('/register', {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      dob: formValue.dob?.toISOString().slice(0, 19).replace('T', ' '),
      hometown: formValue.hometown,
      gender: formValue.gender,
      password: formValue.password,
    }).then(res => {
      enqueueSnackbar(res.data.message, {
        variant: res.data.success ? 'success' : 'error'
      })

      if (res.data.success) {
        navigate('/auth/login');
      }
    }).catch(() => {
      enqueueSnackbar("Registration failed. Try again.", {
        variant: "error",
      });
    })
  }

  useEffect(() => {
    console.log(formValue.dob?.toISOString().slice(0, 19).replace('T', ' '));
  }, [formValue])

  return (
    <AuthCard title="Register">
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
              id="firstName"
              label="First Name"
              name="firstName"
              fullWidth
              required
              value={formValue.firstName}
              onChange={handleChange}
            />
            <TextField
              id="lastName"
              label="Last Name"
              name="lastName"
              fullWidth
              required
              value={formValue.lastName}
              onChange={handleChange}
            />
            <TextField
              id="email"
              label="Email"
              name="email"
              fullWidth
              required
              value={formValue.email}
              onChange={handleChange}
            />
            <DatePicker
              label="Date of Birth"
              inputFormat="MM/dd/yyyy"
              value={formValue.dob}
              onChange={(newValue) => {
                setFormValue({
                  ...formValue,
                  dob: newValue,
                });
              }}
              renderInput={(params) => <TextField {...params} fullWidth required/>}
            />
            <TextField
              id="hometown"
              label="Hometown"
              name="hometown"
              fullWidth
              value={formValue.hometown}
              onChange={handleChange}
            />
            <TextField
              id="gender"
              label="Gender"
              name="gender"
              fullWidth
              value={formValue.gender}
              onChange={handleChange}
            />
            <TextField
              id="password"
              label="Password"
              type="password"
              name="password"
              fullWidth
              required
              value={formValue.password}
              onChange={handleChange}
            />
            <TextField
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              fullWidth
              required
              value={formValue.confirmPassword}
              onChange={handleChange}
            />
            <Button
              type="submit"
              variant="contained"
              onClick={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              Register
            </Button>
          </Stack>
        </form>
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