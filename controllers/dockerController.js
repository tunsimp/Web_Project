const Docker = require('dockerode');
const docker = new Docker({ socketPath: '\\\\.\\pipe\\docker_engine' });
const net = require('net');

const isPortInUse = (port) => {
  return new Promise((resolve, reject) => {
    const server = net.createServer()
      .on('error', (err) => {
        // If the port is in use, error will be triggered
        if (err.code === 'EADDRINUSE') {
          resolve(true);
        } else {
          reject(err);
        }
      })
      .on('listening', () => {
        // Port is available, close the server
        server.close();
        resolve(false);
      })
      .listen(port);
  });
};

const getAvailablePort = async (minPort = 10000, maxPort = 65535) => {
  let randomPort = Math.floor(Math.random() * (maxPort - minPort + 1)) + minPort;
  
  while (await isPortInUse(randomPort)) {
    console.log(`Port ${randomPort} is in use, retrying...`);
    randomPort = Math.floor(Math.random() * (maxPort - minPort + 1)) + minPort;
  }

  return randomPort;
};

const createContainerWithRandomPort = async (imageName) => {
  try {
    // Get a random available port
    const randomPort = await getAvailablePort();

    // Create the container with the random port binding
    const container = await docker.createContainer({
      Image: imageName,
      HostConfig: {
        PortBindings: {
          '5000/tcp': [
            {
              HostPort: randomPort.toString() // Bind to random host port
            }
          ]
        }
      }
    });

    // Start the container
    await container.start();

    // Log and return the random port assigned
    console.log(`Container created from image ${imageName} and mapped to random port: ${randomPort}`);
    const url = `http://localhost:${randomPort}`;
    return randomPort;
  } catch (error) {
    console.error('Error creating or starting container:', error);
    throw error;
  }
};

module.exports = { createContainerWithRandomPort };


