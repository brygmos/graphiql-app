import React, { useState } from 'react';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useDispatch } from 'react-redux';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { setUser } from '../../store/slices/userSlice';
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';

interface User {
  email: string;
  password: string;
}

type Inputs = {
  email: string;
  password: string;
};

export default function SignUpPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const [showEmailUse, setShowEmailUse] = useState(false);
  const [showEmailIncorrect, setShowEmailIncorrect] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const signUp = (user: User) => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, user.email, user.password)
      .then(({ user }) => {
        console.log(user.refreshToken, user.uid, user.email);
        dispatch(
          setUser({
            email: user.email,
            id: user.uid,
            token: user.refreshToken,
          })
        );
        navigate('/editor');
      })
      .catch((error) => {
        console.log(error.message);
        if (error.message == 'Firebase: Error (auth/email-already-in-use).') {
          setShowEmailUse(true);
          setTimeout(() => setShowEmailUse(false), 3000);
        }
        if (error.message == 'Firebase: Error (auth/network-request-failed).') {
          setShowEmailIncorrect(true);
          setTimeout(() => setShowEmailIncorrect(false), 3000);
        }
      });
  };

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const user: User = {
      email: data.email!.toString(),
      password: data.password.toString(),
    };
    signUp(user);
  };

  return (
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
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
          <TextField
            {...register('email', {
              required: true,
              pattern: /(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-zA-Z])[0-9a-zA-Z!@#$%^&*]{8,}/g,
            })}
            margin="normal"
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          {errors.email && (
            <span>
              Email должен состоять из минимум 8 символов, минимум одна буква, одна цифра, один
              специальный символ
            </span>
          )}
          {showEmailUse && (
            <Alert severity="error" style={{ position: 'fixed', top: '20%', width: '26%' }}>
              Такой пользователь уже существует
            </Alert>
          )}
          {showEmailIncorrect && (
            <Alert severity="error" style={{ position: 'fixed', top: '20%', width: '26%' }}>
              Некорректный email
            </Alert>
          )}
          <TextField
            {...register('password', {
              pattern: /(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-zA-Z])[0-9a-zA-Z!@#$%^&*]{8,}/g,
            })}
            margin="normal"
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          {errors.password && (
            <span>
              Пароль должен состоять из минимум 8 символов, минимум одна буква, одна цифра, один
              специальный символ
            </span>
          )}
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Sign Up
          </Button>
          <Grid container justifyContent="center">
            <Grid item>
              <Link href="login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
