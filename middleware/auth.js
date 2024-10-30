const jwt = require('jsonwebtoken');
const config = require('config');

const auth = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Récupérer le token

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, config.get('jwtSecret')); // Vérifier le token
        req.user = decoded; // Ajouter l'utilisateur à la requête
        next(); // Passer au middleware suivant
    } catch (ex) {
        return res.status(400).json({ message: 'Invalid token.' });
    }
};

module.exports = auth;
