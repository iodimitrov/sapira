import { useEffect, useState } from 'react';
import Head from 'next/head';
import Navbar from 'components/Navbar';
import Drawer from 'components/Drawer';
import {
  Container,
  Snackbar,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogActions,
  Button,
  TextField,
  Typography,
  MenuItem,
} from '@material-ui/core';
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import {
  CloseOutlined,
  DoneOutlined,
  DeleteOutlined,
} from '@material-ui/icons';
import { useRouter } from 'next/router';
import Loader from 'components/Loader';
import styles from '~/styles/Calendar.module.scss';
import useSWR from 'swr';
import { gql } from 'graphql-request';
import Alert from '@material-ui/lab/Alert';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
// eslint-disable-next-line import/no-duplicates
import { format, parse, startOfWeek, getDay } from 'date-fns';
// eslint-disable-next-line import/no-duplicates
import { bg } from 'date-fns/locale';
import gqlClient from '../client';
import { useAuth } from '../hooks/useAuth';
import type {
  Message,
  MessageStatus as MessageStatusEnum,
} from '@sapira/database';
import { getAssignmentType, getMessageStatus } from '../utils';
import { MessageStatus } from '../types';

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: {
    bg,
  },
});

const CalendarComponent = () => {
  const router = useRouter();
  const { user, status } = useAuth();

  const [editDialog, setEditDialog] = useState<Message | null>(null);
  const [error, setError] = useState('');
  const { data, mutate } = useSWR([
    gql`
      query ($filterByType: MessageType) {
        getAllMessagesByCriteria(input: { messageType: $filterByType }) {
          id
          createdAt
          assignmentType
          assignmentDueDate
          subject {
            name
          }
        }
      }
    `,
    { filterByType: 'ASSIGNMENT' },
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

  const openDialog = async (id: string) => {
    try {
      const data = await gqlClient.request<any>(
        gql`
          query ($id: String!) {
            getMessage(id: $id) {
              id
              createdAt
              assignmentType
              assignmentDueDate
              data
              status
              subject {
                name
              }
            }
          }
        `,
        { id },
      );
      setEditDialog(data.getMessage);
    } catch (error) {
      setError('Неизвестна грешка');
    }
  };

  const updateAssignment = async () => {
    try {
      await gqlClient.request(
        gql`
          mutation (
            $id: String!
            $data: String!
            $assignmentDueDate: Date!
            $status: MessageStatus!
          ) {
            updateMessage(
              input: {
                id: $id
                data: $data
                assignmentDueDate: $assignmentDueDate
                status: $status
              }
            ) {
              messageId
            }
          }
        `,
        {
          id: editDialog?.id,
          data: editDialog?.data,
          assignmentDueDate: editDialog?.assignmentDueDate,
          status: editDialog?.status,
        },
      );
      mutate();
      setEditDialog(null);
    } catch (error) {
      setError('Неизвестна грешка');
    }
  };

  const deleteAssignment = async () => {
    try {
      await gqlClient.request(
        gql`
          mutation ($id: String!) {
            removeMessage(id: $id) {
              messageId
            }
          }
        `,
        { id: editDialog?.id },
      );
      mutate();
      setEditDialog(null);
    } catch (error) {
      setError('Неизвестна грешка');
    }
  };

  return (
    <>
      <Head>
        <title>Календар &#8226; Sapira</title>
      </Head>
      <Drawer />
      <Container className="main-container" maxWidth={false} disableGutters>
        <Navbar title="Календар" />
        <div className={styles.content}>
          <div className={styles['calendar-container']}>
            {data && (
              <Calendar
                localizer={localizer}
                messages={{
                  next: 'Напред',
                  previous: 'Назад',
                  today: 'Днес',
                  month: 'Месец',
                  week: 'Седмица',
                  day: 'Ден',
                  agenda: 'График',
                }}
                events={
                  data.getAllMessagesByCriteria &&
                  data.getAllMessagesByCriteria?.map((event: Message) => ({
                    id: event.id,
                    title: `${event.subject?.name} - ${getAssignmentType(
                      event.assignmentType as string,
                    )}`,
                    start: new Date(event.createdAt as Date),
                    end: new Date(event.assignmentDueDate as Date),
                  }))
                }
                culture="bg"
                startAccessor="start"
                endAccessor="end"
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onSelectEvent={(event: any) =>
                  (user?.role.toLowerCase() === 'admin' ||
                    user?.role.toLowerCase() === 'teacher') &&
                  openDialog(event.id)
                }
              />
            )}
          </div>
        </div>
        {editDialog && (
          <MuiPickersUtilsProvider utils={DateFnsUtils} locale={bg}>
            <Dialog
              fullWidth
              maxWidth="lg"
              className={styles['dialog']}
              open={Boolean(editDialog)}
              onClose={() => setEditDialog(null)}
            >
              <DialogTitle className={styles['dialog-title']}>
                {`${editDialog.subject?.name} - ${getAssignmentType(
                  editDialog.assignmentType as string,
                )}`}
                <Typography color="textSecondary" variant="body2">
                  Създадено:&nbsp;
                  {format(
                    new Date(editDialog.createdAt as Date),
                    'do MMM yyyy',
                    { locale: bg },
                  )}
                </Typography>
              </DialogTitle>
              <DialogContent className={styles['dialog-content']}>
                <DialogContentText>
                  <TextField
                    label="Описаниe на заданието"
                    variant="outlined"
                    fullWidth
                    value={editDialog.data}
                    multiline
                    rows={5}
                    rowsMax={7}
                    onChange={(e) =>
                      setEditDialog({
                        ...editDialog,
                        data: e.target.value,
                      })
                    }
                  />
                </DialogContentText>
                <div className={styles['input-container']}>
                  <KeyboardDateTimePicker
                    inputVariant="outlined"
                    required
                    variant="inline"
                    invalidDateMessage="Невалиден формат"
                    label="Краен срок"
                    ampm={false}
                    value={new Date(editDialog.assignmentDueDate as Date)}
                    onChange={(date) =>
                      date &&
                      setEditDialog({
                        ...editDialog,
                        assignmentDueDate: new Date(
                          date.setSeconds(0, 0),
                        ) as Date,
                      })
                    }
                    autoOk
                    format="do MMM yyyy HH:mm"
                  />
                  <TextField
                    required
                    select
                    className={styles['asg-status']}
                    label="Статус"
                    variant="outlined"
                    value={editDialog.status}
                    onChange={(e) => {
                      setEditDialog({
                        ...editDialog,
                        status: e.target.value as MessageStatusEnum,
                      });
                    }}
                  >
                    {(['CREATED', 'PUBLISHED'] satisfies MessageStatus[]).map(
                      (status) => (
                        <MenuItem key={status} value={status}>
                          {getMessageStatus(status)}
                        </MenuItem>
                      ),
                    )}
                  </TextField>
                </div>
              </DialogContent>
              <DialogActions className={styles['dialog-actions']}>
                <div className={styles['actions-container']}>
                  <Button
                    className={styles['remove-asg']}
                    onClick={deleteAssignment}
                    disableElevation
                    variant="outlined"
                    endIcon={<DeleteOutlined />}
                  >
                    Изтрий
                  </Button>
                </div>
                <div className={styles['actions-container']}>
                  <Button
                    onClick={() => setEditDialog(null)}
                    disableElevation
                    variant="outlined"
                    color="secondary"
                    endIcon={<CloseOutlined />}
                  >
                    Отказ
                  </Button>
                  <Button
                    onClick={updateAssignment}
                    disableElevation
                    variant="contained"
                    color="primary"
                    endIcon={<DoneOutlined />}
                  >
                    Потвърди
                  </Button>
                </div>
              </DialogActions>
            </Dialog>
          </MuiPickersUtilsProvider>
        )}
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

export default CalendarComponent;
