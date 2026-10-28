require('dotenv').config({ quiet: true });
process.env.NODE_CONFIG_DIR ||= require('node:path').resolve(__dirname, '../config')
import config from 'config'
import express, { NextFunction, Request, Response } from 'express'
import authRouter from './routes/auth.routes'
import commentRouter from './routes/comment.routes'
import globalRouter from './routes/global.routes'
import likeRouter from './routes/like.routes'
import postRouter from './routes/post.routes'
import profileRouter from './routes/profile.routes'
import subRouter from './routes/subscription.routes'
import userRouter from './routes/user.routes'
import AppError from './utils/appError'
import redisClient, { connectRedis } from './utils/connectRedis'
import { publicDirectory, prepareUploads } from './utils/uploads'
import { AppDataSource } from './utils/data-source'
import validateEnv from './utils/validateEnv'
import morgan = require('morgan')
import cookieParser = require('cookie-parser')
import cors = require('cors')
import { MulterError } from 'multer'

AppDataSource.initialize()
  .then(async () => {
    // Validate env
    validateEnv();
    await connectRedis()
    await prepareUploads()

    const app = express();

    // MIDDLEWARE
    app.use(express.static(publicDirectory))
    
    // 1. Body parser
    app.use(express.json())
    app.use(express.urlencoded({extended: true}))

    // 2. Logger
    if(process.env.NODE_ENV==='development') app.use(morgan('dev'))

    // 3. Cookie Parser
    app.use(cookieParser());

    // 4. Cors
    app.use(
      cors({
        origin: config.get<string>('origin'),
        credentials: true,
      })
    );

    // ROUTES
    app.use('/api/auth', authRouter);
    app.use('/api/users', userRouter);
    app.use('/api/global', globalRouter);
    app.use('/api/posts', postRouter);
    app.use('/api/profile', profileRouter);
    app.use('/api/comments', commentRouter);
    app.use('/api/likes', likeRouter);
    app.use('/api/subscription', subRouter)

    // HEALTH CHECKER
    app.get('/api/healthchecker', async (_, res: Response) => {
      const message = await redisClient.get('try');
      res.status(200).json({
        status: 'success',
        message,
      });
    });

    // UNHANDLED ROUTE
    app.use((req: Request, res: Response, next: NextFunction) => {
      next(new AppError(404, `Route ${req.originalUrl} not found`));
    });

    // GLOBAL ERROR HANDLER
    app.use(
      (error: AppError, req: Request, res: Response, next: NextFunction) => {
        if (error instanceof MulterError) {
          res.status(error.code === 'LIMIT_FILE_SIZE' ? 413 : 400).json({ status: 'fail', message: error.message })
          return
        }
        error.status = error.status || 'error';
        error.statusCode = error.statusCode || 500;

        res.status(error.statusCode).json({
          status: error.status,
          message: error.message,
        });
      }
    );

    const port = config.get<number>('port');

    app.listen(port);

    console.log(`Server started on port: ${port}`);
  })
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
    if (redisClient.isOpen) redisClient.destroy()
    if (AppDataSource.isInitialized) void AppDataSource.destroy()
  });
