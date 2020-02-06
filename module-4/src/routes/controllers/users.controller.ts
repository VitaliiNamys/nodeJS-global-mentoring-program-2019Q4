import { success, noContent, notFound, internalError } from '../../common/response-utils';
import { User } from '../../models/user.model'
import { UpdateOptions, DestroyOptions, FindOptions } from 'sequelize'
import { Request, Response } from 'express';
import { IUserDTO } from '../../types';

export class UsersController {

    public async create(req: Request, res: Response) {
        const params: IUserDTO = req.body;

        try {
            const newUser = await User.create<User>(params);

            return success(res, newUser);
        } catch (error) {
            return internalError(res);
        }
    }

    public async update(req: Request, res: Response) {
        const { id: userId } = req.params;
        const params: IUserDTO = req.body;

        const options: UpdateOptions = {
            where: { id: userId },
            limit: 1
        }

        try {
            const updatedUser = await User.update<User>(params, options)

            return success(res, updatedUser);
        } catch (error) {
            return internalError(res);
        }
    }

    public async findById(req: Request, res: Response) {
        const { id: userId } = req.params;

        try {
            const user = await User.findByPk<User>(userId);

            if (user) {
                return success(res, user);
            } else {
                return notFound(res, { description: `User with id ${userId} does not exist` });
            }
        } catch (error) {
            return internalError(res);
        }
    }

    public async findAll(req: Request, res: Response) {
        const { limit } = req.query;

        const options: FindOptions = {
            limit: limit,
            order: [
                ['login', 'ASC'],
            ],
        };

        try {
            const users = await User.findAll<User>(options);

            return success(res, users);
        } catch (error) {
            return internalError(res);
        }
    }

    public async remove(req: Request, res: Response) {
        const { id: userId } = req.params;

        const options: DestroyOptions = {
            where: { id: userId },
            limit: 1
        };

        try {
            await User.destroy(options);

            return noContent(res);
        } catch (error) {
            return internalError(res);
        }
    }
}
