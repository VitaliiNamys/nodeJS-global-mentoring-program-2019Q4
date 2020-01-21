import express from 'express';
import { middleware as validate } from './middlewares/validation';
import {
    queryParamsFindAllUsersSchema,
    pathParamsIdSchema,
    validateUserSchema
} from './common/validation';
import * as users from './handlers/users';
import { internalError, notFound } from './common/response-utils';
import config from './config';

const app = express();
const router = express.Router();

const port = config.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

router.route('/users')
    .post(validate(validateUserSchema, 'body'), users.create)
    .get(validate(queryParamsFindAllUsersSchema, 'query'), users.findAll);

router.route('/users/:id')
    .put(validate(pathParamsIdSchema, 'params'), validate(validateUserSchema, 'body'), users.update)
    .get(validate(pathParamsIdSchema, 'params'), users.findById)
    .delete(validate(pathParamsIdSchema, 'params'), users.remove);

app.use('/', router);
app.use('*', (req: express.Request, res: express.Response) => {
    notFound(res, { error_description: 'Such route is not processed by this server' });
});
app.use((err: any, req: express.Request, res: express.Response) => {
    if (err) {
        console.log(err.stack);
    }

    internalError(res);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
