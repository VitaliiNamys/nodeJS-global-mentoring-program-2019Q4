import { UserGroup } from '../models/userGroup.model';
import Database from '../common/db';

export class UserService {

    public async addUsersToGroup(groupId: string, usersIds: string[]): Promise<void | never> {
        const db = new Database().database;
        const t = await db.transaction();

        try {

            await UserGroup.bulkCreate(
                usersIds.map(userId => ({ groupId, userId })),
                { transaction: t },
            );

            await t.commit();

        } catch (error) {
            await t.rollback();

            throw error;
        }
    }
}
