import { useEffect, useState } from 'react';
import Head from 'next/head';
import Navbar from 'components/Navbar';
import Drawer from 'components/Drawer';
import {
  Container,
  Button,
  IconButton,
  Card,
  CardHeader,
  Avatar,
  Typography,
  Menu,
  MenuItem,
} from '@material-ui/core';
import { AddOutlined, MoreHorizOutlined } from '@material-ui/icons';
import { useRouter } from 'next/router';
import Loader from 'components/Loader';
import styles from '~/styles/Subjects.module.scss';
import Link from 'components/Link';
import useSWR from 'swr';
import { gql } from 'graphql-request';
import { useAuth } from '../hooks/useAuth';
import type { Class, Subject, UserRole } from '@sapira/database';

type SubjectCardProps = {
  id?: string;
  name?: string;
  description?: string;
  startYear?: number;
  endYear?: number;
  class?: Class;
  role?: UserRole;
};

const SubjectCard = (props: SubjectCardProps) => {
  const [menu, setMenu] = useState<null | HTMLElement>(null);

  return (
    <Card className={styles['card']}>
      <CardHeader
        className={styles['card-header']}
        avatar={<Avatar>{props.name?.charAt(0)}</Avatar>}
        action={
          <IconButton onClick={(e) => setMenu(e.currentTarget)}>
            <MoreHorizOutlined />
          </IconButton>
        }
        title={`${props.class?.number}${props.class?.letter} ${props.name}`}
        subheader={`${props.startYear} - ${props.endYear}`}
      />
      {props.role?.toLowerCase() === 'admin' && (
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
                pathname: '/edit-subject',
                query: { id: props.id },
              }}
            >
              Редактирай
            </Link>
          </MenuItem>
        </Menu>
      )}
    </Card>
  );
};

const Subjects = () => {
  const router = useRouter();
  const { user, status } = useAuth();
  const { data } = useSWR([
    gql`
      query {
        getAllSubjects {
          id
          name
          description
          startYear
          endYear
          class {
            number
            letter
          }
        }
      }
    `,
  ]);

  useEffect(() => {
    if (status === 'REDIRECT') {
      router.push('/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, status]);

  if (!user) {
    return <Loader />;
  }

  return (
    <>
      <Head>
        <title>Предмети &#8226; Sapira</title>
      </Head>
      <Drawer />
      <Container className="main-container" maxWidth={false} disableGutters>
        <Navbar title="Предмети" />
        <div className={styles.content}>
          <div className={styles['actions-container']}>
            {user.role?.toLowerCase() === 'admin' && (
              <Link
                className={styles['subject-add']}
                underline="none"
                href="/add-subject"
              >
                <Button
                  disableElevation
                  variant="contained"
                  color="primary"
                  endIcon={<AddOutlined />}
                >
                  Добави предмет
                </Button>
              </Link>
            )}
          </div>
          <div className={styles['subjects-container']}>
            {data &&
              data.getAllSubjects?.map((subject: Subject, i: number) => (
                <SubjectCard key={i} role={user.role} {...subject} />
              ))}
            {data && !data.getAllSubjects && (
              <div className={styles['no-subjects']}>
                <Typography color="textSecondary">
                  Няма съществуващи предмети. За да добавите такива, натиснете
                  бутона &quot;Добави предмет&quot;.
                </Typography>
              </div>
            )}
          </div>
        </div>
      </Container>
    </>
  );
};

export default Subjects;
