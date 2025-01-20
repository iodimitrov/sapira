import { useEffect, useState } from 'react';
import Head from 'next/head';
import Navbar from 'components/Navbar';
import Drawer from 'components/Drawer';
import {
  Container,
  Button,
  Snackbar,
  Typography,
  Card,
  CardHeader,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
} from '@material-ui/core';
import Link from 'components/Link';
import Alert from '@material-ui/lab/Alert';
import { AddOutlined, MoreHorizOutlined } from '@material-ui/icons';
import { useRouter } from 'next/router';
import Loader from 'components/Loader';
import styles from '~/styles/Classes.module.scss';
import useSWR from 'swr';
import { gql } from 'graphql-request';
import { useAuth } from '../hooks/useAuth';
import { Class } from '@sapira/database';

type ClassCardProps = {
  id?: string;
  startYear?: number;
  endYear?: number;
  number?: number;
  letter?: string;
};

const ClassCard = (props: ClassCardProps) => {
  const [menu, setMenu] = useState<null | HTMLElement>(null);

  return (
    <Card className={styles['card']}>
      <CardHeader
        className={styles['card-header']}
        avatar={<Avatar>{props.letter}</Avatar>}
        action={
          <IconButton onClick={(e) => setMenu(e.currentTarget)}>
            <MoreHorizOutlined />
          </IconButton>
        }
        title={`${props.number}${props.letter}`}
        subheader={`${props.startYear} - ${props.endYear}`}
      />
      <Menu
        anchorEl={menu}
        keepMounted
        open={Boolean(menu)}
        onClose={() => setMenu(null)}
      >
        <MenuItem onClick={() => setMenu(null)}>
          <Link
            color="textPrimary"
            underline="none"
            href={{
              pathname: '/edit-class',
              query: { id: props.id },
            }}
          >
            Редактирай
          </Link>
        </MenuItem>
      </Menu>
    </Card>
  );
};

const Classes = () => {
  const router = useRouter();
  const { user, status } = useAuth();
  const { data } = useSWR([
    gql`
      query {
        getAllClasses {
          id
          endYear
          startYear
          number
          letter
        }
      }
    `,
  ]);

  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'REDIRECT') {
      router.push('/login');
    }
    if (user && user?.role?.toLowerCase() !== 'admin') {
      router.back();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, status]);

  if (!user) {
    return <Loader />;
  }

  return (
    <>
      <Head>
        <title>Класове &#8226; Sapira</title>
      </Head>
      <Drawer />
      <Container className="main-container" maxWidth={false} disableGutters>
        <Navbar title="Класове" />
        <div className={styles.content}>
          <div className={styles['actions-container']}>
            {user.role?.toLowerCase() === 'admin' && (
              <Link
                className={styles['class-add']}
                underline="none"
                href="/add-class"
              >
                <Button
                  disableElevation
                  variant="contained"
                  color="primary"
                  endIcon={<AddOutlined />}
                >
                  Създай клас
                </Button>
              </Link>
            )}
          </div>
          <div className={styles['classes-container']}>
            {data &&
              data.getAllClasses?.map((currClass: Class, i: number) => (
                <ClassCard key={i} {...currClass} />
              ))}
            {data && !data.getAllClasses && (
              <div className={styles['no-classes']}>
                <Typography color="textSecondary">
                  Няма съществуващи класове. За да добавите такива, натиснете
                  бутона &quot;Създай клас&quot;.
                </Typography>
              </div>
            )}
          </div>
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

export default Classes;
