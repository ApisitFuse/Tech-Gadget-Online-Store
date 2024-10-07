const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/Database");

class Category extends Model { }

Category.init(
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "Category",
        tableName: "categorys",
        schema: "tech_gadget_online_store",
    }
);

class Promotion_type extends Model { }

Promotion_type.init(
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "Promotion_type",
        tableName: "promotion_types",
        schema: "tech_gadget_online_store",
    }
);

class Promotion extends Model { }

Promotion.init(
    {
        piece: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        proName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        dateStart: {
            type: DataTypes.DATE,
            allowNull: false,
            defualtValue: DataTypes.NOW,
        },
        dateEnd: {
            type: DataTypes.DATE,
            allowNull: false,
            defualtValue: DataTypes.NOW,
        },
        percentage: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        Promotion_typeId: {
            type: DataTypes.INTEGER,
            references: {
                model: Promotion_type,
                key: "id",
            },
            allowNull: false,
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        },
    },
    {
        sequelize,
        modelName: "Promotion",
        tableName: "promotions",
        timestamps: true,
        schema: "tech_gadget_online_store",
    }
);

class Product extends Model { }

Product.init(
    {
        productImage: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        productName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "Product",
        tableName: "products",
        schema: "tech_gadget_online_store",
    }
);

class ProductPromotion extends Model { }

ProductPromotion.init(
    {
        productId: {
            type: DataTypes.INTEGER,
            references: {
                model: Product,
                key: "id",
            },
            allowNull: false,
            // onDelete: "CASCADE",
            onUpdate: "CASCADE",
        },
        PromotionId: {
            type: DataTypes.INTEGER,
            references: {
                model: Promotion,
                key: "id",
            },
            allowNull: false,
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        },
    },
    {
        sequelize,
        modelName: "ProductPromotion",
        tableName: "product_promotions",
        schema: "tech_gadget_online_store",
    }
);

class CategoryProduct extends Model { }

CategoryProduct.init(
    {
        categoryId: {
            type: DataTypes.INTEGER,
            references: {
                model: Product,
                key: "id",
            },
            allowNull: false,
            // onDelete: "CASCADE",
            onUpdate: "CASCADE",
        },
        productId: {
            type: DataTypes.INTEGER,
            references: {
                model: Promotion,
                key: "id",
            },
            allowNull: false,
            // onDelete: "CASCADE",
            onUpdate: "CASCADE",
        },
    },
    {
        sequelize,
        modelName: "CategoryProduct",
        tableName: "category_products",
        schema: "tech_gadget_online_store",
    }
);

Promotion_type.hasMany(Promotion, { foreignKey: "promotion_typeId" });
Promotion.belongsTo(Promotion_type, { foreignKey: "promotion_typeId" });

Product.belongsToMany(Promotion, {
    through: ProductPromotion,
    foreignKey: "productId",
});
Promotion.belongsToMany(Product, {
    through: ProductPromotion,
    foreignKey: "promotionId",
});

Category.belongsToMany(Product, {
    through: CategoryProduct,
    foreignKey: "categoryId",
});
Product.belongsToMany(Category, {
    through: CategoryProduct,
    foreignKey: "productId",
});

module.exports = { Product, Category, Promotion_type, Promotion, ProductPromotion, CategoryProduct };
