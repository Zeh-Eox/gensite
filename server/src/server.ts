import express, { Request, Response } from 'express';
import cors from "cors";
import dotenv from "dotenv"

dotenv.config()

const app = express();

const corsOptions = {
    origin: process.env.TRUSTED_ORIGINGS?.split(',') || [],
    credentials: true
}

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Server is Live!');
});

export default app;