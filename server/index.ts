import express from 'express';
import path from 'path';
import http from 'http';
import https from 'https';
import requestLogger from 'morgan';
import cors from 'cors';
import { routes } from './routes';
import { createLogger, stackLogger } from 'info-logger';

export const logger = createLogger('Error', 'log-result');

const app = express();
const port = 4000;

let appUrl: any = '';

if (process.env.NODE_ENV) {
  appUrl = process.env.NODE_ENV.match('development')
    ? `http://localhost:${process.env.PORT || port}` : process.env.PRODUCTION_URL;
}

app.use(cors());
app.use(requestLogger('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(routes);

app.use(express.static(path.join(__dirname, '../build')));

app.use((_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

app.listen(process.env.PORT || port, () => {
  logger.info(`Server started on port: ${process.env.PORT || port}`);
  logger.info(`App: ${appUrl}`);
});

const httpProtocol = process.env.NODE_ENV.match('development') ? http : https;

setInterval(() => {
  (() => {
    httpProtocol.get(`${appUrl}/harvard-arts/healthCheck`, () => {});
  })();
}, 1000 * 10 * 60);

process.on('unhandledRejection', (reason) => {
  stackLogger(reason);
});

process.on('uncaughtException', (reason) => {
  stackLogger(reason);
  process.exit(0);
});

process.on('SIGTERM', () => {
  process.exit(0);
});

export default app;
