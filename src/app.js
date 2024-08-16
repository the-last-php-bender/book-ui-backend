import express from 'express';
import { listBooks, downloadBook } from './controllers/bookController.js'; 
import { exec } from 'child_process';
import path from 'path';
import os from 'os';
import cors  from 'cors';
import { fileURLToPath } from 'url';
import bookRoutes from './routes/bookRoutes.js'; 

const app = express();
const port = process.env.PORT || 2000;

app.use(express.json());
const corsOptions = {
    origin: '*', // Allow any origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specified HTTP methods
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'ngrok-skip-browser-warning',
      'User-Agent'
    ] 
  };
app.use(cors());

app.use('/api', bookRoutes);

app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
});

process.on('uncaughtException', async (err) => {
    console.error('Uncaught Exception:', err);
    await performCleanup();
    restartApplication();
});

process.on('unhandledRejection', async (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    await performCleanup();
    restartApplication();
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const performCleanup = async () => {
    console.log('Performing cleanup...');
};

const restartApplication = () => {
    const isWindows = os.platform() === 'win32';
    const scriptPath = path.resolve(__dirname, isWindows ? '../restart.bat' : 'restart.sh');

    exec(scriptPath, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing restart script: ${error}`);
            return;
        }
        console.log(`Restart script output: ${stdout}`);
        if (stderr) {
            console.error(`Restart script stderr: ${stderr}`);
        }
    });
};

export default app;
