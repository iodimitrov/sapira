import { useState, useEffect, FormEvent } from 'react';
import Head from 'next/head';
import {
  Container,
  TextField,
  Button,
  Snackbar,
  InputAdornment,
  IconButton,
} from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import Alert from '@material-ui/lab/Alert';
import styles from '~/styles/Login.module.scss';
import { useRouter } from 'next/router';
import Link from 'components/Link';
import { gql } from 'graphql-request';
import Loader from 'components/Loader';
import { useAuth } from '../hooks/useAuth';
import gqlClient from '../client';

const Login = () => {
  const router = useRouter();
  const { user, status } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [revealPassword, setRevealPassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'DONE') {
      router.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, status]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await gqlClient.request(
        gql`
          query ($email: String!, $password: String!) {
            login(input: { email: $email, password: $password }) {
              id
            }
          }
        `,
        { email, password },
      );
      router.push('/dashboard');
    } catch ({ response }: any) {
      if (response.errors[0].message.includes('User not found')) {
        setError('Невалиден имейл');
      } else if (response.errors[0].message.includes('Invalid password')) {
        setError('Невалиден парола');
      }
    }
  };

  if (user) {
    return <Loader />;
  }

  return (
    <>
      <Head>
        <title>Вход &#8226; Sapira</title>
      </Head>
      <Container maxWidth={false} className={styles.content} disableGutters>
        <h1 className={styles.title}>Sapira</h1>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles['input-container']}>
            <span className={styles['sub-title']}>Влезте в своя акаунт</span>
          </div>
          <div className={styles['input-container']}>
            <TextField
              label="Имейл"
              className={styles.textfield}
              variant="outlined"
              type="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Парола"
              className={styles.textfield}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment
                    onClick={() => setRevealPassword(!revealPassword)}
                    position="end"
                  >
                    <IconButton edge="end">
                      {revealPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              type={revealPassword ? 'text' : 'password'}
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className={styles['input-container']}>
            <Button
              className={styles.submit}
              type="submit"
              disableElevation
              color="primary"
              variant="contained"
            >
              Влез
            </Button>
          </div>
          <div className={styles['input-container']}>
            <Link className={styles['text']} href="/">
              Забравена парола?
            </Link>
          </div>
        </form>
        <div className={styles['register']}>
          <span>Нямате институция? </span>
          <Link href="/register-institution">Регистрирайте</Link>
        </div>
        <Snackbar
          open={Boolean(error)}
          autoHideDuration={6000}
          onClose={() => setError('')}
        >
          <Alert
            elevation={6}
            variant="filled"
            onClose={() => setError('')}
            severity="error"
          >
            {error}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
};

export default Login;
