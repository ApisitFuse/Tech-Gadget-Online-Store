const bcrypt = require('bcrypt');
const { Gender, Role, Registration, User } = require('../models/UserLogin');

const seedData = async () => {
  try {
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
      const existingGender = await Gender.findOne({ where: { name: gender.name } });
      if (!existingGender) {
        // ถ้าไม่มี product ให้สร้างใหม่
        await Gender.create(gender);
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
      const existingRole = await Role.findOne({ where: { name: role.name } });
      if (!existingRole) {
        await Role.create(role);
        console.log(`Created role: ${role.name}`);
      } else {
        console.log(`Role already exists: ${role.name}`);
      }
    }

    // ข้อมูล Registration
    const registrations = [
      {
        GID: 'GID001',
        globalName: 'John Doe',
        email: 'john@example.com',
        password: await bcrypt.hash('password123', 10),
        roleId: 1,
      },
      {
        GID: 'GID002',
        globalName: 'Jane Doe',
        email: 'jane@example.com',
        password: await bcrypt.hash('password456', 10),
        roleId: 2,
      },
      {
        GID: 'GID003',
        globalName: 'Alex Smith',
        email: 'alex@example.com',
        password: await bcrypt.hash('password789', 10),
        roleId: 1,
      },
    ];

    // await Registration.bulkCreate(registrations);
    // console.log('Seeded Registration data successfully!');

    for (const registration of registrations) {
      // ตรวจสอบว่า product มีอยู่ในฐานข้อมูลหรือไม่
      const existingRegistration = await Registration.findOne({ where: { email: registration.email } });
      if (!existingRegistration) {
        // ถ้าไม่มี product ให้สร้างใหม่
        await Registration.create(registration);
        console.log(`Created registration: ${registration.email}`);
      } else {
        console.log(`Registration already exists: ${registration.email}`);
      }
    }

    // ข้อมูล User
    const users = [
      {
        profileImage: '01.png',
        firstName: 'John',
        middleName: 'A.',
        lastName: 'Doe',
        genderId: 1,
        registrationId: 1,
      },
      {
        profileImage: '02.png',
        firstName: 'Jane',
        middleName: 'B.',
        lastName: 'Doe',
        genderId: 2,
        registrationId: 2,
      },
      {
        profileImage: '03.jpg',
        firstName: 'Alex',
        middleName: 'C.',
        lastName: 'Smith',
        genderId: 1,
        registrationId: 3,
      },
    ];

    // await User.bulkCreate(users);
    // console.log('Seeded User data successfully!');

    for (const user of users) {
      // ตรวจสอบว่า product มีอยู่ในฐานข้อมูลหรือไม่
      const existingUser = await User.findOne({ where: { firstName: user.firstName } });
      if (!existingUser) {
        // ถ้าไม่มี product ให้สร้างใหม่
        await User.create(user);
        console.log(`Created user: ${user.firstName}`);
      } else {
        console.log(`User already exists: ${user.firstName}`);
      }
    }
  } catch (error) {
    console.error('Error seeding data: ', error);
  }
};

module.exports = seedData;
