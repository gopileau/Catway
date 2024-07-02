const path = require('path');
const app = require(path.resolve(__dirname, './server'));  // Utilisation du chemin absolu

const config = require('config');
const connectDB = require('./config/db');

const port = process.env.PORT || 5000;

async function startServer() {
    try {
        let mongoURI = config.get('mongoURI');  // Utilisez la même méthode de configuration que dans vos tests
        await connectDB(mongoURI); 
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    }

    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

startServer();


