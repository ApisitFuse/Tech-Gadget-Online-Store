const { Model, DataTypes } = require("sequelize");
const {User} = require("./UserLogin");
const {Product} = require("./Product");
const sequelize = require("../config/database");


class Wishlist extends Model {}

Wishlist.init({
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
  modelName: 'Wishlist',
  tableName: 'wishlists',
  schema: 'tech_gadget_online_store',
});

class WishlistProduct extends Model {}

WishlistProduct.init({
  wishlistId: {
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
}, {
  sequelize,
  modelName: 'WishlistProduct',
  tableName: 'wishlist_products',
  schema: 'tech_gadget_online_store',

});

User.hasMany(Wishlist, { foreignKey: 'userId' });
Wishlist.belongsTo(User, { foreignKey: 'userId' });

Wishlist.belongsToMany(Product, { through: WishlistProduct, foreignKey: 'wishlistId' });
Product.belongsToMany(Wishlist, { through: WishlistProduct, foreignKey: 'productId' });

module.exports = {Wishlist, WishlistProduct};
