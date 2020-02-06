import express, { Application, Request, Response, Router } from "express";
import { internalError, notFound } from './common/response-utils';
import { Routes } from "./routes";

class App {
  public app: Application;
  public routes: Routes;
  public router: Router;

  constructor() {
    this.app = express();
    this.router = express.Router();
    this.routes = new Routes();
    this.routes.userRoutes(this.router);
    this.config();
  }

  private config(): void {
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());

    this.app.use('/', this.router);
    this.app.use('*', (req: Request, res: Response) => {
      notFound(res, { description: 'Such route is not processed by this server' });
    });
    this.app.use((err: any, req: Request, res: Response) => {
      if (err) {
        console.log(err.stack);
      }

      internalError(res);
    });
  }
}

export default new App().app;