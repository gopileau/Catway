const User = require('../models/User');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

/**
 * Crée un nouvel utilisateur.
 * @param {Object} userData - Les données de l'utilisateur à créer.
 * @returns {Promise<Object>} L'utilisateur créé.
 */
exports.createUser  = async (userData) => {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = new User({ ...userData, password: hashedPassword });
    return await user.save();
};

/**
 * Récupère un utilisateur par son email.
 * @param {string} email - L'email de l'utilisateur à récupérer.
 * @returns {Promise<Object|null>} L'utilisateur trouvé ou null.
 */
exports.getUserByEmail = async (email) => {
    return await User.findOne({ email });
};

/**
 * Récupère un utilisateur par son ID.
 * @param {string} userId - L'ID de l'utilisateur à récupérer.
 * @returns {Promise<Object|null>} L'utilisateur trouvé ou null.
 */
exports.getUserById = async (userId) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('ID utilisateur invalide');
    }
    return await User.findById(userId);
};

/**
 * Met à jour un utilisateur par son ID.
 * @param {string} userId - L'ID de l'utilisateur à mettre à jour.
 * @param {Object} updateData - Les données à mettre à jour.
 * @returns {Promise<Object|null>} L'utilisateur mis à jour ou null.
 */
exports.updateUser  = async (userId, updateData) => {
    return await User.findByIdAndUpdate(userId, updateData, { new: true });
};

/**
 * Supprime un utilisateur par son ID.
 * @param {string} userId - L'ID de l'utilisateur à supprimer.
 * @returns {Promise<Object|null>} L'utilisateur supprimé ou null.
 */
exports.deleteUser  = async (userId) => {
    return await User.findByIdAndDelete(userId);
};