import { getVersion, LOG_LEVEL } from 'config';
import log, { LogLevelNames, LogLevelNumbers } from 'loglevel';

const logLevelName = LOG_LEVEL;
const LOG_PREFIX = 'RESOLVE_AI';
const originalFactory = log.methodFactory;

log.info(`${LOG_PREFIX} version ${getVersion()} logging level ${logLevelName}`);
log.setDefaultLevel(logLevelName);

log.methodFactory = (methodName: LogLevelNames, logLevel: LogLevelNumbers, loggerName: string | symbol) => {
  const rawMethod = originalFactory(methodName, logLevel, loggerName);

  return (message: string, attr: object) => {
    const timestamp = new Date().toISOString();
    const msg = `[${timestamp}] [${methodName.toUpperCase()}] [${LOG_PREFIX}]: ${message}`;

    if (attr) {
      rawMethod(msg, attr);
    } else {
      rawMethod(msg);
    }
  };
};

log.setLevel(log.getLevel());

export default log;
