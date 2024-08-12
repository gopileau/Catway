const mongoose = require('mongoose');
const User = require('./models/User'); 

mongoose.connect('mongodb://localhost:27017/catway-reservation', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const createUser = async () => {
  try {
    const existingUser = await User.findOne({ email: 'testuser@example.com' });

    if (existingUser) {
      console.log('User with email testuser@example.com already exists');
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const newUser = new User({
      name: 'Test User',
      email: 'testuser@example.com',
      password: hashedPassword
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



