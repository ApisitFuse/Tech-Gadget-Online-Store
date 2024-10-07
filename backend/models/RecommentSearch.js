const { Model, DataTypes } = require("sequelize");
const { User } = require("./UserLogin");
const { Product } = require("./Product");
const sequelize = require("../config/Database");


class Search extends Model { }

Search.init(
  {
    keyWord: {
      type: DataTypes.STRING,
      allowNull: false,
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
  },
  {
    sequelize,
    modelName: "Search",
    tableName: "searchs",
    schema: "tech_gadget_online_store",
  }

);

class Recomment extends Model { }

Recomment.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
      allowNull: false,
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    ProductId: {
      type: DataTypes.INTEGER,
      references: {
        model: Product,
        key: "id",
      },
      allowNull: false,
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  },
  {
    sequelize,
    modelName: "Recomment",
    tableName: "recomments",
    schema: "tech_gadget_online_store",
  }
);

User.hasMany(Search, { foreignKey: "userId" });
Search.belongsTo(User, { foreignKey: "userId" });

User.belongsToMany(Product, { through: Recomment, foreignKey: 'userId' });
Product.belongsToMany(User, { through: Recomment, foreignKey: 'productId' });

module.exports = { Search, Recomment };
