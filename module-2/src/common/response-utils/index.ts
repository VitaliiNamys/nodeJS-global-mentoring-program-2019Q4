import { Response } from 'express';

export const success = (res: Response, body: any) => {
    res.status(200).json(body);
};

export const noContent = (res: Response) => {
    res.sendStatus(204);
};

export const notFound = (res: Response, body: any) => {
    body.error = body.error || 'NOT_FOUND';

    res.status(404).json(body);
};

export const internalError = (res: Response) => {
    res.status(500).json({
        error: 'UNEXPECTED_ERROR',
        error_description: 'Unexpected error has occurred'
    });
};
