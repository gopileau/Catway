const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const user = new User({ name, email, password });
        await user.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid email or password' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

       
        const token = jwt.sign({ userId: user._id }, config.get('jwtSecret'), { expiresIn: '1h' });
        console.log('Token généré:', token);
        
        res.json({ token }); 
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



exports.refreshToken = (req, res) => {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token required' });
    }
    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
        const newToken = jwt.sign({ userId: decoded.userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token: newToken });
    } catch (error) {
        res.status(403).json({ message: 'Invalid refresh token' });
    }
};

exports.getUserEmail = async (req, res) => {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'ID utilisateur invalide' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
        res.json({ email: user.email });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};