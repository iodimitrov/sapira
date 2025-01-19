import { DataSource } from 'typeorm';
import getConfig from './orm.config';

const datasource = new DataSource(getConfig());
datasource.initialize();
export default datasource;
