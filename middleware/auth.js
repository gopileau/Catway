const jwt = require('jsonwebtoken');
const config = require('config');

function auth(req, res, next) {
  const token = req.header('Authorization'); // Notez le changement ici

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token.split(' ')[1], config.get('jwtSecret')); // Extraire le token après 'Bearer'
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
}

module.exports = auth;


