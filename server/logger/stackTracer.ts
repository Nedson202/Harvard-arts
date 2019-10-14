
import logger from './logger';

const stackTracer = (reason: any): object => {
  return logger.error(`${reason.stack}\n`);
};

export default stackTracer;
