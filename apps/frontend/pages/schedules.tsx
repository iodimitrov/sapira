import { useEffect, useState, ReactNode } from 'react';
import Head from 'next/head';
import Navbar from 'components/Navbar';
import Drawer from 'components/Drawer';
import {
  Container,
  Button,
  Snackbar,
  Card,
  CardHeader,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  AppBar,
  Tabs,
  Tab,
} from '@material-ui/core';
import Link from 'components/Link';
import Alert from '@material-ui/lab/Alert';
import { AddOutlined, MoreHorizOutlined } from '@material-ui/icons';
import { useRouter } from 'next/router';
import Loader from 'components/Loader';
import styles from 'styles/Schedules.module.scss';
import useSWR from 'swr';
import { gql } from 'graphql-request';
import { useAuth } from '../hooks/useAuth';
import { Class, Student } from '@sapira/database';

type TabPanelProps = {
  children?: ReactNode;
  index: number;
  value: number;
};

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div hidden={value !== index} {...other}>
      {value === index && (
        <div>
          <Typography>{children}</Typography>
        </div>
      )}
    </div>
  );
};

type ScheduleCardProps = {
  id?: string;
  teacherSchedule: boolean;
  title?: string;
  startYear?: number;
  endYear?: number;
  number?: number;
  letter?: string;
  role?: string;
};

const ScheduleCard = (props: ScheduleCardProps) => {
  const [menu, setMenu] = useState<null | HTMLElement>(null);

  return (
    <Card className={styles['card']}>
      <CardHeader
        className={styles['card-header']}
        avatar={<Avatar>{props.letter}</Avatar>}
        action={
          <>
            <IconButton onClick={(e) => setMenu(e.currentTarget)}>
              <MoreHorizOutlined />
            </IconButton>
            <Link
              underline="none"
              color="initial"
              className={styles['view-schedule-link']}
              href={
                props.teacherSchedule
                  ? `/view-schedule?teacherId=${props.id}`
                  : `/view-schedule?classId=${props.id}`
              }
            ></Link>
          </>
        }
        title={props.title || `Програма на ${props.number}${props.letter}`}
        subheader={
          props.startYear && props.endYear
            ? `${props.startYear} - ${props.endYear}`
            : 'Седмична'
        }
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
                pathname: '/edit-schedule',
                query: { classId: props.id },
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

const Schedule = () => {
  const router = useRouter();
  const { user, status } = useAuth();

  const [value, setValue] = useState(0);
  const [error, setError] = useState('');
  const { data } = useSWR(
    user?.role.toLowerCase() === 'parent'
      ? gql`
          query {
            getParentFromCurrUser {
              id
              students {
                id
                user {
                  firstName
                  lastName
                }
                class {
                  id
                  startYear
                  endYear
                  number
                  letter
                }
              }
            }
          }
        `
      : gql`
          query {
            getAllClasses {
              id
              startYear
              endYear
              number
              letter
            }
          }
        `,
  );

  console.log(data);

  useEffect(() => {
    if (status === 'REDIRECT') {
      router.push('/login');
    }
    if (
      user?.role.toLowerCase() === 'student' &&
      data?.getAllClasses?.length === 1
    ) {
      router.push(`/view-schedule?classId=${data?.getAllClasses[0]?.id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, status, data]);

  let tabCounter = 0;

  if (!user) {
    return <Loader />;
  }

  return (
    <>
      <Head>
        <title>Учебни програми &#8226; Sapira</title>
      </Head>
      <Drawer />
      <Container className="main-container" maxWidth={false} disableGutters>
        <Navbar title="Учебни програми" />
        <div className={styles.content}>
          <div className={styles['actions-container']}>
            {user.role.toLowerCase() === 'admin' && (
              <Link
                className={styles['schedule-add']}
                underline="none"
                href="/add-schedule"
              >
                <Button
                  disableElevation
                  variant="contained"
                  color="primary"
                  endIcon={<AddOutlined />}
                >
                  Добави програма
                </Button>
              </Link>
            )}
          </div>
          {user.role.toLowerCase() !== 'parent' ? (
            <div className={styles['schedules-container']}>
              {user.role.toLowerCase() === 'teacher' && (
                <ScheduleCard
                  id={user.id}
                  teacherSchedule
                  role={user.role}
                  title="Моята програма"
                />
              )}
              <>
                {data &&
                  data.getAllClasses?.map((currClass: Class, i: number) => (
                    <ScheduleCard
                      key={i}
                      teacherSchedule={false}
                      role={user.role}
                      {...currClass}
                    />
                  ))}
                {data && !data.getAllClasses && (
                  <div className={styles['no-classes']}>
                    <Typography color="textSecondary">
                      Няма съществуващи програми. За да добавите такива,
                      натиснете бутона &quot;Добави програма&quot;.
                    </Typography>
                  </div>
                )}
              </>
            </div>
          ) : (
            <>
              <AppBar position="static" color="transparent" elevation={0}>
                <Tabs
                  indicatorColor="primary"
                  value={value}
                  onChange={(_e, newValue) => setValue(newValue)}
                >
                  {data?.getParentFromCurrUser?.students.map(
                    (student: Student, i: number) => (
                      <Tab
                        key={i}
                        disableRipple
                        label={`${student?.user?.firstName} ${student?.user?.lastName}`}
                      />
                    ),
                  )}
                </Tabs>
              </AppBar>
              {data?.getParentFromCurrUser?.students?.map(
                (student: Student) => (
                  <TabPanel key={student.id} value={value} index={tabCounter++}>
                    <div
                      className={`${styles['schedules-container']} ${styles['parent']}`}
                    >
                      <ScheduleCard
                        teacherSchedule={false}
                        role={user.role}
                        {...student.class}
                      />
                    </div>
                  </TabPanel>
                ),
              )}
            </>
          )}
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

export default Schedule;
