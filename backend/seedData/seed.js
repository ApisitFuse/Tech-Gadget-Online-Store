const bcrypt = require('bcrypt');
require('dotenv').config();
const sequelize = require("../config/Database");
const { Gender, Role, Registration, User } = require('../models/UserLogin');

const seedData = async () => {
  try {

    // เริ่มต้น transaction
    const transaction = await sequelize.transaction();

    // ข้อมูล Gender
    const genders = [
      { name: 'Male' },
      { name: 'Female' },
      { name: 'Other' },
    ];

    // สร้างข้อมูล Gender
    // await Gender.bulkCreate(genders);
    // console.log('Seeded Gender data successfully!');

    for (const gender of genders) {
      // ตรวจสอบว่า product มีอยู่ในฐานข้อมูลหรือไม่
      const existingGender = await Gender.findOne({ where: { name: gender.name }, transaction });
      if (!existingGender) {
        // ถ้าไม่มี product ให้สร้างใหม่
        await Gender.create(gender, { transaction });
        console.log(`Created gender: ${gender.name}`);
      } else {
        console.log(`Gender already exists: ${gender.name}`);
      }
    }

    // ข้อมูล Role
    const roles = [
      { name: 'Super Admin' },
      { name: 'Admin' },
      { name: 'Seller' },
      { name: 'Customer' },
    ];

    // await Role.bulkCreate(roles);
    // console.log('Seeded Role data successfully!');

    for (const role of roles) {
      // ตรวจสอบว่า product มีอยู่ในฐานข้อมูลหรือไม่
      const existingRole = await Role.findOne({ where: { name: role.name }, transaction });
      if (!existingRole) {
        await Role.create(role, { transaction });
        console.log(`Created role: ${role.name}`);
      } else {
        console.log(`Role already exists: ${role.name}`);
      }
    }

    const password = process.env.SEED_PASS
    if (!password) {
      throw new Error('SEED_PASS is not defined in .env');
    }
    
    const registrations = [
      {
        GID: 'G00',
        globalName: 'L',
        email: 'l@gmail.com',
        password: await bcrypt.hash(password, 10),
        roleId: 1,
        user: {
          profileImage: '01.png',
          firstName: 'L.',
          middleName: null,
          lastName: 'Lawliet',
          genderId: 1,
        },
      },
      {
        GID: 'G01',
        globalName: 'Near',
        email: 'near@gmail.com',
        password: await bcrypt.hash(password, 10),
        roleId: 2,
        user: {
          profileImage: '02.png',
          firstName: 'Nate',
          middleName: null,
          lastName: 'River',
          genderId: 2,
        },
      },
      {
        GID: 'G02',
        globalName: 'Mello',
        email: 'm@gmail.com',
        password: await bcrypt.hash(password, 10),
        roleId: 3,
        user: {
          profileImage: '03.jpg',
          firstName: 'Mihael',
          middleName: null,
          lastName: 'Keehl',
          genderId: 1,
        },
      },
    ];

    for (const registrationData of registrations) {
      // ตรวจสอบว่า Registration มีอยู่ในฐานข้อมูลหรือไม่
      const existingRegistration = await Registration.findOne({ where: { email: registrationData.email }, transaction });
      if (!existingRegistration) {
        // สร้าง Registration ใหม่
        const newRegistration = await Registration.create({
          GID: registrationData.GID,
          globalName: registrationData.globalName,
          email: registrationData.email,
          password: registrationData.password,
          roleId: registrationData.roleId,
        }, { transaction });

        // สร้าง User ใหม่ที่สัมพันธ์กับ Registration นั้น ๆ
        await User.create({
          profileImage: registrationData.user.profileImage,
          firstName: registrationData.user.firstName,
          middleName: registrationData.user.middleName,
          lastName: registrationData.user.lastName,
          genderId: registrationData.user.genderId,
          registrationId: newRegistration.id, // เชื่อมโยงกับ registrationId
        }, { transaction });

        console.log(`Created registration and user for: ${registrationData.email}`);
      } else {
        console.log(`Registration already exists: ${registrationData.email}`);
      }
    }

    // Commit transaction เมื่อทุกอย่างสำเร็จ
    await transaction.commit();
    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding data: ', error);
  }
};

module.exports = seedData;
