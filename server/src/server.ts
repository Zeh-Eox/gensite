import express, { Request, Response } from 'express';
import cors from "cors";
import dotenv from "dotenv"
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth.js';

dotenv.config()

const app = express();

const corsOptions = {
    origin: process.env.TRUSTED_ORIGINS?.split(',') || [],
    credentials: true
}

app.use(cors(corsOptions));
app.use(express.json());

app.all('/api/auth/{*any}', toNodeHandler(auth))

app.get('/', (_: Request, res: Response) => {
    res.send('Server is Live!');
});

export default app;