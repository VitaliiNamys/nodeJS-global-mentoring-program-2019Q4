import { UsersController } from '../users.controller';
import * as resUtils from '../../../common/response-utils';
import * as UserModel from '../../../models/user.model';
import * as GroupModel from '../../../models/group.model';
import * as UserGroupModel from '../../../models/userGroup.model';
import config from '../../../config';

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

(resUtils.internalError as any) = jest.fn();
(resUtils.success as any) = jest.fn();

describe('Users controller', () => {
  let instance: UsersController;

  const reqMock: any = {
    body: {
      login: 'mockedLogin',
      password: 'mockedPassword',
      age: '99',
    },
    params: {
      id: '2119d165-4245-4a7f-aa8a-00919c23a433',
    },
    query: {
      limit: 100,
    },
  };
  const resMock: any = {};

  const userMock: any = {
    get: () => ({
      id: '2119d165-4245-4a7f-aa8a-00919c23a433',
      ...reqMock.body,
    }),
  };

  const groupMock: any = {
    get: () => ({
      name: 'mockedGroupName',
      permissions: ['WRITE', 'READ'],
      users: ['userId1', 'userId2'],
    }),
  };

  const userGroupMock: any = {
    getDataValue: () => 'groupId',
  };

  beforeAll(() => {
    instance = new UsersController();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Create', () => {
    beforeEach(() => {
      User.create = jest.fn().mockResolvedValueOnce(userMock);
    });

    test('Should create user record in DB', async () => {
      await instance.create(reqMock, resMock);

      expect(User.create).toBeCalledTimes(1);
      expect(User.create).toBeCalledWith(reqMock.body);
    });

    test('Should call success() when user created successfully', async () => {
      await instance.create(reqMock, resMock);

      expect(resUtils.success).toBeCalledTimes(1);
      expect(resUtils.success).toBeCalledWith(resMock, userMock);
    });

    test('Should call internalError() when smth went wrong', async () => {
      User.create = jest.fn().mockRejectedValueOnce(new Error());

      await instance.create(reqMock, resMock);

      expect(resUtils.internalError).toBeCalledTimes(1);
      expect(resUtils.internalError).toBeCalledWith(resMock);
    });
  });

  describe('Update', () => {
    beforeEach(() => {
      User.update = jest.fn().mockResolvedValueOnce(userMock);
    });

    test('Should update user record in DB', async () => {
      await instance.update(reqMock, resMock);

      const options: any = {
        where: { id: reqMock.params.id },
        limit: 1,
      };

      expect(User.update).toBeCalledTimes(1);
      expect(User.update).toBeCalledWith(reqMock.body, options);
    });

    test('Should call success() when user updated successfully', async () => {
      await instance.update(reqMock, resMock);

      expect(resUtils.success).toBeCalledTimes(1);
      expect(resUtils.success).toBeCalledWith(resMock, userMock);
    });

    test('Should call internalError() when smth went wrong', async () => {
      User.update = jest.fn().mockRejectedValueOnce(new Error());

      await instance.update(reqMock, resMock);

      expect(resUtils.internalError).toBeCalledTimes(1);
      expect(resUtils.internalError).toBeCalledWith(resMock);
    });
  });

  describe('FindById', () => {
    beforeEach(() => {
      User.findByPk = jest.fn().mockResolvedValueOnce(userMock);
      UserGroup.findAll = jest.fn().mockResolvedValueOnce([userGroupMock]);
      Group.findAll = jest.fn().mockResolvedValueOnce([groupMock]);
    });

    test('Should find user by id in DB', async () => {
      await instance.findById(reqMock, resMock);

      expect(User.findByPk).toBeCalledTimes(1);
      expect(User.findByPk).toBeCalledWith(reqMock.params.id);
    });

    test('Should find userGroup records in DB', async () => {
      await instance.findById(reqMock, resMock);

      const options: any = {
        where: { userId: reqMock.params.id },
        attributes: ['groupId'],
      };

      expect(UserGroup.findAll).toBeCalledTimes(1);
      expect(UserGroup.findAll).toBeCalledWith(options);
    });

    test('Should find group records of current user in DB', async () => {
      await instance.findById(reqMock, resMock);

      const options: any = {
        where: { id: [userGroupMock.getDataValue()] },
      };

      expect(Group.findAll).toBeCalledTimes(1);
      expect(Group.findAll).toBeCalledWith(options);
    });

    test('Should call success() if user was founded in DB', async () => {
      await instance.findById(reqMock, resMock);

      const detailedUser: any = {
        groups: [
          groupMock.get(),
        ],
        ...userMock.get(),
      };

      expect(resUtils.success).toBeCalledTimes(1);
      expect(resUtils.success).toBeCalledWith(resMock, detailedUser);
    });

    test('Should call notFound() if there is no such user in DB', async () => {
      User.findByPk = jest.fn().mockResolvedValueOnce(null);

      await instance.findById(reqMock, resMock);

      expect(resUtils.notFound).toBeCalledTimes(1);
      expect(resUtils.notFound).toBeCalledWith(resMock, { description: `User with id ${reqMock.params.id} does not exist` });
    });

    test('Should call internalError() when smth went wrong', async () => {
      User.findByPk = jest.fn().mockRejectedValueOnce(new Error());

      await instance.findById(reqMock, resMock);

      expect(resUtils.internalError).toBeCalledTimes(1);
      expect(resUtils.internalError).toBeCalledWith(resMock);
    });
  });

  describe('FindAll', () => {
    beforeEach(() => {
      User.findAll = jest.fn().mockResolvedValueOnce([userMock]);
    });

    test('Should find all users in DB', async () => {
      await instance.findAll(reqMock, resMock);

      const options: any = {
        limit: reqMock.query.limit,
        order: [
          ['login', 'ASC'],
        ],
      };

      expect(User.findAll).toBeCalledTimes(1);
      expect(User.findAll).toBeCalledWith(options);
    });

    test('Should call success() with list of users', async () => {
      await instance.findAll(reqMock, resMock);

      expect(resUtils.success).toBeCalledTimes(1);
      expect(resUtils.success).toBeCalledWith(resMock, [userMock]);
    });

    test('Should call internalError() when smth went wrong', async () => {
      User.findAll = jest.fn().mockRejectedValueOnce(new Error());

      await instance.findAll(reqMock, resMock);

      expect(resUtils.internalError).toBeCalledTimes(1);
      expect(resUtils.internalError).toBeCalledWith(resMock);
    });
  });

  describe('Remove', () => {
    beforeEach(() => {
      User.destroy = jest.fn();
      UserGroup.destroy = jest.fn();
    });

    test('Should remove user record in DB', async () => {
      await instance.remove(reqMock, resMock);

      const options: any = {
        where: { id: reqMock.params.id },
        limit: 1,
      };

      expect(User.destroy).toBeCalledTimes(1);
      expect(User.destroy).toBeCalledWith(options);
    });

    test('Should remove userGroup record in DB', async () => {
      await instance.remove(reqMock, resMock);

      const options: any = {
        where: { userId: reqMock.params.id },
      };

      expect(UserGroup.destroy).toBeCalledTimes(1);
      expect(UserGroup.destroy).toBeCalledWith(options);
    });

    test('Should call noContent() when user data removed successfully', async () => {
      await instance.remove(reqMock, resMock);

      expect(resUtils.noContent).toBeCalledTimes(1);
      expect(resUtils.noContent).toBeCalledWith(resMock);
    });

    test('Should call internalError() when smth went wrong', async () => {
      User.destroy = jest.fn().mockRejectedValueOnce(new Error());

      await instance.remove(reqMock, resMock);

      expect(resUtils.internalError).toBeCalledTimes(1);
      expect(resUtils.internalError).toBeCalledWith(resMock);
    });
  });

});
