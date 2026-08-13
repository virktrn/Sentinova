const { DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const { sequelize } = require("../config/db");

const User = sequelize.define(
    "User",
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },

        name: {
            type: DataTypes.STRING(150),
            allowNull: false,
            validate: {
                len: [2, 150],
            },
        },

        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },

        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },

        role: {
            type: DataTypes.ENUM(
                "admin",
                "editor",
                "reader"
            ),
            defaultValue: "reader",
        },
    },
    {
        tableName: "users",
        timestamps: true,

        indexes: [
            {
                unique: true,
                fields: ["email"],
            },
        ],
    }
);

User.beforeCreate(async (user) => {
    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(
        user.password,
        salt
    );
});

User.beforeUpdate(async (user) => {
    if (user.changed("password")) {
        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(
            user.password,
            salt
        );
    }
});

User.prototype.comparePassword = function (
    candidate
) {
    return bcrypt.compare(
        candidate,
        this.password
    );
};

module.exports = User;