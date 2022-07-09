const socketIO = require("socket.io");
const express = require("express");
const path = require("path");
const http = require("http");
const initializeConnection = require('./gameLogic/game_logic')
const { uuid } = require("uuidv4");

const port = process.env.PORT || 3001;

const app = express();

const server = http.createServer(app);

const io = socketIO(server, {
    origin: "*",
    allowedHeaders: [
        "Access-Control-Allow-Origin",
        "Cross-Origin-Opener-Policy",
        "Cross-Origin-Embedder-Policy"
    ],
    credentials: true,
    cookie: {
        name: "io",
        path: "/",
        httpOnly: true,
        sameSite: "lax"
    }
})

io.on("connection", socket => {
    initializeConnection.initializeConnection(io, socket)
});

server.listen(port, () => console.log(`Listening on port ${port}`));