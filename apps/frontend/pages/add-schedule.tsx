import {
  useEffect,
  useState,
  FormEvent,
  createContext,
  useContext,
} from 'react';
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
  Checkbox,
  ListItemText,
  InputLabel,
  FormControl,
  Select,
} from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
} from '@material-ui/pickers';
import {
  DoneOutlined,
  CloseOutlined,
  AddOutlined,
  RemoveOutlined,
} from '@material-ui/icons';
import { useRouter } from 'next/router';
import Loader from 'components/Loader';
import styles from '~/styles/AddSchedule.module.scss';
import useSWR from 'swr';
import { gql } from 'graphql-request';
import Alert from '@material-ui/lab/Alert';
import { Class, Subject, Teacher } from '@sapira/database';
import { useAuth } from '../hooks/useAuth';
import gqlClient from '../client';

type ScheduleField = {
  id: number;
  weekDay: string;
  startTime: Date | null;
  endTime: Date | null;
  subjectId: string;
  teachersIds: string[];
  room: string;
};

type ScheduleFieldProps = {
  id: number;
  subjects: Subject[];
  teachers: Teacher[];
  onDelete?: (id: number) => void;
} & Partial<ScheduleField>;

type ScheduleContext = {
  updateSubject: (updateField: ScheduleField) => void;
};

const ScheduleContext = createContext<ScheduleContext>({
  updateSubject: () => ({}),
});

