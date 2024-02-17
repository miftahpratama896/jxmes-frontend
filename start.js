const { exec } = require('child_process');

const child = exec('npm start', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
});

child.on('exit', (code) => {
  console.log(`Child process exited with code ${code}`);
});
