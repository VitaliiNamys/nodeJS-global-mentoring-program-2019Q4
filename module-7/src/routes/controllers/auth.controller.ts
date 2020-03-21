import { success, unauthorized, internalError } from '../../common/response-utils';
import { User } from '../../models/user.model';
import { Group } from '../../models/group.model';
import { UserGroup } from '../../models/userGroup.model';
import { FindOptions } from 'sequelize'
import { Request, Response } from 'express';
import { ICreds } from '../../types';
import { Logger } from '../../common/logger';
import jwt from 'jsonwebtoken';
import config from '../../config';

export class AuthController {
  public logger: Logger = new Logger();

  public async getToken(req: Request, res: Response): Promise<Response> {
    const params: ICreds = req.body;

    const options: FindOptions = {
      where: { login: params.login }
    };
    try {
      const userRecord = await User.findOne<User>(options);

      if (userRecord === null) {
        return unauthorized(res, { description: 'Credentials are invalid. There is no such user.' })
      }

      const currentTime = new Date().getTime();
      const { tokenExpTime, jwtSecret } = config;
      const { id, login }: Partial<User> = userRecord.get();

      const groupsIds = (await UserGroup.findAll({
        where: { userId: id as any },
        attributes: ['groupId'],
      })).map(groupId => groupId.getDataValue('groupId'));

      const groups = (await Group.findAll<Group>({
        where: { id: groupsIds },
        attributes: ['permissions'],
      })).map(group => group.getDataValue('permissions'));

      const userPermissions = new Set(groups.reduce((acc, val) => acc.concat(val), []));

      const tokenMetadata = {
        id,
        login,
        permissions: [ ...userPermissions ],
        exp: currentTime + tokenExpTime,
        iat: currentTime,
      }

      const token = jwt.sign(tokenMetadata, jwtSecret, { algorithm: 'HS256' });

      return success(res, { token });
    } catch (error) {
      this.logger.write('Error', error);

      return internalError(res);
    }
  }

}
