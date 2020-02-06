import { success, noContent, notFound, internalError } from '../../common/response-utils';
import { Group } from '../../models/group.model'
import { UpdateOptions, DestroyOptions } from 'sequelize'
import { Request, Response } from 'express';
import { IGroupDTO } from '../../types';

export class GroupsController {

    public async create(req: Request, res: Response) {
        const params: IGroupDTO = req.body;

        try {
            const newGroup = await Group.create<Group>(params);

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
                return success(res, group);
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

            return noContent(res);
        } catch (error) {
            return internalError(res);
        }
    }
}
