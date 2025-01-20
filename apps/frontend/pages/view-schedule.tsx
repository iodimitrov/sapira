import { useEffect, useState } from 'react';
import Head from 'next/head';
import Navbar from 'components/Navbar';
import Drawer from 'components/Drawer';
import { Container, Snackbar } from '@material-ui/core';
import { useRouter } from 'next/router';
import Loader from 'components/Loader';
import styles from '~/styles/ViewSchedule.module.scss';
import useSWR from 'swr';
import { gql } from 'graphql-request';
import Alert from '@material-ui/lab/Alert';

import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
// eslint-disable-next-line import/no-duplicates
import { format, parse, startOfWeek, getDay, set, setDay } from 'date-fns';
// eslint-disable-next-line import/no-duplicates
import { bg } from 'date-fns/locale';
import { useAuth } from '../hooks/useAuth';
import { Schedule } from '@sapira/database';
import { getDayByWord } from '../utils';

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: {
    bg,
  },
});

const ViewSchedule = () => {
  const router = useRouter();
  const { user, status } = useAuth();

  const [error, setError] = useState('');
  const { data } = useSWR([
    gql`
      query ($classId: String!, $teacherId: String!) {
        getAllSchedulesByCriteria(classId: $classId, teacherId: $teacherId) {
          id
          startTime
          endTime
          day
          subject {
            name
          }
          room
        }
      }
    `,
    {
      classId: router.query.classId || '',
      teacherId: router.query.teacherId || '',
    },
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
        <title>Учебна програма &#8226; Sapira</title>
      </Head>
      <Drawer />
      <Container className="main-container" maxWidth={false} disableGutters>
        <Navbar title="Учебна програма" />
        <div className={styles.content}>
          <div className={styles['calendar-container']}>
            {data && (
              <Calendar
                toolbar={false}
                defaultView="week"
                views={['week']}
                localizer={localizer}
                events={
                  data.getAllSchedulesByCriteria &&
                  data.getAllSchedulesByCriteria?.map((event: Schedule) => {
                    const startTime = new Date(event.startTime as Date);
                    const endTime = new Date(event.endTime as Date);
                    return {
                      id: event.id,
                      title: `${event.subject?.name} (${event.room})`,
                      start: setDay(
                        set(new Date(), {
                          hours: startTime.getHours(),
                          minutes: startTime.getMinutes(),
                          seconds: startTime.getSeconds(),
                          milliseconds: startTime.getMilliseconds(),
                        }),
                        getDayByWord(event.day) as number,
                        { weekStartsOn: 1 },
                      ),
                      end: setDay(
                        set(new Date(), {
                          hours: endTime.getHours(),
                          minutes: endTime.getMinutes(),
                          seconds: endTime.getSeconds(),
                          milliseconds: endTime.getMilliseconds(),
                        }),
                        getDayByWord(event.day) as number,
                        { weekStartsOn: 1 },
                      ),
                    };
                  })
                }
                culture="bg"
                startAccessor="start"
                endAccessor="end"
              />
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

export default ViewSchedule;
