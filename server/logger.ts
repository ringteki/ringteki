import * as winston from 'winston';
import 'winston-daily-rotate-file';

const rotate = new winston.transports.DailyRotateFile({
    filename: __dirname + '/logs/ringteki',
    datePattern: '-yyyy-MM-dd.log',
    json: false,
    zippedArchive: true
});

export const logger = winston.createLogger({
    transports: [new winston.transports.Console(), rotate],
    format: winston.format.timestamp()
});
