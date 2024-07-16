// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../models/User');

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      console.log(`Invalid email: ${email}`);
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log(`Password mismatch for email: ${email}`);
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      config.get('jwtSecret'),
      { expiresIn: 3600 },
      (err, token) => {
        if (err) {
          console.error('JWT error:', err);
          throw err;
        }
        res.json({ token });
      }
    );
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
