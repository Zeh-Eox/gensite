import express, { Request, Response, Express } from 'express';
import cors from "cors";
import dotenv from "dotenv";
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth.js';
import userRouter from './routes/user.routes.js';
import projectRouter from './routes/project.routes.js';

dotenv.config();

const app: Express = express();

const corsOptions = {
    origin: process.env.TRUSTED_ORIGINS?.split(',') || [],
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));


app.all('/api/auth/{*any}', toNodeHandler(auth));

app.get('/', (_: Request, res: Response) => {
    res.send('Server is Live!');
});

app.use('/api/user', userRouter);
app.use('/api/project', projectRouter);


export default app;