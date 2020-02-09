import { Model, DataTypes } from "sequelize";
import Database from "../common/db";
import uuid from 'uuid';

export class UserGroup extends Model {
    public id!: string;
    public groupId!: string;
    public userId!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

UserGroup.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: () => uuid(),
        },
        groupId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
    },
    {
        tableName: 'UserGroup',
        sequelize: new Database().database,
    }
);
