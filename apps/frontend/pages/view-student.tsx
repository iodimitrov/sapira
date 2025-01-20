import Alert from '@material-ui/lab/Alert';
import {
  Avatar,
  Breadcrumbs,
  Container,
  Snackbar,
  Typography,
  Card,
  CardHeader,
  CardContent,
  Link,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  TextField,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
} from '@material-ui/core';
import Drawer from 'components/Drawer';
import Navbar from 'components/Navbar';
import { gql } from 'graphql-request';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState, Fragment } from 'react';
import useSWR from 'swr';
import styles from '~/styles/ViewStudent.module.scss';
import {
  PersonOutlineOutlined,
  AddOutlined,
  CloseOutlined,
  DoneOutlined,
} from '@material-ui/icons';
import { DropzoneArea } from 'material-ui-dropzone';
// eslint-disable-next-line import/no-duplicates
import { format } from 'date-fns';
// eslint-disable-next-line import/no-duplicates
import { bg } from 'date-fns/locale';
import gqlClient from '../client';
import { getUserRole } from '../utils';
import type {
  File as FileEntity,
  StudentDossier,
  Subject,
  User,
} from '@sapira/database';
import { useAuth } from '../hooks/useAuth';

type DossierProps = {
  id: string | undefined;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
  fromUser: User | undefined;
  subject?: Subject | undefined;
  message?: string | undefined;
  files: Pick<FileEntity, 'publicUrl' | 'key'>[];
  date: Date | undefined;
};

const StudentsComponent = (props: DossierProps) => {
  return (
    <Card className={styles['card']}>
      <CardHeader
        className={styles['card-header']}
        avatar={<Avatar>{props.fromUser?.firstName?.charAt(0)}</Avatar>}
        title={`${props.fromUser?.firstName} ${props.fromUser?.lastName}`}
        subheader={
          props.date
            ? format(props.date, 'do MMM yyyy k:m', {
                locale: bg,
              })
            : '--'
        }
      />
      <CardContent className={styles['card-content']}>
        <Typography>{`${props.message || ''}`}</Typography>
        <br />
        <Typography>
          {props.files?.map((file, i: number) => (
            <Fragment key={i}>
              <Link href={file.publicUrl || '#'} target="_blank">
                {`${file.key}`}
              </Link>
              <br />
            </Fragment>
          ))}
        </Typography>
      </CardContent>
    </Card>
  );
};

