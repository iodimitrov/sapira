import { useEffect, useState, FormEvent } from 'react';
import Head from 'next/head';
import Navbar from 'components/Navbar';
import Drawer from 'components/Drawer';
import Link from 'components/Link';
import {
  Container,
  Button,
  TextField,
  Snackbar,
  MenuItem,
  InputLabel,
  FormControl,
  Select,
} from '@material-ui/core';
import { DoneOutlined, CloseOutlined } from '@material-ui/icons';
import { useRouter } from 'next/router';
import Loader from 'components/Loader';
import styles from '~/styles/AddClass.module.scss';
import useSWR from 'swr';
import { gql } from 'graphql-request';
import Alert from '@material-ui/lab/Alert';
import gqlClient from '../client';
import { useAuth } from '../hooks/useAuth';
import { Teacher } from '@sapira/database';

const AddClass = () => {
  const router = useRouter();
  const { user, status } = useAuth();

  const [classNumber, setClassNumber] = useState<number>();
  const [classLetter, setClassLetter] = useState('');
  const [totalStudentCount, setTotalStudentCount] = useState<number>();
  const [startYear, setStartYear] = useState(new Date().getFullYear());
  const [endYear, setEndYear] = useState(new Date().getFullYear() + 1);
  const [teacherId, setTeacherId] = useState('');
  const [error, setError] = useState('');
  const { data } = useSWR([
    gql`
      query {
        getAllAvailableClassTeachers {
          id
          user {
            firstName
            lastName
          }
        }
      }
    `,
  ]);

  useEffect(() => {
    if (status === 'REDIRECT') {
      router.push('/login');
    }
    if (user && user?.role.toLowerCase() !== 'admin') {
      router.back();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, status]);

  const addClass = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await gqlClient.request(
        gql`
          mutation (
            $startYear: Int!
            $endYear: Int!
            $totalStudentCount: Int!
            $classNumber: Int!
            $classLetter: String!
            $teacherId: String
          ) {
            addClass(
              input: {
                startYear: $startYear
                endYear: $endYear
                totalStudentCount: $totalStudentCount
                number: $classNumber
                letter: $classLetter
                teacherId: $teacherId
              }
            ) {
              classId
            }
          }
        `,
        {
          startYear,
          endYear,
          totalStudentCount,
          classNumber,
          classLetter,
          teacherId,
        },
      );
      router.push('/classes');
    } catch (error) {
      setError('Неизвестна грешка');
    }
  };

  if (!user) {
    return <Loader />;
  }

  return (
    <>
      <Head>
        <title>Добави клас &#8226; Sapira</title>
      </Head>
      <Drawer />
      <Container className="main-container" maxWidth={false} disableGutters>
        <Navbar title="Добави клас" />
        <div className={styles.content}>
          <div className={styles['actions-container']}>
            <Button
              className={`${styles['confirm']} ${styles['button-link']}`}
              disableElevation
              variant="contained"
              color="primary"
              form="add-class"
              type="submit"
              endIcon={<DoneOutlined />}
            >
              Потвърди
            </Button>
            <Link
              className={styles['button-link']}
              underline="none"
              href="/classes"
            >
              <Button
                disableElevation
                variant="outlined"
                color="secondary"
                endIcon={<CloseOutlined />}
              >
                Отказ
              </Button>
            </Link>
          </div>
          <form
            id="add-class"
            className={styles['add-class-container']}
            onSubmit={addClass}
          >
            <div className={styles['input-container']}>
              <TextField
                className={styles['classnumber-select']}
                label="Клас"
                placeholder="1 - 12"
                type="number"
                inputProps={{
                  min: 1,
                  max: 12,
                }}
                required
                variant="outlined"
                value={classNumber}
                onChange={(e) => setClassNumber(parseInt(e.target.value))}
              />
              <TextField
                className={styles['classletter-select']}
                label="Паралелка"
                placeholder="А, Б, В..."
                required
                variant="outlined"
                value={classLetter}
                onChange={(e) => setClassLetter(e.target.value.toUpperCase())}
              />
              <TextField
                className={styles['studentcount-select']}
                label="Брой ученици в клас"
                type="number"
                inputProps={{
                  min: 1,
                }}
                required
                variant="outlined"
                value={totalStudentCount}
                onChange={(e) => setTotalStudentCount(parseInt(e.target.value))}
              />
              <FormControl
                variant="outlined"
                className={styles['teacher-select']}
              >
                <InputLabel id="teacher-select-label">
                  Класен ръководител
                </InputLabel>
                <Select
                  label="Класен ръководител"
                  labelId="teacher-select-label"
                  value={teacherId}
                  onChange={(e) => setTeacherId(e.target.value as string)}
                  renderValue={(selected) => {
                    const selectedTeacher: Teacher =
                      data?.getAllAvailableClassTeachers.find(
                        (teacher: Teacher) => teacher.id === selected,
                      );
                    return `${selectedTeacher?.user?.firstName} ${selectedTeacher?.user?.lastName}`;
                  }}
                >
                  <MenuItem value="">Без</MenuItem>
                  {data &&
                    data?.getAllAvailableClassTeachers &&
                    data?.getAllAvailableClassTeachers?.map(
                      (teacher: Teacher, i: number) => (
                        <MenuItem key={i} value={teacher.id}>
                          {`${teacher?.user?.firstName} ${teacher?.user?.lastName}`}
                        </MenuItem>
                      ),
                    )}
                </Select>
              </FormControl>
              <div className={styles['years-container']}>
                <TextField
                  className={styles['years-input']}
                  label="Стартираща година"
                  required
                  variant="outlined"
                  value={startYear}
                  inputProps={{
                    min: new Date().getFullYear(),
                  }}
                  onChange={(e) => setStartYear(parseInt(e.target.value))}
                  type="number"
                />
                <TextField
                  className={styles['years-input']}
                  label="Завършваща година"
                  required
                  variant="outlined"
                  value={endYear}
                  inputProps={{
                    min: new Date().getFullYear() + 1,
                  }}
                  onChange={(e) => setEndYear(parseInt(e.target.value))}
                  type="number"
                />
              </div>
            </div>
          </form>
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

export default AddClass;
