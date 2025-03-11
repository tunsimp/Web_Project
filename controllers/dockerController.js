// controllers/dockerController.js

const Docker = require('dockerode');
const docker = new Docker({ socketPath: '\\\\.\\pipe\\docker_engine' });
const net = require('net');
const pool = require('../config/db');

// Helper: Check if a port is in use
async function isPortInUse(port) {
  return new Promise((resolve, reject) => {
    const server = net.createServer()
      .on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          resolve(true);
        } else {
          reject(err);
        }
      })
      .on('listening', () => {
        server.close();
        resolve(false);
      })
      .listen(port);
  });
}

// Helper: Find a random free port
async function getAvailablePort(minPort = 10000, maxPort = 65535) {
  let randomPort = Math.floor(Math.random() * (maxPort - minPort + 1)) + minPort;
  
  while (await isPortInUse(randomPort)) {
    console.log(`Port ${randomPort} is in use, retrying...`);
    randomPort = Math.floor(Math.random() * (maxPort - minPort + 1)) + minPort;
  }

  return randomPort;
}

async function deleteContainer(containerId) {
  const container = docker.getContainer(containerId);
  await container.stop();
  await container.remove();
  console.log(`Container ${containerId} deleted`);
}

// (Optional) Service function if you want to keep container creation separate
async function createContainerWithRandomPort(imageName) {
  const randomPort = await getAvailablePort();

  // Create the container with a random port binding
  const container = await docker.createContainer({
    Image: imageName,
    HostConfig: {
      PortBindings: {
        '5000/tcp': [
          { HostPort: randomPort.toString() }
        ]
      }
    }
  });

  // Start the container
  await container.start();
  const containerId = container.id;
  // Log and return the random port assigned
  console.log(`Container created from image ${imageName} on port: ${randomPort}`);
  return { randomPort, containerId };
}

exports.deleteContainer = async (req, res) => {
  if(req.session.containerId !== ''){
    await deleteContainer(req.session.containerId);
    req.session.containerId = '';
  }
  res.redirect('/');
}
// Controller method called from the route
exports.createContainerController = async (req, res) => {
  const { imageName } = req.params;
  if(req.session.containerId !== ''){
    await deleteContainer(req.session.containerId);
  }
  if (!imageName) {
    return res.status(400).json({ error: 'Image name is required' });
  }

  try {
    const {randomPort,containerId} = await createContainerWithRandomPort(imageName);
    req.session.containerId = containerId;
    res.status(200).json({
      message: `Container created successfully from image: ${imageName}`,
      randomPort
    });
  } catch (error) {
    console.error('Error creating container:', error);
    res.status(500).json({ error: 'Failed to create or start container' });
  }
};
