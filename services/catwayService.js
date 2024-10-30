const Catway = require('../models/Catway');

/**
 * Get all catways.
 * @function getAllCatways
 * @returns {Promise<Array>} List of catways.
 */
exports.getAllCatways = async () => {
  try {
    return await Catway.find().select('number type state');
  } catch (error) {
    throw new Error('Error fetching catways: ' + error.message);
  }
};

/**
 * Get a specific catway by ID.
 * @function getCatwayById
 * @param {string} id - The ID of the catway.
 * @returns {Promise<Object>} The requested catway.
 */
exports.getCatwayById = async (id) => {
  try {
    return await Catway.findById(id);
  } catch (error) {
    throw new Error('Error fetching catway: ' + error.message);
  }
};

/**
 * Create a new catway.
 * @function createCatway
 * @param {Object} catwayData - The data for the new catway.
 * @returns {Promise<Object>} The created catway.
 */
exports.createCatway = async (catwayData) => {
  const newCatway = new Catway(catwayData);
  return await newCatway.save();
};

/**
 * Update a specific catway by ID.
 * @function updateCatway
 * @param {string} id - The ID of the catway to update.
 * @param {Object} catwayData - The new data for the catway.
 * @returns {Promise<Object>} The updated catway.
 */
exports.updateCatway = async (id, catwayData) => {
  return await Catway.findByIdAndUpdate(id, catwayData, { new: true });
};

/**
 * Delete a specific catway by ID.
 * @function deleteCatway
 * @param {string} id - The ID of the catway to delete.
 * @returns {Promise<Object>} The deleted catway.
 */
exports.deleteCatway = async (id) => {
  return await Catway.findByIdAndDelete(id);
};

/**
 * Partially update a specific catway by ID.
 * @function patchCatway
 * @param {string} id - The ID of the catway to update.
 * @param {Object} catwayData - The new data for the catway.
 * @returns {Promise<Object>} The updated catway.
 */
exports.patchCatway = async (id, catwayData) => {
  const catway = await Catway.findById(id);
  if (!catway) return null;

  if (catwayData.number) catway.number = catwayData.number;
  if (catwayData.type) catway.type = catwayData.type;
  if (catwayData.state) catway.state = catwayData.state;
  
  return await catway.save();
};
