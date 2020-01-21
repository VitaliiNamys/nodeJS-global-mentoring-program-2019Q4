import Joi from '@hapi/joi';
import { Request, Response, NextFunction } from 'express';

export const middleware = (schema: Joi.Schema, property: Property) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error }: { error: Joi.ValidationError } = schema.validate(req[property]);

        if (error) {
            const message = error.details.map((i: any) => i.message).join(',');

            return res.status(400).json({ error: error.name, error_description: message });
        }

        next();
    };
};

type Property = 'params' | 'query' | 'body';