const ScheduleField = (props: ScheduleFieldProps) => {
  const { updateSubject } = useContext(ScheduleContext);
  const [weekDay, setWeekDay] = useState('');
  const [startTime, setStartTime] = useState<Date | null>(new Date());
  const [endTime, setEndTime] = useState<Date | null>(new Date());
  const [subjectId, setSubjectId] = useState('');
  const [room, setRoom] = useState('');
  const [teachersIds, setTeachersIds] = useState<string[]>([]);
  const weekDays = [
    { value: 'MONDAY', content: 'Понеделник' },
    { value: 'TUESDAY', content: 'Вторник' },
    { value: 'WEDNESDAY', content: 'Сряда' },
    { value: 'THURSDAY', content: 'Четвъртък' },
    { value: 'FRIDAY', content: 'Петък' },
    { value: 'SATURDAY', content: 'Събота' },
    { value: 'SUNDAY', content: 'Неделя' },
  ];

  return (
    <div className={styles['input-container']}>
      <Button
        disableElevation
        variant="outlined"
        className={styles['remove-subject']}
        disabled={!props.onDelete}
        onClick={() => props.onDelete && props.onDelete(props.id as number)}
      >
        <RemoveOutlined />
      </Button>
      <TextField
        select
        className={styles['day-select']}
        label="Ден от седмицата"
        required
        value={weekDay}
        onChange={(e) => {
          setWeekDay(e.target.value);
          updateSubject({
            id: props.id,
            weekDay: e.target.value,
            startTime: startTime,
            endTime: endTime,
            subjectId: subjectId,
            teachersIds: teachersIds,
            room: room,
          });
        }}
        variant="outlined"
      >
        {weekDays &&
          weekDays.map((weekDay) => (
            <MenuItem key={weekDay.value} value={weekDay.value}>
              {weekDay.content}
            </MenuItem>
          ))}
      </TextField>
      <div className={styles['time-container']}>
        <KeyboardTimePicker
          inputVariant="outlined"
          ampm={false}
          className={styles.time}
          autoOk
          required
          invalidDateMessage="Невалиден формат"
          label="Начален час"
          value={startTime}
          onChange={(date) => {
            setStartTime(date);
            updateSubject({
              id: props.id,
              weekDay: weekDay,
              startTime: date && new Date(date.setSeconds(0, 0)),
              endTime: endTime,
              subjectId: subjectId,
              teachersIds: teachersIds,
              room: room,
            });
          }}
        />
        <KeyboardTimePicker
          inputVariant="outlined"
          ampm={false}
          className={styles.time}
          autoOk
          required
          invalidDateMessage="Невалиден формат"
          label="Краен час"
          value={endTime}
          onChange={(date) => {
            setEndTime(date);
            updateSubject({
              id: props.id,
              weekDay: weekDay,
              startTime: startTime,
              endTime: date && new Date(date.setSeconds(0, 0)),
              subjectId: subjectId,
              teachersIds: teachersIds,
              room: room,
            });
          }}
        />
      </div>
      <FormControl
        variant="outlined"
        className={styles['subject-select']}
        required
      >
        <InputLabel id="subject-select-label">Предмет</InputLabel>
        <Select
          label="Предмет"
          labelId="subject-select-label"
          value={subjectId}
          onChange={(e) => {
            setSubjectId(e.target.value as string);
            updateSubject({
              id: props.id,
              weekDay: weekDay,
              startTime: startTime,
              endTime: endTime,
              subjectId: e.target.value as string,
              teachersIds: teachersIds,
              room: room,
            });
          }}
          renderValue={(selected) => {
            const selectedSubject: Subject | undefined = props.subjects.find(
              (subject: Subject) => subject.id === selected,
            );
            return `${selectedSubject?.class?.number}${selectedSubject?.class?.letter} ${selectedSubject?.name}`;
          }}
        >
          {props.subjects &&
            props.subjects?.map((subject: Subject, i: number) => (
              <MenuItem key={i} value={subject.id}>
                {`${subject?.class?.number}${subject?.class?.letter} ${subject?.name}`}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
      <FormControl
        variant="outlined"
        className={styles['teachers-select']}
        required
      >
        <InputLabel id="teachers-select-label">Преподаватели</InputLabel>
        <Select
          label="Преподаватели"
          labelId="teachers-select-label"
          multiple
          value={teachersIds}
          onChange={(e) => {
            setTeachersIds(e.target.value as string[]);
            updateSubject({
              id: props.id,
              weekDay: weekDay,
              startTime: startTime,
              endTime: endTime,
              subjectId: subjectId,
              teachersIds: e.target.value as string[],
              room: room,
            });
          }}
          renderValue={(selected) =>
            (selected as string[])
              .map(
                (selection) =>
                  props.teachers.find(
                    (teacher: Teacher) => teacher.id === selection,
                  )?.user,
              )
              .map((user) => `${user?.firstName} ${user?.lastName}`)
              .join(', ')
          }
        >
          {teachersIds &&
            props.teachers &&
            props.teachers.map((teacher: Teacher, i: number) => (
              <MenuItem key={i} value={teacher.id}>
                <Checkbox
                  color="primary"
                  checked={teachersIds.indexOf(teacher.id as string) > -1}
                />
                <ListItemText
                  primary={`${teacher.user?.firstName} ${teacher.user?.lastName}`}
                />
              </MenuItem>
            ))}
        </Select>
      </FormControl>
      <TextField
        className={styles['room-select']}
        label="Зала"
        required
        value={room}
        onChange={(e) => {
          setRoom(e.target.value);
          updateSubject({
            id: props.id,
            weekDay: weekDay,
            startTime: startTime,
            endTime: endTime,
            subjectId: subjectId,
            teachersIds: teachersIds,
            room: e.target.value,
          });
        }}
        variant="outlined"
      />
    </div>
  );
};

const AddSchedule = () => {
  const router = useRouter();
  const { user, status } = useAuth();

  const [error, setError] = useState('');
  const [classId, setClassId] = useState('');
  const [fields, setFields] = useState<ScheduleField[]>([
    {
      id: 0,
      startTime: new Date(new Date().setSeconds(0, 0)),
      endTime: new Date(new Date().setSeconds(0, 0)),
      weekDay: '',
      subjectId: '',
      teachersIds: [],
      room: '',
    },
  ]);

  const { data } = useSWR([
    gql`
      query {
        getAllClasses {
          id
          number
          letter
        }
        getAllTeachers {
          id
          user {
            firstName
            lastName
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

  const addSchedule = async (e: FormEvent) => {
    e.preventDefault();
    try {
      for (const field of fields) {
        await gqlClient.request(
          gql`
            mutation (
              $startTime: Date!
              $endTime: Date!
              $day: WeekDays!
              $subjectId: String!
              $classId: String!
              $teachersIds: [String!]!
              $room: String!
            ) {
              addSchedule(
                input: {
                  startTime: $startTime
                  endTime: $endTime
                  day: $day
                  subjectId: $subjectId
                  classId: $classId
                  teachersIds: $teachersIds
                  room: $room
                }
              ) {
                scheduleId
              }
            }
          `,
          {
            startTime: field.startTime,
            endTime: field.endTime,
            day: field.weekDay,
            subjectId: field.subjectId,
            classId: classId,
            teachersIds: field.teachersIds,
            room: field.room,
          },
        );
      }
      router.push('/schedules');
    } catch ({ response }: any) {
      if (response.errors?.[0].message.includes('This Class already exists')) {
        setError('Има предмет вече на това място');
      }
      setError('Неизвестна грешка');
    }
  };

  const removeSubject = (id: number) => {
    setFields([...fields.filter((field) => field.id !== id)]);
  };

  const addSubject = () => {
    setFields([
      ...fields,
      {
        id: fields.length,
        startTime: new Date(),
        endTime: new Date(),
        weekDay: '',
        subjectId: '',
        teachersIds: [],
        room: '',
      },
    ]);
  };

  const updateSubject = (updateField: ScheduleField) => {
    const newFields = fields;
    const index = fields.findIndex((field) => field.id === updateField.id);
    newFields[index] = updateField;
    setFields(newFields);
  };

  if (!user) {
    return <Loader />;
  }

  return (
    <>
      <Head>
        <title>Добави програма &#8226; Sapira</title>
      </Head>
      <Drawer />
      <ScheduleContext.Provider value={{ updateSubject }}>
        <Container className="main-container" maxWidth={false} disableGutters>
          <Navbar title="Добави програма" />
          <div className={styles.content}>
            <div className={styles['actions-container']}>
              <Button
                className={`${styles['confirm']} ${styles['button-link']}`}
                disableElevation
                variant="contained"
                color="primary"
                form="addSchedule"
                type="submit"
                endIcon={<DoneOutlined />}
              >
                Потвърди
              </Button>
              <Link
                className={styles['button-link']}
                underline="none"
                href="/schedules"
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
              id="addSchedule"
              className={styles['add-schedule-container']}
              onSubmit={addSchedule}
            >
              <div className={styles['input-container']}>
                <FormControl
                  required
                  variant="outlined"
                  className={styles['class-select']}
                >
                  <InputLabel id="class-select-label">Клас</InputLabel>
                  <Select
                    label="Клас"
                    labelId="class-select-label"
                    value={classId}
                    onChange={(e) => setClassId(e.target.value as string)}
                    renderValue={(selected) => {
                      const selectedClass: Class = data.getAllClasses.find(
                        (currClass: Class) => currClass.id === selected,
                      );
                      return `${selectedClass.number} ${selectedClass.letter}`;
                    }}
                  >
                    {data &&
                      data?.getAllClasses &&
                      data?.getAllClasses?.map(
                        (currClass: Class, i: number) => (
                          <MenuItem key={i} value={currClass.id}>
                            {`${currClass.number} ${currClass.letter}`}
                          </MenuItem>
                        ),
                      )}
                  </Select>
                </FormControl>
              </div>
              {classId && data && (
                <>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    {fields &&
                      fields.map((field) => (
                        <ScheduleField
                          key={field.id}
                          id={field.id}
                          onDelete={removeSubject}
                          teachers={data?.getAllTeachers}
                          subjects={data?.getAllSubjects.filter(
                            (subject: Subject) => subject.class?.id === classId,
                          )}
                        />
                      ))}
                  </MuiPickersUtilsProvider>
                  <div className={styles['input-container']}>
                    <Button
                      disableElevation
                      variant="contained"
                      color="secondary"
                      onClick={addSubject}
                    >
                      <AddOutlined />
                    </Button>
                  </div>
                </>
              )}
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
      </ScheduleContext.Provider>
    </>
  );
};

export default AddSchedule;
