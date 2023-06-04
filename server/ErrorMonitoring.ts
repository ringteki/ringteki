import * as Sentry from '@sentry/node';
import * as env from './env.js';

if (env.sentryDsn) {
    Sentry.init({ dsn: env.sentryDsn, tracesSampleRate: 0 });
}

export function captureException(exception: any, extra?: Record<string, unknown>): void {
    Sentry.captureException(exception, { extra });
}

export const requestHandler = Sentry.Handlers.requestHandler();

export const errorHandler = Sentry.Handlers.errorHandler();
