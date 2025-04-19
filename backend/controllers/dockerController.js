// controllers/dockerController.js

const Docker = require("dockerode");
const docker = new Docker({ socketPath: "\\\\.\\pipe\\docker_engine" });
const net = require("net");
const pool = require("../config/db");

// Helper: Check if a port is in use
async function isPortInUse(port) {
  return new Promise((resolve, reject) => {
    const server = net
      .createServer()
      .on("error", (err) => {
        if (err.code === "EADDRINUSE") {
          resolve(true);
        } else {
          reject(err);
        }
      })
      .on("listening", () => {
        server.close();
        resolve(false);
      })
      .listen(port);
  });
}

// Helper: Find a random free port
async function getAvailablePort(minPort = 10000, maxPort = 65535) {
  let randomPort =
    Math.floor(Math.random() * (maxPort - minPort + 1)) + minPort;
  while (await isPortInUse(randomPort)) {
    console.log(`Port ${randomPort} is in use, retrying...`);
    randomPort = Math.floor(Math.random() * (maxPort - minPort + 1)) + minPort;
  }
  return randomPort;
}

async function deleteContainer(containerId) {
  if (!containerId) {
    console.log("No container ID provided for deletion.");
  }
  const container = docker.getContainer(containerId);
  await container.stop();
  await container.remove();
  console.log(`Container ${containerId} deleted`);
}

async function getExposedPorts(imageName) {
  try {
    const image = docker.getImage(imageName);
    const imageInfo = await image.inspect();
    const exposedPorts = imageInfo.Config.ExposedPorts; // e.g., { '5000/tcp': {} }
    console.log("Exposed Ports:", exposedPorts);
    return exposedPorts;
  } catch (err) {
    console.error("Error inspecting image:", err);
    throw err;
  }
}

// (Optional) Service function if you want to keep container creation separate
async function createContainer(imageName) {
  // Retrieve the exposed ports from the image configuration
  const exposedPorts = await getExposedPorts(imageName);
  const exposedPortKeys = Object.keys(exposedPorts);

  if (exposedPortKeys.length === 0) {
    throw new Error("No exposed ports found in the image.");
  }

  // Choose one of the exposed ports (for example, the first one)
  const portKey = exposedPortKeys[0];

  // Create the container with dynamic host port assignment for the chosen port
  const container = await docker.createContainer({
    Image: imageName,
    HostConfig: {
      PortBindings: {
        [portKey]: [
          { HostPort: "0" }, // Let Docker assign an available host port dynamically
        ],
      },
    },
  });

  // Start the container
  await container.start();
  // Inspect the container to retrieve the dynamically assigned host port
  const info = await container.inspect();
  const hostPort = info.NetworkSettings.Ports[portKey][0].HostPort;
  const containerId = container.id;

  console.log(`Container created from image ${imageName} on port: ${hostPort}`);

  setTimeout(async () => {
    try {
      const container = docker.getContainer(containerId);
      let containerInfo;
      try {
        containerInfo = await container.inspect();
      } catch (inspectError) {
        // If the container no longer exists, log and exit the TTL callback.
        if (inspectError.statusCode === 404) {
          console.log(
            `Container ${containerId} no longer exists; skipping TTL removal.`
          );
          return;
        }
        // Re-throw other errors
        throw inspectError;
      }

      // Only attempt to stop the container if it is still running
      if (containerInfo.State.Running) {
        await deleteContainer(containerId);
      }
      // Attempt to remove the container; if it's already removed, this may error out,
      // so we catch that error too.
    } catch (err) {
      console.error(`Error handling TTL for container ${containerId}:`, err);
    }
  }, 30000); // TTL of 30 seconds
  return { hostPort, containerId };
}

exports.deleteContainer = async (req, res) => {
  if (req.cookies.containerId !== "") {
    await deleteContainer(req.cookies.containerId);
    req.cookies.containerId = "";
  }
  res.send(`
    <html>
      <head>
        <script>
          window.close();
        </script>
      </head>
      <body>
        <p>Container deleted. Closing window...</p>
      </body>
    </html>
  `);
};
// Controller method called from the route
exports.createContainerController = async (req, res) => {
  const labName = req.labName; // Set by getLabName
  const existingContainerId = req.containerId; // Set by checkAuth

  if (!labName) {
    return res.status(400).json({ error: "Lab name is required" });
  }

  try {
    if (existingContainerId && existingContainerId !== "") {
      await deleteContainer(existingContainerId);
    }

    const { hostPort, containerId: newContainerId } = await createContainer(
      labName
    );

    // Set the containerId as a cookie using res.cookie
    res.cookie("containerId", newContainerId, { httpOnly: true });
    const lab_link = `http://localhost:${hostPort}`;
    // Return JSON instead of redirecting
    return res.status(200).json({
      success: true,
      lab_link,
      containerId: newContainerId,
    });
  } catch (error) {
    console.error("Error creating container:", error.message);
    return res
      .status(500)
      .json({ error: "Failed to create or start container" });
  }
};
