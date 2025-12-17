import express, { type Application } from 'express';
import routes from './routes';
import middleware from './middleware';

export const app: Application = express();

// all middlewares must be called before all routes
middleware(app);

// all routes
routes(app);