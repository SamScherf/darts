const { spawn } = require('child_process');

const startSubProject = (command, args, options, name) => {
    const process = spawn(command, args, options);

    process.stdout.on('data', (data) => {
        console.log(`[${name}] ${data}`);
    });

    process.stderr.on('data', (data) => {
        console.error(`[${name} ERROR] ${data}`);
    });

    process.on('close', (code) => {
        console.log(`[${name}] process exited with code ${code}`);
    });

    return process;
};

const startFrontend = () => {
    console.log('Starting frontend...');
    return startSubProject('npm', ['start'], { cwd: './frontend', shell: true }, 'Frontend');
};

const startBackend = () => {
    console.log('Starting backend...');
    return startSubProject('npm', ['start'], { cwd: './backend', shell: true }, 'Backend');
};

// Start both projects
const frontend = startFrontend();
const backend = startBackend();

// Handle process termination gracefully
const cleanup = () => {
    console.log('Shutting down...');
    frontend.kill('SIGINT');
    backend.kill('SIGINT');
    process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
