/**
 * Node.js script to start the Python chunking API server
 * This is used by concurrently to run both React and Python servers
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Path to rag_pipeline directory
const ragPipelinePath = path.join(__dirname, '../../rag_pipeline');
const venvPath = path.join(ragPipelinePath, 'venv');
const apiServerPath = path.join(ragPipelinePath, 'api_server.py');

// Determine Python executable
let pythonCmd;
if (process.platform === 'win32') {
  pythonCmd = path.join(venvPath, 'Scripts', 'python.exe');
} else {
  pythonCmd = path.join(venvPath, 'bin', 'python3');
}

// Check if virtual environment exists
if (!fs.existsSync(venvPath)) {
  console.log('⚠️  Virtual environment not found. Please run setup first.');
  console.log('   cd rag_pipeline && python3 -m venv venv');
  console.log('   source venv/bin/activate && pip install -r requirements_api.txt');
  process.exit(1);
}

// Check if API server exists
if (!fs.existsSync(apiServerPath)) {
  console.log('⚠️  API server not found at:', apiServerPath);
  process.exit(1);
}

// Start the Python API server
console.log('🚀 Starting Python Chunking API on http://localhost:5000');
const pythonProcess = spawn(pythonCmd, [apiServerPath], {
  cwd: ragPipelinePath,
  stdio: 'inherit',
  shell: false
});

pythonProcess.on('error', (error) => {
  console.error('❌ Error starting Python API:', error);
  process.exit(1);
});

pythonProcess.on('exit', (code) => {
  if (code !== 0 && code !== null) {
    console.error(`❌ Python API exited with code ${code}`);
    process.exit(code);
  }
});

// Handle process termination
process.on('SIGINT', () => {
  pythonProcess.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  pythonProcess.kill('SIGTERM');
  process.exit(0);
});

