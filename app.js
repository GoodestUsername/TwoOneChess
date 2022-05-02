const socketIO = require("socket.io");
const express = require("express");
const http = require("http");
const initializeConnection = require('./server/gameLogic/game_logic')

const port = process.env.PORT || 3001;;

const app = express();

const server = http.createServer(app);

// const io = new socketIO.Server(server, {
//     cors: {
//         origin: "*",
//         allowedHeaders: ["Access-Control-Allow-Origin"],
//         credentials: true
//     }
// });
const io = socketIO(server, {
    origin: "*",
    allowedHeaders: ["Access-Control-Allow-Origin"],
    credentials: true
})

io.on("connection", socket => {
    initializeConnection.initializeConnection(io, socket)
});

server.listen(port, () => console.log(`Listening on port ${port}`));