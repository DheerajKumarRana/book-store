const { spawn } = require('child_process');

const build = spawn('npx', ['next', 'build'], { shell: true });

build.stdout.on('data', (data) => {
    console.log(`STDOUT: ${data}`);
});

build.stderr.on('data', (data) => {
    console.error(`STDERR: ${data}`);
});

build.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
});
