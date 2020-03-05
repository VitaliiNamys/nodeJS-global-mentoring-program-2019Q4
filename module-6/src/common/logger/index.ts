
import { LogMessage, LogLevels } from '../../types'

export class Logger {
    public write(logLevel: LogLevels, metaData: object = {}) {

        const params: LogMessage = {
            logLevel,
            time: new Date(),
            metaData,
        };

        console.log(params);
    }
}
