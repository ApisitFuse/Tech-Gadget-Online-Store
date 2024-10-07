const { Model, DataTypes } = require("sequelize");
const { Product } = require("./Product");
const { Payment } = require("./Payment");
const { User } = require("./UserLogin");
const sequelize = require("../config/Database");


class Cart extends Model { }

Cart.init({
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    dateAdd: {
        type: DataTypes.DATE,
        allowNull: false,
        DefualtValue: DataTypes.NOW,
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    productId: {
        type: DataTypes.INTEGER,
        references: {
            model: Product,
            key: 'id',
        },
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    paymentId: {
        type: DataTypes.INTEGER,
        references: {
            model: Payment,
            key: 'id',
        },
        allowNull: true,
        // onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
}, {
    sequelize,
    modelName: 'Cart',
    tableName: 'carts',
    schema: 'tech_gadget_online_store',
});

Product.hasMany(Cart, { foreignKey: 'productId' });
Cart.belongsTo(Product, { foreignKey: 'productId' });

User.hasMany(Cart, { foreignKey: 'userId' });
Cart.belongsTo(User, { foreignKey: 'userId' });

Payment.hasMany(Cart, { foreignKey: 'paymentId' });
Cart.belongsTo(Payment, { foreignKey: 'paymentId' });

module.exports = { Cart };