const ViewStudent = () => {
  const router = useRouter();
  const { user, status } = useAuth();

  const [addDialog, setAddDialog] = useState(false);
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [subjectId, setSubjectId] = useState('');
  const [error, setError] = useState('');

  const { data, mutate } = useSWR([
    gql`
      query ($studentId: String!) {
        getStudent(id: $studentId) {
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
            id
            number
            letter
          }
          prevEducation
          recordMessage
          dossier {
            id
            createdAt
            updatedAt
            fromUser {
              id
              firstName
              middleName
              lastName
            }
            subject {
              id
              name
            }
            message
            files {
              key
              publicUrl
            }
          }
        }

        getAllSubjects {
          id
          name
          description
          startYear
          endYear
          class {
            id
            number
            letter
          }
        }
      }
    `,
    { studentId: router.query.id || '' },
  ]);

  useEffect(() => {
    if (status === 'REDIRECT') {
      router.push('/login');
    }
    if (
      user &&
      user?.role.toLowerCase() !== 'admin' &&
      user?.role.toLowerCase() !== 'teacher'
    ) {
      router.back();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, status, router]);

  const addDossier = async () => {
    try {
      await gqlClient.request(
        gql`
          mutation (
            $studentId: String!
            $subjectId: String!
            $files: [Upload!]
            $message: String!
          ) {
            addStudentDossier(
              input: {
                studentId: $studentId
                subjectId: $subjectId
                files: $files
                message: $message
              }
            ) {
              studentDossierId
            }
          }
        `,
        {
          studentId: router.query.id,
          subjectId,
          files,
          message,
        },
      );
      mutate();
      setAddDialog(false);
    } catch (error) {
      setError('Неизвестна грешка');
    }
  };

  return (
    <>
      <Head>
        <title>Ученик &#8226; Sapira</title>
      </Head>
      <Drawer />
      <Container className="main-container" maxWidth={false} disableGutters>
        <Navbar title="Ученик" />
        <div className={styles.content}>
          <div className={styles['profile-container']}>
            <Avatar
              className={styles.avatar}
              src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
              alt="profile"
            />
            <div className={styles['profile-info']}>
              <Typography className={styles['name']} variant="h4">
                {data &&
                  data?.getStudent &&
                  data?.getStudent?.user &&
                  `${data.getStudent.user.firstName} ${data.getStudent.user.middleName} ${data.getStudent.user.lastName}`}
              </Typography>
              <Breadcrumbs className={styles['additional-info']}>
                <Typography className={styles['additional-text']}>
                  <PersonOutlineOutlined />
                  {data &&
                    data?.getStudent &&
                    data?.getStudent?.user &&
                    getUserRole(data.getStudent.user.role)}
                </Typography>
                {data &&
                  data?.getStudent &&
                  data?.getStudent?.class &&
                  data.getStudent.class.number &&
                  data.getStudent.class.letter && (
                    <Typography>
                      {data.getStudent.class.number}
                      {data.getStudent.class.letter}
                    </Typography>
                  )}
              </Breadcrumbs>
              <Typography className={styles['record-message']}>
                {data &&
                  data?.getStudent &&
                  data?.getStudent?.recordMessage &&
                  data.getStudent.recordMessage}
              </Typography>
              <Button
                className={styles['add-button']}
                disableElevation
                variant="contained"
                color="primary"
                endIcon={<AddOutlined />}
                onClick={() => setAddDialog(true)}
              >
                Добави
              </Button>
            </div>
          </div>
          {data?.getStudent?.dossier
            .sort((a: StudentDossier, b: StudentDossier) =>
              (a.updatedAt as Date) > (b.updatedAt as Date)
                ? -1
                : (a.updatedAt as Date) < (b.updatedAt as Date)
                  ? 1
                  : 0,
            )
            .map((dossier: StudentDossier, i: number) => (
              <StudentsComponent
                key={i}
                id={data.getStudent.id}
                createdAt={new Date(dossier?.createdAt as Date)}
                updatedAt={new Date(dossier?.updatedAt as Date)}
                fromUser={dossier.fromUser}
                message={dossier.message}
                subject={dossier.subject ?? undefined}
                files={dossier.files ?? []}
                date={dossier.updatedAt}
              ></StudentsComponent>
            ))}
        </div>
        <Dialog
          fullWidth
          maxWidth="lg"
          className={styles['dialog']}
          open={addDialog}
          onClose={() => setAddDialog(false)}
        >
          <DialogTitle className={styles['dialog-title']}>
            Добави бележка
          </DialogTitle>
          <DialogContent className={styles['dialog-content']}>
            <div className={styles['input-container']}>
              <TextField
                label="Коментар под бележката"
                variant="outlined"
                fullWidth
                required
                value={message}
                multiline
                rows={7}
                rowsMax={9}
                onChange={(e) => setMessage(e.target.value)}
              />
              <FormControl
                variant="outlined"
                className={styles['subject-select']}
              >
                <InputLabel id="subject-select-label">Предмет</InputLabel>
                <Select
                  label="Предмет"
                  labelId="subject-select-label"
                  value={subjectId}
                  onChange={(e) => {
                    setSubjectId(e.target.value as string);
                  }}
                  renderValue={(selected) => {
                    const selectedSubject: Subject | undefined =
                      data?.getAllSubjects.find(
                        (subject: Subject) => subject.id === selected,
                      );
                    return `${selectedSubject?.class?.number}${selectedSubject?.class?.letter} ${selectedSubject?.name}`;
                  }}
                >
                  <MenuItem value="">Без</MenuItem>
                  {data?.getAllSubjects
                    ?.filter(
                      (subject: Subject) =>
                        subject.class?.id === data?.getStudent?.class?.id,
                    )
                    .map((subject: Subject) => (
                      <MenuItem key={subject.id} value={subject.id}>
                        {`${subject?.class?.number}${subject?.class?.letter} ${subject?.name}`}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </div>
            <div className={styles['input-container']}>
              <DropzoneArea
                showAlerts={['error']}
                showFileNames
                previewGridProps={{
                  item: { xs: false, md: true },
                }}
                previewGridClasses={{
                  container: 'upload-grid-container',
                  item: 'upload-grid-item',
                }}
                maxFileSize={40000000}
                filesLimit={10}
                onChange={(files) => setFiles(files)}
              />
            </div>
          </DialogContent>
          <DialogActions className={styles['dialog-actions']}>
            <Button
              onClick={() => setAddDialog(false)}
              disableElevation
              variant="outlined"
              color="secondary"
              endIcon={<CloseOutlined />}
            >
              Отказ
            </Button>
            <Button
              onClick={addDossier}
              disableElevation
              variant="contained"
              color="primary"
              endIcon={<DoneOutlined />}
            >
              Потвърди
            </Button>
          </DialogActions>
        </Dialog>
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
export default ViewStudent;
