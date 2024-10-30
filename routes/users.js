const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../models/User');
const auth = require('../middleware/auth');
const mongoose = require('mongoose'); 

// @route   POST api/users
// @desc    Register a new user
// @access  Public
router.post('/', async (req, res) => {
  try {
      const newUser  = new User(req.body);
      const savedUser  = await newUser .save();

      // Renvoie l'ID de l'utilisateur créé
      res.status(201).json({
          message: 'Utilisateur créé avec succès',
          userId: savedUser ._id // Renvoie l'ID de l'utilisateur créé
      });
  } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      res.status(500).json({ message: 'Erreur serveur' });
  }
});
router.use((req, res, next) => {
  const token = req.headers['authorization'];
  console.log('Token reçu:', token); // Log le token
  next();
});

// @route   PUT api/users/:id
// @desc    Update user details
// @access  Private
// Exemple de mise à jour d'un utilisateur
router.put('/:id', async (req, res) => {
  const userId = req.params.id;

  // Vérification de l'ID
  if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'ID utilisateur invalide' });
  }

  // Optionnel : Validation des données d'entrée
  // const { error } = userSchema.validate(req.body);
  // if (error) return res.status(400).json({ message: error.details[0].message });

  try {
      const user = await User.findByIdAndUpdate(userId, req.body, { new: true });
      if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
      
      res.status(200).json({ message: 'Utilisateur mis à jour avec succès', user });
  } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
      res.status(500).send('Erreur serveur');
  }
});



// @route   DELETE api/users/:id
// @desc    Delete a user
// @access  Private
router.delete('/:id', async (req, res) => {
  const userId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'ID utilisateur invalide' });
  }

  try {
      const user = await User.findByIdAndDelete(userId);
      if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé.' });
      res.json({ message: 'Utilisateur supprimé avec succès.' });
  } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      res.status(500).json({ error: error.message });
  }
});


router.patch('/:id', auth, async (req, res) => {
  try {
    const { name, email } = req.body; 
    let user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    // Mettre à jour les informations de l'utilisateur
    user.name = name || user.name; 
    user.email = email || user.email; 
    await user.save(); 

    res.json({ message: 'User updated', user });
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /users/:id/edit
// @desc    Render the edit user form
// @access  Private (ou Public selon tes besoins)
router.get('/', async (req, res) => {
  try {
      const users = await User.find(); 
      res.json(users);
  } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error); 
      res.status(500).json({ error: error.message });
  }
});



router.get('/', auth, async (req, res) => { 
  try {
      const users = await User.find();
      res.json(users);
  } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      res.status(500).json({ error: error.message });
  }
});
module.exports = router;
