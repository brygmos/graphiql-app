import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/slices/userSlice';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useForm, SubmitHandler } from 'react-hook-form';

interface User {
  email: string;
  password: string;
}

type Inputs = {
  email: string;
  password: string;
};

export default function SignInPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const [showEmailAlert, setShowEmailAlert] = useState(false);
  const [showUserAlert, setShowUserAlert] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const signIn = (user: User) => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, user.email, user.password)
      .then(({ user }) => {
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
        if (error.message == 'Firebase: Error (auth/user-not-found).') {
          setShowEmailAlert(true);
          setTimeout(() => setShowEmailAlert(false), 3000);
        } else if (error.message == 'Firebase: Error (auth/wrong-password).') {
          setShowUserAlert(true);
          setTimeout(() => setShowUserAlert(false), 3000);
        }
      });
  };

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const user: User = {
      email: data.email!.toString(),
      password: data.password.toString(),
    };
    signIn(user);
  };

  return (
    <Container component="main" maxWidth="xs" sx={{minHeight: '80vh', marginTop: '90px'}}>
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
          {t('auth.in')}
        </Typography>
        <Box
          component="form"
          position={'relative'}
          onSubmit={handleSubmit(onSubmit)}
          sx={{ mt: 1 }}
        >
          <TextField
            {...register('email', {
              required: true,
              pattern: /(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-zA-Z])[0-9a-zA-Z!@#$%^&*]{8,}/g,
            })}
            margin="normal"
            fullWidth
            id="email"
            label={t('auth.mail')}
            name="email"
            autoComplete="email"
            autoFocus
          />
          {errors.email && (
            <span>
              {t('auth.errMail')}
            </span>
          )}
          {showEmailAlert && (
            <Alert severity="error" style={{ position: 'fixed', top: '20%', width: '26%' }}>
              {t('auth.notUser')}
            </Alert>
          )}
          {showUserAlert && (
            <Alert severity="error" style={{ position: 'fixed', top: '20%', width: '26%' }}>
              {t('auth.badPass')}
            </Alert>
          )}
          <TextField
            {...register('password', {
              required: true,
              pattern: /(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-zA-Z])[0-9a-zA-Z!@#$%^&*]{8,}/g,
            })}
            margin="normal"
            fullWidth
            name="password"
            label={t('auth.password')}
            type="password"
            id="password"
            autoComplete="current-password"
          />
          {errors.password && (
            <span>
              {t('auth.errPass')}
            </span>
          )}
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            {t('auth.in')}
          </Button>
          <Grid container justifyContent="center">
            <Grid item>
              <Link href="registration" variant="body2">
                {t('auth.acc2')}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
