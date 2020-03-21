import { Request, Response, NextFunction } from 'express';
import { unauthorized, forbidden } from '../common/response-utils';
import config from '../config';
import jwt from 'jsonwebtoken';

export const middleware = () => {
  return (req: Request, res: Response, next: NextFunction): Response | void => {
    const { authorization: authHeader } = req.headers;

    const token = authHeader && authHeader.split(' ')[0] === 'Bearer' ? authHeader.split(' ')[1] : null;

    if (!token) {
      return unauthorized(res);
    }

    try {
      jwt.verify(token, config.jwtSecret);
    } catch (error) {
      return forbidden(res, { description: 'User is not authorized to access this resource.' })
    }

    next();
  };
};
