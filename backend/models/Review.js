const { Model, DataTypes } = require("sequelize");
const {User} = require("./UserLogin");
const {Product} = require("./Product");
const sequelize = require("../config/database");


class Review extends Model {}

Review.init({
  point: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  review: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  reviewDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defualtValue: DataTypes.NOW,
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
    allowNull: true,
    // onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  productId: {
    type: DataTypes.INTEGER,
    references: {
      model: Product,
      key: 'id',
    },
    allowNull: false,
    // onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
}, {
  sequelize,
  modelName: 'Review',
  tableName: 'reviews',
  schema: 'tech_gadget_online_store',
});

User.hasMany(Review, { foreignKey: 'userId' });
Review.belongsTo(User, { foreignKey: 'userId' });

Product.hasMany(Review, { foreignKey: 'productId' });
Review.belongsTo(Product, { foreignKey: 'productId' });

module.exports = {Review};
