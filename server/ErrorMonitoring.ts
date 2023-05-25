import * as Sentry from '@sentry/node';
import config from 'config';

if (config.has('sentryDsn')) {
    Sentry.init({ dsn: config.get('sentryDsn'), tracesSampleRate: 0 });
}

export function captureException(exception: any, extra?: Record<string, unknown>): void {
    Sentry.captureException(exception, { extra });
}

export const requestHandler = Sentry.Handlers.requestHandler();

export const errorHandler = Sentry.Handlers.errorHandler();
