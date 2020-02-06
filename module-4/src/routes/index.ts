import { UsersController } from "./controllers/users.controller";
import { middleware as validate } from '../middlewares/validation';
import {
    queryParamsFindAllUsersSchema,
    pathParamsIdSchema,
    validateUserSchema
} from '../common/validation';
import { Router } from "express";

export class Routes {
    public usersController: UsersController = new UsersController();

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
    }
}
