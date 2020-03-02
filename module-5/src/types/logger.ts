export type LogLevels = 'Info' | 'Debug' | 'Warning' | 'Error';

export interface LogMessage {
    methodName?: string;
    logLevel: LogLevels;
    time: Date;
    metaData: object
}
