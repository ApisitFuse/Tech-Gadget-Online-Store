const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const { User, Address, Delivery_status } = require("./UserLogin");

class Payment_method extends Model {}

Payment_method.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Payment_method",
    tableName: "payment_methods",
    schema: "tech_gadget_online_store",
  }
);

class Payment extends Model {}

Payment.init(
  {
    totalPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    addressId: {
      type: DataTypes.INTEGER,
      references: {
        model: Address,
        key: "id",
      },
      allowNull: false,
      // onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    pay_methodId: {
      type: DataTypes.INTEGER,
      references: {
        model: Payment_method,
        key: "id",
      },
      allowNull: false,
      // onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  },
  {
    sequelize,
    modelName: "Payment",
    tableName: "payments",
    schema: "tech_gadget_online_store",
  }
);

class Receipt extends Model {}

Receipt.init(
  {
    RID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sellerAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    invoiceDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    vat: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    delivery_statusId: {
      type: DataTypes.INTEGER,
      references: {
        model: Delivery_status,
        key: "id",
      },
      allowNull: false,
      // onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
      allowNull: false,
      // onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    paymentId: {
      type: DataTypes.INTEGER,
      references: {
        model: Payment,
        key: "id",
      },
      allowNull: false,
      // onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  },
  {
    sequelize,
    modelName: "Receipt",
    tableName: "receipts",
    schema: "tech_gadget_online_store",
  }

);

class User_history extends Model {}

User_history.init({
  UHID: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  receiptId: {
    type: DataTypes.INTEGER,
    references: {
      model: Receipt,
      key: 'id',
    },
    allowNull: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
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
}, {
  sequelize,
  modelName: 'User_history',
  tableName: 'user_historys',
  schema: 'tech_gadget_online_store',
});

Payment_method.hasMany(Payment, { foreignKey: "pay_methodId" });
Payment.belongsTo(Payment_method, { foreignKey: "pay_methodId" });

User.hasOne(User_history, { foreignKey: 'userId' });
User_history.belongsTo(User, { foreignKey: 'userId' });

Address.hasMany(Payment, { foreignKey: "addressId" });
Payment.belongsTo(Address, { foreignKey: "addressId" });

User.hasMany(Receipt, { foreignKey: "userId" });
Receipt.belongsTo(User, { foreignKey: "userId" });

Payment.hasOne(Receipt, { foreignKey: "paymentId" });
Receipt.belongsTo(Payment, { foreignKey: "paymentId" });

Delivery_status.hasMany(Receipt, { foreignKey: "delivery_statusId" });
Receipt.belongsTo(Delivery_status, { foreignKey: "delivery_statusId" });

Receipt.hasOne(User_history, { foreignKey: 'receiptId' });
User_history.belongsTo(Receipt, { foreignKey: 'receiptId' });

module.exports = { Receipt, Payment, Payment_method, User_history };
