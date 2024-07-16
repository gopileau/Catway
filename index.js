const { spawn } = require('child_process');


const ps = spawn('powershell.exe', ['-Command', 'Get-ChildItem']);

ps.stdout.on('data', (data) => {
    console.log(`stdout:\n${data}`);
});

ps.stderr.on('data', (data) => {
    console.error(`stderr:\n${data}`);
});

ps.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
});


