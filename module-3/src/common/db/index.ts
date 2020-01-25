import { Sequelize } from 'sequelize';
import config from '../../config';

export default class Database {
    url: string;
    database: Sequelize;

    constructor() {
        this.url = config.db.DBUrl || '';

        this.database = new Sequelize(this.url, { dialectOptions: { ssl: true } });

        this.database.authenticate()
            .then(() => {
                console.log('Connection has been established successfully.');
            })
            .catch(err => {
                console.error('Unable to connect to the database:', err);
            });

        this.database.sync({
            // Using 'force' will drop any table defined in the models and create them again.
            // force: true
        });
    }
}
