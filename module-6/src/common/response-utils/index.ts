import { Response } from 'express';

export const success = (res: Response, body: any) => {
    return res.status(200).json(body);
};

export const noContent = (res: Response) => {
    return res.sendStatus(204);
};

export const notFound = (res: Response, body: any) => {
    body.code = body.code || 'NOT_FOUND';

    return res.status(404).json(body);
};

export const badRequest = (res: Response, body: any) => {
    body.code = body.code || 'VALIDATION_ERROR';

    return res.status(400).json(body);
};

export const internalError = (res: Response) => {
    return res.status(500).json({
        code: 'UNEXPECTED_ERROR',
        description: 'Unexpected error has occurred'
    });
};
