import { Model, DataTypes } from "sequelize";
import Database from "../common/db";
import uuid from 'uuid';
import { Permisson } from '../types';

export class Group extends Model {
    public id!: string;
    public name!: string;
    public permissions!: Permisson[];
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Group.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: () => uuid(),
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        permissions: {
            type: DataTypes.ARRAY({ type: DataTypes.STRING }),
            allowNull: false,
        },
    },
    {
        tableName: 'Groups',
        sequelize: new Database().database,
    }
);
