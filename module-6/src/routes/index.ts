import { UsersController } from './controllers/users.controller';
import { GroupsController } from './controllers/groups.controller';
import { AuthController } from './controllers/auth.controller';
import { middleware as validate } from '../middlewares/validation';
import { middleware as authMiddleware } from '../middlewares/auth';
import {
    queryParamsFindAllUsersSchema,
    pathParamsIdSchema,
    validateUserSchema,
    validateGroupSchema,
    validateCredsSchema,
} from '../common/validation';
import { Router } from "express";

export class Routes {
    public usersController: UsersController = new UsersController();
    public groupsController: GroupsController = new GroupsController();
    public authController: AuthController = new AuthController();

    public authRoutes(router: Router): void {

        router.route('/auth/token')
            .post(
                validate(validateCredsSchema, 'body'),
                this.authController.getToken,
            );

    }

    public groupRoutes(router: Router): void {

        router.route('/groups')
            .post(
                validate(validateGroupSchema, 'body'),
                this.groupsController.create,
            )
            .get(
                this.groupsController.findAll,
            );

        router.route('/groups/:id')
            .put(
                validate(pathParamsIdSchema, 'params'),
                validate(validateGroupSchema, 'body'),
                this.groupsController.update,
            )
            .get(
                validate(pathParamsIdSchema, 'params'),
                this.groupsController.findById,
            )
            .delete(
                validate(pathParamsIdSchema, 'params'),
                this.groupsController.remove,
            );

        router.all('/groups*', authMiddleware());
    }

    public userRoutes(router: Router): void {

        router.route('/users')
            .post(
                validate(validateUserSchema, 'body'),
                this.usersController.create,
            )
            .get(
                validate(queryParamsFindAllUsersSchema, 'query'),
                this.usersController.findAll,
            );

        router.route('/users/:id')
            .put(
                validate(pathParamsIdSchema, 'params'),
                validate(validateUserSchema, 'body'),
                this.usersController.update,
            )
            .get(
                validate(pathParamsIdSchema, 'params'),
                this.usersController.findById,
            )
            .delete(
                validate(pathParamsIdSchema, 'params'),
                this.usersController.remove,
            );

        router.all('/users*', authMiddleware());
    }
}
