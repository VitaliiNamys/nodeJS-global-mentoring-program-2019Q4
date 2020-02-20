import { success, noContent, notFound, internalError } from '../../common/response-utils';
import { Group } from '../../models/group.model';
import { User } from '../../models/user.model';
import { UserGroup } from '../../models/userGroup.model';
import { UpdateOptions, DestroyOptions } from 'sequelize';
import { Request, Response } from 'express';
import { IGroupDTO } from '../../types';
import { UserService } from '../../services/userService';

export class GroupsController {

    public async create(req: Request, res: Response) {
        const params: IGroupDTO = req.body;

        const userService: UserService = new UserService();

        try {
            const newGroup = await Group.create<Group>(params);

            const groupId = newGroup.getDataValue('id');

            if (params.users && params.users.length > 0) {
                await userService.addUsersToGroup(groupId, params.users);
            }

            return success(res, newGroup);
        } catch (error) {
            return internalError(res);
        }
    }

    public async update(req: Request, res: Response) {
        const { id: groupId } = req.params;
        const params: IGroupDTO = req.body;

        const options: UpdateOptions = {
            where: { id: groupId },
            limit: 1
        }

        try {
            const updatedGroup = await Group.update<Group>(params, options)

            return success(res, updatedGroup);
        } catch (error) {
            return internalError(res);
        }
    }

    public async findById(req: Request, res: Response) {
        const { id: groupId } = req.params;

        try {
            const group = await Group.findByPk<Group>(groupId);

            if (group) {

                const usersIds = (await UserGroup.findAll({
                    where: { groupId: groupId },
                    attributes: ['userId'],
                })).map(userId => userId.getDataValue('userId'));

                const users = (await User.findAll({
                    where: { id: usersIds },
                })).map(user => user.get());

                const detailedGroup = { ...group.get(), users };

                return success(res, detailedGroup);
            } else {
                return notFound(res, { description: `Group with id ${groupId} does not exist` });
            }
        } catch (error) {
            return internalError(res);
        }
    }

    public async findAll(req: Request, res: Response) {

        try {
            const groups = await Group.findAll<Group>();

            return success(res, groups);
        } catch (error) {
            return internalError(res);
        }
    }

    public async remove(req: Request, res: Response) {
        const { id: groupId } = req.params;

        const options: DestroyOptions = {
            where: { id: groupId },
            limit: 1
        };

        try {
            await Group.destroy(options);

            await UserGroup.destroy({
                where: { groupId },
            });

            return noContent(res);
        } catch (error) {
            return internalError(res);
        }
    }
}
