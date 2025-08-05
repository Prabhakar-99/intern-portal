const mongoose = require('mongoose');
const Intern = require('./models/intern');

mongoose.connect('mongodb://localhost:27017/internPortal')
  .then(() => {
    console.log('Connected to MongoDB');

    return Intern.create({
      name: 'Admin User',
      username: 'admin',
      password: '1234',
      email: 'admin@example.com',
      skills: ['Management', 'Coordination'],
      role: 'admin'
    });
  })
  .then((doc) => {
    console.log('Admin intern inserted:', doc);
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error('Error:', err);
  });