import Drawer from 'components/Drawer';
import Navbar from 'components/Navbar';
import { gql } from 'graphql-request';
import {
  Avatar,
  Breadcrumbs,
  Button,
  Container,
  MenuItem,
  TextField,
  Typography,
  Snackbar,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FormEvent, useEffect, useState } from 'react';
import useSWR from 'swr';
import styles from '~/styles/EditForeignUser.module.scss';
import { EditOutlined, PersonOutlineOutlined } from '@material-ui/icons';
import { useAuth } from '../hooks/useAuth';
import gqlClient from '../client';
import { getContractType, getUserRole, getUserStatus } from '../utils';
import { ContractType, UserStatus } from '../types';

const EditForeignUser = () => {
  const router = useRouter();
  const { user, status } = useAuth();
  const [error, setError] = useState('');
  const [userStatus, setUserStatus] = useState('');
  const [userId, setUserId] = useState('');

  const [recordMessage, setRecordMessage] = useState('');
  const [contractType, setContractType] = useState('');
  const { r: role, id } = router.query;

  const forStudent = gql`
    query ($id: String!) {
      getStudent(id: $id) {
        id
        user {
          id
          firstName
          middleName
          lastName
          email
          status
          role
        }
        class {
          number
          letter
        }
        prevEducation
        recordMessage
      }
    }
  `;
  const forTeacher = gql`
    query ($id: String!) {
      getTeacher(id: $id) {
        id
        user {
          id
          firstName
          middleName
          lastName
          email
          status
          role
        }
        education
        yearsExperience
        contractType
      }
    }
  `;

  const { data } = useSWR([
    id
      ? role === 'STUDENT'
        ? forStudent
        : forTeacher
      : gql`
          query {
            getProfile {
              id
            }
          }
        `,
    { id },
  ]);

  useEffect(() => {
    if (status === 'REDIRECT') {
      router.push('/login');
    }
    if (user && user?.role.toLowerCase() !== 'admin') {
      router.back();
    }

    if (Array.isArray(role)) {
      return;
    }

    if (role?.toLowerCase() === 'teacher') {
      setUserStatus(data?.getTeacher?.user?.status as string);
      setContractType(data?.getTeacher?.contractType as string);
      setUserId(data?.getTeacher?.user?.id as string);
    } else if (role?.toLowerCase() === 'student') {
      setUserStatus(data?.getStudent?.user?.status as string);
      setUserId(data?.getStudent?.user?.id as string);
      setRecordMessage(data?.getStudent?.recordMessage as string);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, status, router]);

  const updateStudent = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await gqlClient.request(
        gql`
          mutation (
            $stId: String!
            $userId: String!
            $recordMessage: String!
            $userStatus: UserStatus!
          ) {
            updateStudentRecord(
              input: { id: $stId, recordMessage: $recordMessage }
            ) {
              studentId
            }

            updateUserStatus(input: { id: $userId, userStatus: $userStatus }) {
              userId
            }
          }
        `,
        {
          stId: id,
          recordMessage,
          userId,
          userStatus,
        },
      );
      router.push('/users');
    } catch (error) {
      setError('Неизвестна грешка');
    }
  };

  const updateTeacher = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await gqlClient.request(
        gql`
          mutation (
            $tchId: String!
            $userId: String!
            $userStatus: UserStatus!
            $contractType: ContractType
          ) {
            updateTeacher(input: { id: $tchId, contractType: $contractType }) {
              teacherId
            }

            updateUserStatus(input: { id: $userId, userStatus: $userStatus }) {
              userId
            }
          }
        `,
        {
          tchId: id,
          contractType,
          userId,
          userStatus,
        },
      );
      router.push('/users');
    } catch (error) {
      setError('Неизвестна грешка');
    }
  };

  return (
    <>
      <Head>
        <title>Потребител &#8226; Sapira</title>
      </Head>
      <Drawer />
      <Container className="main-container" maxWidth={false} disableGutters>
        <Navbar title="Потребител" />
        <div className={styles.content}>
          <div className={styles['profile-container']}>
            <Avatar
              className={styles.avatar}
              src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
              alt="profile"
            />
            <div className={styles['profile-info']}>
              {data && role === 'STUDENT' && data?.getStudent && (
                <>
                  <Typography className={styles['name']} variant="h4">
                    {`${data.getStudent.user.firstName} ${data.getStudent.user.middleName} ${data.getStudent.user.lastName}`}
                  </Typography>
                  <Breadcrumbs className={styles['additional-info']}>
                    <Typography className={styles['additional-text']}>
                      <PersonOutlineOutlined />
                      {getUserRole(data.getStudent.user.role)}
                    </Typography>
                    {data.getStudent.class.number &&
                      data.getStudent.class.letter && (
                        <Typography>
                          {data.getStudent.class.number}
                          {data.getStudent.class.letter}
                        </Typography>
                      )}
                  </Breadcrumbs>
                  <Typography className={styles['record-message']}>
                    {data.getStudent.recordMessage}
                  </Typography>
                </>
              )}
              {data && role === 'TEACHER' && data?.getTeacher && (
                <>
                  <Typography className={styles['name']} variant="h4">
                    {data.getTeacher.user.firstName}
                    {data.getTeacher.user.lastName}
                  </Typography>
                  <Breadcrumbs className={styles['additional-info']}>
                    <Typography className={styles['additional-text']}>
                      <PersonOutlineOutlined />
                      {getUserRole(data.getTeacher.user.role)}
                    </Typography>
                    <Typography>{data.getTeacher.contractType}</Typography>
                  </Breadcrumbs>
                </>
              )}
            </div>
          </div>
          <div className={styles['edit-fields']}>
            {data && role === 'STUDENT' && data?.getStudent && (
              <>
                <TextField
                  label="Коментар"
                  value={recordMessage}
                  variant="outlined"
                  className={styles['record-message']}
                  onChange={(e) => {
                    setRecordMessage(e.target.value as string);
                  }}
                />
              </>
            )}
            {role === 'TEACHER' && (
              <>
                <TextField
                  select
                  label="Договор"
                  value={contractType || ''}
                  variant="outlined"
                  className={styles['contract-type']}
                  onChange={(e) => {
                    setContractType(e.target.value as string);
                  }}
                >
                  {(['FULL_TIME', 'PART_TIME'] satisfies ContractType[]).map(
                    (type) => (
                      <MenuItem key={type} value={type}>
                        {getContractType(type)}
                      </MenuItem>
                    ),
                  )}
                </TextField>
              </>
            )}
            {userStatus && (
              <TextField
                select
                label="Статус"
                value={userStatus}
                variant="outlined"
                className={styles['user-status']}
                onChange={(e) => {
                  setUserStatus(e.target.value as string);
                }}
              >
                {(
                  [
                    'ACTIVE',
                    'INACTIVE',
                    'BLOCKED',
                    'UNVERIFIED',
                  ] satisfies UserStatus[]
                ).map((type) => (
                  <MenuItem key={type} value={type}>
                    {getUserStatus(type)}
                  </MenuItem>
                ))}
              </TextField>
            )}
          </div>
          {data &&
            !Array.isArray(role) &&
            role?.toLowerCase() === 'teacher' &&
            data?.getTeacher && (
              <div className={styles['actions']}>
                <Button
                  color="primary"
                  variant="contained"
                  disableElevation
                  startIcon={<EditOutlined />}
                  onClick={updateTeacher}
                >
                  Редактиране
                </Button>
              </div>
            )}
          {data &&
            !Array.isArray(role) &&
            role?.toLowerCase() === 'student' &&
            data?.getStudent && (
              <div className={styles['actions']}>
                <Button
                  color="primary"
                  variant="contained"
                  disableElevation
                  startIcon={<EditOutlined />}
                  onClick={updateStudent}
                >
                  Редактиране
                </Button>
              </div>
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

export default EditForeignUser;
