const os = require("os");
const process = require("process");

console.log(
  os.platform(), // Platform (e.g., 'linux', 'darwin', 'win32')
  cpuCores,
  os.cpus().length, // Number of CPU cores
  loadAverage,
  os.loadavg(), // Load average (1, 5, 15 minutes)
  freeMemory,
  os.freemem(), // Free system memory
  totalMemory,
  os.totalmem(), // Total system memory
  nodeVersion,
  process.version, // Node.js version
  environment,
  process.env.NODE_ENV, // Environment (production, development, etc.)
  pid,
  process.pid, // Process ID
  hostname,
  os.hostname() // Server hostname
);
