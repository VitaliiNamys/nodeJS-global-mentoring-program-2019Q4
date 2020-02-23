import { Request, Response, NextFunction } from 'express';
import { Logger } from '../common/logger';

export const middleware = () => {
    return (req: Request, res: Response, next: NextFunction) => {
        const logger = new Logger();

        const { path, method, params, query, body } = req;

        logger.write('Info', { path, method, params, query, body });

        next();
    };
};
