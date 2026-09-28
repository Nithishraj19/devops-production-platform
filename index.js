const http = require("http");

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });

    res.end(
      JSON.stringify({
        status: "UP",
        service: "devops-production-platform",
        timestamp: new Date().toISOString()
      })
    );

    return;
  }

  res.writeHead(200, { "Content-Type": "application/json" });

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
