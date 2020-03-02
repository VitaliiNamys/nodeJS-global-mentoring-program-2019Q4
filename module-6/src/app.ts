import express, { Application, Request, Response, Router } from "express";
import { internalError, notFound } from './common/response-utils';
import { Routes } from "./routes";
import { middleware as loggerMiddleware } from './middlewares/logger';
import { Logger } from './common/logger';

class App {
  public app: Application;
  public routes: Routes;
  public router: Router;
  public logger: Logger;

  constructor() {
    this.app = express();
    this.router = express.Router();
    this.routes = new Routes();
    this.logger = new Logger();
    this.routes.userRoutes(this.router);
    this.routes.groupRoutes(this.router);
    this.config();
  }

  private config(): void {
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());

    this.app.use('/', loggerMiddleware(), this.router);
    this.app.use('*', (req: Request, res: Response) => {
      const { path, method, params, query, body } = req;

      this.logger.write('Info', { path, method, params, query, body });

      notFound(res, { description: 'Such route is not processed by this server' });
    });
    this.app.use((err: any, req: Request, res: Response) => {
      this.logger.write('Error', err.stack);

      internalError(res);
    });

    process.on('uncaughtException', err => {
      this.logger.write('Error', err);
    });
  }
}

export default new App().app;