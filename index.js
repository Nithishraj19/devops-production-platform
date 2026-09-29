const http = require("http");
const client = require("@prometheus-io/client");

const PORT = process.env.PORT || 3000;

// Prometheus metrics
const register = new client.Registry();

client.collectDefaultMetrics({
  register
});

// Custom application metric
const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
  registers: [register]
});

const server = http.createServer(async (req, res) => {
  // Health check
  if (req.url === "/health") {
    httpRequestsTotal.inc({
      method: req.method,
      route: "/health",
      status_code: "200"
    });

    res.writeHead(200, {
      "Content-Type": "application/json"
    });

    res.end(
      JSON.stringify({
        status: "UP",
        service: "devops-production-platform",
        timestamp: new Date().toISOString()
      })
    );

    return;
  }

  // Prometheus metrics endpoint
  if (req.url === "/metrics") {
    httpRequestsTotal.inc({
      method: req.method,
      route: "/metrics",
      status_code: "200"
    });

    res.writeHead(200, {
      "Content-Type": register.contentType
    });

    res.end(await register.metrics());

    return;
  }

  // Application endpoint
  httpRequestsTotal.inc({
    method: req.method,
    route: "/",
    status_code: "200"
  });

  res.writeHead(200, {
    "Content-Type": "application/json"
  });

  res.end(
    JSON.stringify({
      message: "DevOps Production Platform is running",
      version: "1.1.0"
    })
  );
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
