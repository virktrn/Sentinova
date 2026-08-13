const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../config/db");

class Article extends Model {}

Article.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },

        title: {
            type: DataTypes.STRING(500),
            allowNull: false,
            validate: {
                len: [5, 500],
            },
        },

        slug: {
            type: DataTypes.STRING(500),
            allowNull: false,
            unique: true,
        },

        summary: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },

        author: {
            type: DataTypes.STRING(255),
            allowNull: false,
            defaultValue: "Sentinova Staff",
        },

        category: {
            type: DataTypes.ENUM(
                "General",
                "World",
                "Business",
                "Technology",
                "Sports",
                "Entertainment",
                "Health"
            ),
            defaultValue: "General",
        },

        image: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },

        publishedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        isPublished: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },

        source_url: {
            type: DataTypes.STRING(500),
            allowNull: true,
            validate: {
                isUrl: true,
            },
        },

        createdAt: {
            type: DataTypes.DATE,
            field: "created_at",
            defaultValue: DataTypes.NOW,
        },

        updatedAt: {
            type: DataTypes.DATE,
            field: "updated_at",
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        modelName: "Article",
        tableName: "articles",
        timestamps: true,

        indexes: [
            {
                fields: ["slug"],
            },
            {
                fields: ["category"],
            },
            {
                fields: ["isPublished"],
            },
            {
                fields: ["created_at"],
            },
        ],
    }
);

module.exports = Article;