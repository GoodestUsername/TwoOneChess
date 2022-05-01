const socketIO = require("socket.io");
const express = require("express");
const http = require("http");
const initializeConnection = require('./gameLogic/game_logic')

const port = process.env.PORT || 3001;;

const app = express();

const server = http.createServer(app);

const io = new socketIO.Server(server, {
    cors: {
        origin: "http://localhost:3000",
        allowedHeaders: ["Access-Control-Allow-Origin"],
        credentials: true
    }
});

const getApiAndEmit = socket => {
    const response = new Date();
    // Emitting a new message. Will be consumed by the client
    socket.emit("FromAPI", response);
};

let interval;

io.on("connection", async (socket) => {
    const userId = socket.id;
    // const userId = await socketIO.fetchUserId(socket);
    initializeConnection.initializeConnection(io, socket, userId)

    console.log("New client connected");
    if (interval) {
        clearInterval(interval);
    }
    interval = setInterval(() => getApiAndEmit(socket), 1000);
    socket.on("disconnect", () => {
        console.log("Client disconnected");
        clearInterval(interval);
    });
}, {multiplex: false});

server.listen(port, () => console.log(`Listening on port ${port}`));