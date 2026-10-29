import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import responseTime from 'response-time';
import path from 'path';
import fs from 'fs';
import morgan from 'morgan';

export const createApp = () => {
    const app = express();

    const allowedOrigins = process.env.ALLOWED_ORIGINS
        ?.split(',')
        .map((origin) => origin.trim())
        .filter(Boolean) ?? ['http://localhost:5173'];

    app.use(cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
    }))

    app.use(cookieParser());
    app.use(responseTime());
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());

    if (process.env.NODE_ENV !== 'test') {
        // app.use(globalLimiter);
    }

    if (process.env.NODE_ENV !== 'test') {
        const logDir = path.join(__dirname, '../logs');
        if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);
        const logFile = fs.createWriteStream(path.join(__dirname, '../logs/request.log'), { flags: 'a' });
        app.use(morgan('combined', { stream: logFile }));
    }

    app.get('/', (_, res) => {
        res.json({ api: "Printer Dashboard", status: "Ok" });
    });

    return app;
}