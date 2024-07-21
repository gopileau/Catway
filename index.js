const { spawn } = require('child_process');

const ps = spawn('powershell.exe', ['-Command', 'Get-ChildItem']);

ps.stdout.on('data', (data) => {
    console.log(`stdout:\n${data.toString()}`);
});

ps.stderr.on('data', (data) => {
    console.error(`stderr:\n${data.toString()}`);
});

ps.on('error', (error) => {
    console.error(`Erreur lors du lancement de PowerShell : ${error}`);
});

ps.on('close', (code) => {
    console.log(`Le processus enfant s'est terminé avec le code ${code}`);
});



