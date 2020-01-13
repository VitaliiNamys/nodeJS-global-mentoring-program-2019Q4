import { Request, Response } from 'express';
import uuid from 'uuid';
import { User } from '../common/types';
import { success, noContent, notFound } from '../common/response-utils';

const users: User[] = [];

export const create = (req: Request, res: Response) => {
    const { login, password, age } = req.body;

    const newUser: User = {
        id: uuid(),
        login,
        password,
        age,
        isDeleted: false
    };

    users.push(newUser);

    success(res, newUser);
};

export const update = (req: Request, res: Response) => {
    const { id } = req.params;
    const { login, password, age } = req.body;

    const indexOfUser = users.findIndex(user => user.id === id);

    if (indexOfUser >= 0) {
        const updatedUser = {
            ...users[indexOfUser],
            login,
            password,
            age
        };

        success(res, updatedUser);
    } else {
        notFound(res, { error_description: `User with id ${id} does not exist` });
    }
};

export const findById = (req: Request, res: Response) => {
    const { id } = req.params;

    const user = users.find(item => item.id === id);

    if (user) {
        success(res, user);
    } else {
        notFound(res, { error_description: `User with id ${id} does not exist` });
    }
};

export const findAll = (req: Request, res: Response) => {
    const { limit, loginSubstring } = req.query;

    const result = users
        .filter(user => user.login.includes(loginSubstring))
        .sort((a, b) => {
            if (a.login > b.login) {
                return 1;
            } else if (b.login > a.login) {
                return -1;
            }
            return 0;
        })
        .slice(0, limit);

    success(res, result);
};

export const remove = (req: Request, res: Response) => {
    const { id } = req.params;

    const indexOfUser = users.findIndex(user => user.id === id);

    if (indexOfUser >= 0) {
        users[indexOfUser].isDeleted = true;

        noContent(res);
    } else {
        notFound(res, { error_description: `User with id ${id} does not exist` });
    }
};
