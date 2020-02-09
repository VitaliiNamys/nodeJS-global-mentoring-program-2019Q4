import Joi from '@hapi/joi';
import { Permisson } from '../../types'

const validPermissions: Permisson[] = ['READ', 'DELETE', 'SHARE', 'WRITE', 'UPLOAD_FILES'];

export const pathParamsIdSchema: Joi.Schema = Joi.object().keys({
    id: Joi.string().uuid().required()
});

export const queryParamsFindAllUsersSchema: Joi.Schema = Joi.object().keys({
    limit: Joi.number().default(20),
    loginSubstring: Joi.string().default(null)
});

export const validateUserSchema: Joi.Schema = Joi.object().keys({
    login: Joi.string().required(),
    password: Joi.string().alphanum().required(),
    age: Joi.number().min(4).max(120).required(),
});

export const validateGroupSchema: Joi.Schema = Joi.object().keys({
    name: Joi.string().required(),
    permissions: Joi.array().items(Joi.string().valid(...validPermissions)).required(),
    users: Joi.array().items(Joi.string().uuid()).min(1).default(null),
});

