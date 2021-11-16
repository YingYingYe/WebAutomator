import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import PropTypes from 'prop-types';
import * as ApiAuth from "../../api/auth";

const FormElementProps = {
  fullWidth: true,
  variant: "standard",
  size: "medium",
  className: "mb-4"
}

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="http://172.104.60.204:5000/">
        CRIDB Automator
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();


export default function Login({ setToken }) {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const [validForm, setValidForm] = useState(true);

  const handleSubmit = async e => {
    e.preventDefault();
    setValidForm(true);
    const {data} = await ApiAuth.loginUser({username, password});
    if(data.result === "success"){
      setToken(data);
    }else{
      setValidForm(false);
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          { !validForm 
            ? 
            <Alert severity="error">
              Username or Password is incorrect. Please try again!
            </Alert>
            :
            <></>
          }
          <br></br>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
          CRIDB Automator
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              {...FormElementProps}
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              onChange={e => setUserName(e.target.value)}
              autoFocus
            />
            <TextField
              {...FormElementProps}
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={e => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired
};