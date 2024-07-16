const mongoose = require('mongoose');
const User = require('./models/User'); // Assurez-vous que le chemin est correct

mongoose.connect('mongodb://127.0.0.1:27017/catway-reservation', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const createUser = async () => {
  try {
    const existingUser = await User.findOne({ email: 'admin@example.com' });

    if (existingUser) {
      console.log('User with email admin@example.com already exists');
      return;
    }

    const newUser = new User({
      name: 'admin',
      email: 'admin@example.com',
      password: 'password'
    });

    await newUser.save();
    console.log('User created successfully');
  } catch (err) {
    console.error('Error creating user:', err);
  } finally {
    mongoose.connection.close();
  }
};

createUser();


