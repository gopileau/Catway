const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // Assurez-vous que le chemin vers le modèle est correct

mongoose.connect('mongodb://127.0.0.1:27017/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const createUser = async () => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('password', salt);

  const user = new User({
    email: 'admin@example.com',
    password: hashedPassword
    // Le champ `name` est retiré si non requis
  });

  await user.save();
  console.log('User created');
  mongoose.connection.close();
};

createUser();
