const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/Database");
// const { Receipt } = require("./Payment");

// const User = sequelize.define(
//   "User",
//   {
//     username: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     email: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       unique: true,
//     },
//     password: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//   },
//   {
//     schema: "tech_gadget_online_store", // Assign the correct schema here
//   }
// );

class Status extends Model { }

Status.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Status',
  tableName: 'statuss',
  schema: 'tech_gadget_online_store',
});

class Role extends Model { }

Role.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Role',
  tableName: 'roles',
  schema: 'tech_gadget_online_store',
});

class Gender extends Model { }

Gender.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Gender',
  tableName: 'genders',
  schema: 'tech_gadget_online_store',
});

class Registration extends Model { }

Registration.init({
  GID: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  globalName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  roleId: {
    type: DataTypes.INTEGER,
    references: {
      model: Role,
      key: 'id',
    },
    allowNull: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
}, {
  sequelize,
  modelName: 'Registration',
  tableName: 'registrations',
  schema: 'tech_gadget_online_store',
});

class User extends Model {
  get profileImagePath() {
    const rawValue = this.getDataValue('profileImage');
    return rawValue ? `/uploads/${rawValue}` : null; // สร้าง path ที่สามารถเข้าถึงได้
  }
}

User.init({
  profileImage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  middleName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  genderId: {
    type: DataTypes.INTEGER,
    references: {
      model: Gender,
      key: 'id',
    },
    allowNull: true,
    // onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  registrationId: {
    type: DataTypes.INTEGER,
    references: {
      model: Registration,
      key: 'id',
    },
    allowNull: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  schema: 'tech_gadget_online_store',
});

class Delivery_status extends Model { }

Delivery_status.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true, // Ensure id is a primary key
    autoIncrement: true,
  },
  statusId: {
    type: DataTypes.INTEGER,
    references: {
      model: Status,
      key: 'id',
    },
    allowNull: false,
    // onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
    allowNull: false,
    // onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
}, {
  sequelize,
  modelName: 'Delivery_status',
  tableName: 'delivery_status',
  schema: 'tech_gadget_online_store',
});

class Address extends Model { }

Address.init({
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  street: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subDistrict: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  district: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  province: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  postalCode: {
    type: DataTypes.INTEGER,
    allowNull: false,
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
  modelName: 'Address',
  tableName: 'addresss',
  schema: 'tech_gadget_online_store',
});

Registration.hasOne(User, { foreignKey: 'registrationId' });  // User มี 1 Profile
User.belongsTo(Registration, { foreignKey: 'registrationId' });  // Profile เชื่อมกับ User

Role.hasMany(Registration, { foreignKey: 'roleId' });
Registration.belongsTo(Role, { foreignKey: 'roleId' });

Gender.hasMany(User, { foreignKey: 'genderId' });
User.belongsTo(Gender, { foreignKey: 'genderId' });

User.hasOne(Address, { foreignKey: 'userId' });
Address.belongsTo(User, { foreignKey: 'userId' });

Status.belongsToMany(User, { through: Delivery_status, foreignKey: 'statusId' });
User.belongsToMany(Status, { through: Delivery_status, foreignKey: 'userId' });

module.exports = { User, Role, Delivery_status, Address, Gender, Registration, Status };
