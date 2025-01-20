import {
  SwipeableDrawer,
  IconButton,
  Button,
  Container,
  Typography,
} from '@material-ui/core';
import Link from './Link';
import {
  MeetingRoomOutlined,
  DashboardOutlined,
  DescriptionOutlined,
  CollectionsBookmarkOutlined,
  PeopleAltOutlined,
  EventNote,
} from '@material-ui/icons';
import { useState, useEffect } from 'react';
import styles from '~/styles/Drawer.module.scss';
import { useAuth } from '../hooks/useAuth';

const Drawer = () => {
  const [open, setOpen] = useState<boolean | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    setOpen(!window.matchMedia('(max-width: 730px)').matches);
  }, []);

  return (
    <>
      <div className={`${styles.backdrop} ${open && styles.opened}`}></div>
      <Container
        maxWidth={false}
        disableGutters
        className={`${styles['drawer-container']} ${!open && styles.closed}`}
      >
        <div className={styles['upper-drawer']}>
          <IconButton
            size="small"
            className={styles['drawer-toggle']}
            color="inherit"
            onClick={() => setOpen(!open)}
          >
            <span
              className={`${styles['toggle-line']} ${
                open && styles['toggled']
              }`}
            ></span>
            <span
              className={`${styles['toggle-line']} ${
                open && styles['toggled']
              }`}
            ></span>
            <span
              className={`${styles['toggle-line']} ${
                open && styles['toggled']
              }`}
            ></span>
          </IconButton>
          <Link className={styles.title} underline="none" href="/dashboard">
            <Typography className={styles.text} variant="h4">
              Sapira
            </Typography>
          </Link>
        </div>
        <SwipeableDrawer
          anchor="left"
          className={styles.drawer}
          open
          variant="persistent"
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
        >
          <Link underline="none" className={styles.link} href="/dashboard">
            <Button>
              <DashboardOutlined /> Табло
            </Button>
          </Link>
          <Link underline="none" className={styles.link} href="/calendar">
            <Button>
              <EventNote /> Календар
            </Button>
          </Link>

          {user?.role.toLowerCase() === 'admin' && (
            <Link underline="none" className={styles.link} href="/users">
              <Button>
                <PeopleAltOutlined /> Потребители
              </Button>
            </Link>
          )}
          {(user?.role.toLowerCase() === 'admin' ||
            user?.role.toLowerCase() === 'teacher') && (
            <Link underline="none" className={styles.link} href="/students">
              <Button>
                <PeopleAltOutlined /> Ученици
              </Button>
            </Link>
          )}
          <Link underline="none" className={styles.link} href="/subjects">
            <Button>
              <CollectionsBookmarkOutlined />
              Предмети
            </Button>
          </Link>
          {user?.role.toLowerCase() === 'admin' && (
            <Link underline="none" className={styles.link} href="/classes">
              <Button>
                <MeetingRoomOutlined />
                Класове
              </Button>
            </Link>
          )}
          <Link underline="none" className={styles.link} href="/schedules">
            <Button>
              <DescriptionOutlined />
              {user?.role.toLowerCase() === 'student'
                ? 'Учебна програма'
                : 'Учебни програми'}
            </Button>
          </Link>
          {user?.role.toLowerCase() === 'parent' && (
            <Link underline="none" className={styles.link} href="/grades">
              <Button>
                <DescriptionOutlined /> Оценки
              </Button>
            </Link>
          )}
        </SwipeableDrawer>
      </Container>
    </>
  );
};

export default Drawer;
