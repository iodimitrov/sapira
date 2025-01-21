import { useEffect } from 'react';
import Head from 'next/head';
import Navbar from 'components/Navbar';
import { Container, Divider } from '@material-ui/core';
import { useRouter } from 'next/router';
import Loader from 'components/Loader';
import styles from '~/styles/Index.module.scss';
import {
  MouseOutlined,
  ArrowDownwardOutlined,
  PeopleAltOutlined,
  SchoolOutlined,
  DoneOutlineOutlined,
} from '@material-ui/icons';
import { useAuth } from '../hooks/useAuth';

const Index = () => {
  const router = useRouter();
  const { user, status } = useAuth();

  useEffect(() => {
    if (status === 'DONE') {
      router.push('/dashboard');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, status]);

  if (status === 'FETCHING') {
    return <Loader />;
  }

  return (
    <>
      <Head>
        <title>Sapira - Училищен асистент</title>
      </Head>
      <Container className="main-container" maxWidth={false} disableGutters>
        <Navbar title="Sapira" />
        <div className={styles.content}>
          <section className={`${styles.section} ${styles['hero-section']}`}>
            <div className={styles['quote-container']}>
              <span className={styles.quote}>
                Система за управление на основни учебни процеси.
              </span>
            </div>
            <div className={styles['scroll-container']}>
              <MouseOutlined />
              <ArrowDownwardOutlined />
            </div>
          </section>
          <section className={`${styles.section} ${styles['feature-section']}`}>
            <div className={styles['feature-container']}>
              <div className={styles['text-container']}>
                <span className={styles.subheader}>Свържете се бързо</span>
                <span className={styles.header}>
                  Пряка връзка между родители, ученици и учители
                </span>
                <ul className={styles.features}>
                  <Divider orientation="vertical" absolute />
                  <li>
                    Учителите оптимално могат да редактират досието на ученик
                  </li>
                  <li>
                    Учениците може да следят своите оценки, разписания и
                    предмети
                  </li>
                </ul>
              </div>
              <div className={styles['icons-container']}>
                <PeopleAltOutlined />
              </div>
            </div>
            <div
              className={`${styles['feature-container']} ${styles.reversed}`}
            >
              <div className={styles['text-container']}>
                <span className={styles.subheader}>
                  Използвайте безпроблемно
                </span>
                <span className={styles.header}>
                  Лесен за използване потребителски интерфейс
                </span>
                <ul className={styles.features}>
                  <Divider orientation="vertical" absolute />
                  <li>Интерфейсът може да се използва от всички</li>
                  <li>
                    За разработването на Sapira са използвани най-модерните
                    технологии
                  </li>
                </ul>
              </div>
              <div className={styles['icons-container']}>
                <DoneOutlineOutlined />
              </div>
            </div>
            <div className={styles['feature-container']}>
              <div className={styles['text-container']}>
                <span className={styles.subheader}>Мултитенант система</span>
                <span className={styles.header}>
                  Нашата система работи с множество училища
                </span>
                <ul className={styles.features}>
                  <Divider orientation="vertical" absolute />
                  <li>Отворена платформа за Вашето училище</li>
                  <li>
                    Защитено управление на учители, родители и ученици от
                    администратори
                  </li>
                </ul>
              </div>
              <div className={styles['icons-container']}>
                <SchoolOutlined />
              </div>
            </div>
          </section>
        </div>
      </Container>
    </>
  );
};

export default Index;
