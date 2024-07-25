const WebSocket = require("ws");

const server = new WebSocket.Server({ port: 3000 }, () => {
  console.log("Chat server running on port 3000");
});

const clients = new Map();

server.on("connection", (ws) => {
  const id = generateUniqueId();
  ws.id = id;
  clients.set(ws, id);

  console.log("New client connected with ID:", id);
  ws.send(JSON.stringify({ id, message: "Welcome to the chat!" }));

  ws.on("message", (message) => {
    const data = JSON.parse(message);
    if (data.message === "exit") {
      ws.close();
    } else {
      server.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          const msg = { id, nickname: data.nickname, message: data.message };
          client.send(JSON.stringify(msg));
        }
      });
    }
  });

  ws.on("close", () => {
    clients.delete(ws);
  });
});

function generateUniqueId() {
  return Math.floor(Math.random() * Date.now());
}
