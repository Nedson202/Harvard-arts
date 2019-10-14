import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import fs from 'fs';

const { createLogger, transports, format } = winston;

const logPath = 'Logs';

const {
  combine, timestamp, label, printf,
} = format;

const myFormat = printf((info) => `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`); /* eslint-disable-line */

if (!fs.existsSync(logPath)) {
  fs.mkdirSync(logPath);
}

const { NODE_ENV } = process.env;

const logger = createLogger({
  level: NODE_ENV === 'development' ? 'verbose' : 'info',
  format: combine(
    label({ label: 'Logs!' }),
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    myFormat,
  ),
  transports: [
    new transports.Console({
      level: 'info',
      format: format.combine(
        format.colorize(),
        myFormat,
      ),
    }),
    new DailyRotateFile({
      filename: `${logPath}/%DATE%-results.log`,
      datePattern: 'YYYY-MM-DD',
    }),
  ],
});

export default logger;
