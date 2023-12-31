import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {ConfigurationSecurity} from '../config/seguridad.config';

console.log(process.env.CONNECTION_STRING_MONGODB);

const config = {
  name: 'mongodb',
  connector: 'mongodb',
  url: ConfigurationSecurity.mongodbConnectionString,
  host: 'localhost',
  port: 27017,
  user: '',
  password: '',
  database: 'seguridad_viajes',
  useNewUrlParser: true,
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class MongodbDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = 'mongodb';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.mongodb', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
