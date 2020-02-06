import Joi from '@hapi/joi';
import { Request, Response, NextFunction } from 'express';
import { badRequest } from '../common/response-utils';

export const middleware = (schema: Joi.Schema, property: Property) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error }: { error: Joi.ValidationError } = schema.validate(req[property]);

        if (error) {
            const message = error.details.map((i: any) => i.message).join(',');

            return badRequest(res, { code: error.name, description: message });
        }

        next();
    };
};

type Property = 'params' | 'query' | 'body';
