import { success, noContent, notFound, internalError } from '../../common/response-utils';
import { Group } from '../../models/group.model';
import { User } from '../../models/user.model';
import { UserGroup } from '../../models/userGroup.model';
import { UpdateOptions, DestroyOptions, FindOptions } from 'sequelize'
import { Request, Response } from 'express';
import { IUserDTO } from '../../types';
import { Logger } from '../../common/logger';

export class UsersController {
    public logger: Logger = new Logger();

    public async create(req: Request, res: Response) {
        const params: IUserDTO = req.body;

        try {
            const newUser = await User.create<User>(params);

            return success(res, newUser);
        } catch (error) {
            this.logger.write('Error', error);

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
            this.logger.write('Error', error);

            return internalError(res);
        }
    }

    public async findById(req: Request, res: Response) {
        const { id: userId } = req.params;

        try {
            const user = await User.findByPk<User>(userId);

            if (user) {

                const groupsIds = (await UserGroup.findAll({
                    where: { userId },
                    attributes: ['groupId'],
                })).map(groupId => groupId.getDataValue('groupId'));

                const groups = (await Group.findAll({
                    where: { id: groupsIds },
                })).map(group => group.get());

                const detailedUser = { ...user.get(), groups };

                return success(res, detailedUser);
            } else {
                return notFound(res, { description: `User with id ${userId} does not exist` });
            }
        } catch (error) {
            this.logger.write('Error', error);

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
            this.logger.write('Error', error);

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

            await UserGroup.destroy({
                where: { userId },
            });

            return noContent(res);
        } catch (error) {
            this.logger.write('Error', error);

            return internalError(res);
        }
    }
}
