import express from 'express';
import arts from './artRoutes';
import { errorHandler } from '../utils';

const app = express();

app.use('/harvard-arts', arts);
app.use(errorHandler);

export default app;
