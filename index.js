const { spawn } = require('child_process');
const connectDB = require('./config/db');

const ls = spawn('ls');

ls.stdout.on('data', (data) => {
    console.log(`stdout:\n${data}`);
});

ls.stderr.on('data', (data) => {
    console.log(`stderr:\n${data}`);
});

ls.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
});



