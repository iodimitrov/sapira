import { FunctionComponent } from 'react';
import { CircularProgress, Container } from '@material-ui/core';
import styles from '~/styles/Loader.module.scss';

const Loader: FunctionComponent = () => {
  return (
    <>
      <Container maxWidth={false} className={styles.content} disableGutters>
        <CircularProgress />
      </Container>
    </>
  );
};

export default Loader;
