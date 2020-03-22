import { AuthController } from '../auth.controller';
import * as resUtils from '../../../common/response-utils';
import * as UserModel from '../../../models/user.model';
import * as GroupModel from '../../../models/group.model';
import * as UserGroupModel from '../../../models/userGroup.model';
import config from '../../../config';
import jwt from 'jsonwebtoken';

jest.mock('../../../common/logger');
jest.mock('../../../common/response-utils');
jest.mock('../../../models/user.model');
jest.mock('../../../models/group.model');
jest.mock('../../../models/userGroup.model');
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mockedToken'),
}));

const { User } = UserModel;
const { Group } = GroupModel;
const { UserGroup } = UserGroupModel;

(resUtils.unauthorized as any) = jest.fn();
(resUtils.internalError as any) = jest.fn();
(resUtils.success as any) = jest.fn();

describe('Auth controller', () => {
  let instance: AuthController;

  const reqMock: any = { body: { login: 'login' } };
  const resMock: any = {};

  const userMock: any = {
    get: () => ({
      id: '2119d165-4245-4a7f-aa8a-00919c23a433',
      login: 'mockedLogin',
      password: 'mockedPassword',
      age: '99',
    }),
  };

  const groupMock: any = {
    getDataValue: () => ['READ', 'WRITE', 'DELETE'],
  };

  const userGroupMock: any = {
    getDataValue: () => 'groupId',
  };

  const currTimeMock = 1584885976174;
  const currTimeObjectMock: any = new Date(currTimeMock)

  beforeAll(() => {
    instance = new AuthController();

    jest.spyOn(global, 'Date').mockImplementation(() => currTimeObjectMock);
  });

  beforeEach(() => {
    jest.clearAllMocks();

    User.findOne = jest.fn().mockResolvedValue(userMock);
    UserGroup.findAll = jest.fn().mockResolvedValue([userGroupMock]);
    Group.findAll = jest.fn().mockResolvedValue([groupMock]);
  });


  test('Should find user record in DB with correct options', async () => {
    await instance.getToken(reqMock, resMock);

    const options: any = {
      where: { login: reqMock.body.login },
    };

    expect(User.findOne).toBeCalledTimes(1);
    expect(User.findOne).toBeCalledWith(options);
  });

  test('Should find all userGroups records in DB that related to current user', async () => {
    await instance.getToken(reqMock, resMock);

    const options: any = {
      where: { userId: userMock.get().id as any },
      attributes: ['groupId'],
    };

    expect(UserGroup.findAll).toBeCalledTimes(1);
    expect(UserGroup.findAll).toBeCalledWith(options);
  });

  test('Should find all groups records in DB that related to current user', async () => {
    await instance.getToken(reqMock, resMock);

    const options: any = {
      where: { id: [userGroupMock.getDataValue()] as any },
      attributes: ['permissions'],
    };

    expect(Group.findAll).toBeCalledTimes(1);
    expect(Group.findAll).toBeCalledWith(options);
  });

  test('Should generate jwt token from user metadata', async () => {
    const tokenMetadata = {
      id: userMock.get().id,
      login: userMock.get().login ,
      permissions: groupMock.getDataValue(),
      exp: currTimeMock + config.tokenExpTime,
      iat: currTimeMock,
    };

    await instance.getToken(reqMock, resMock);

    expect(jwt.sign).toBeCalledTimes(1);
    expect(jwt.sign).toBeCalledWith(tokenMetadata, config.jwtSecret, { algorithm: 'HS256' });
  });

  test('Should call success(), when jwt token successfully generated', async () => {
    await instance.getToken(reqMock, resMock);

    expect(resUtils.success).toHaveBeenCalledTimes(1);
    expect(resUtils.success).toHaveBeenCalledWith(resMock, { token: 'mockedToken' });
  });

  test('Should call unauthorized(), when there is no such user in DB', async () => {
    User.findOne = jest.fn().mockResolvedValueOnce(null);

    await instance.getToken(reqMock, resMock);

    expect(resUtils.unauthorized).toHaveBeenCalledTimes(1);
    expect(resUtils.unauthorized).toHaveBeenCalledWith(resMock, { description: 'Credentials are invalid. There is no such user.' });
  });

  test('Should call internalError(), when ', async () => {
    User.findOne = jest.fn().mockRejectedValueOnce(new Error());

    await instance.getToken(reqMock, resMock);

    expect(resUtils.internalError).toHaveBeenCalledTimes(1);
    expect(resUtils.internalError).toHaveBeenCalledWith(resMock);
  });
});