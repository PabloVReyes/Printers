
import pino from 'pino'

const isDevelopment = process.env.NODE_ENV !== 'production'

export const logger = pino({
    level: process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info'),

    timestamp: pino.stdTimeFunctions.isoTime,

    formatters: {
        level(label) {
            return { level: label.toUpperCase() }
        },
    },

    redact: {
        paths: [
            'password',
            'token',
            'authorization',
            'cookie',
            'community',
            'req.headers.authorization',
        ],
        censor: '[REDACTED]',
    },

    transport: isDevelopment
        ? {
            target: 'pino-pretty',
            options: {
                colorize: true,
                translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
                ignore: 'pid,hostname',
                singleLine: false,
                levelFirst: true,
                messageFormat: '{msg}',
                errorLikeObjectKeys: ['err', 'error'],
            },
        }
        : undefined,
})
