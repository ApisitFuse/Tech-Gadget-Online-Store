const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const { Receipt } = require("./Payment");

class Order extends Model {}

Order.init(
  {
    OID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    receiptId: {
      type: DataTypes.INTEGER,
      references: {
        model: Receipt,
        key: "id",
      },
      allowNull: false,
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  },
  {
    sequelize,
    modelName: "Order",
    tableName: "orders",
    schema: "tech_gadget_online_store",
  }
);

Receipt.hasMany(Order, { foreignKey: "receiptId" });
Order.belongsTo(Receipt, { foreignKey: "receiptId" });

module.exports = { Order };
