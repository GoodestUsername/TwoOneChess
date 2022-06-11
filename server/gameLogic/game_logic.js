const { uuid } = require("uuidv4");

var serverIO;
var gameSocket;

var allSessions  = [];
var playerColors = ["white", "black"]
// code inspired by https://www.youtube.com/watch?v=QwUZxCBtfLw&t=865s
const initializeConnection = (io, client) => {
    serverIO = io;
    gameSocket = client;

    allSessions.push(gameSocket);

    //
    gameSocket.on("register", onRegister);

    // create match
    gameSocket.on("createGame", onCreateGame);

    // join match
    gameSocket.on("joinGame", onJoinGame);

    // send move to opponent
    gameSocket.on("sendMove", onSendMove);

    // sync game if needed
    gameSocket.on("syncGame", onSyncGame);

    // handle disconnect
    gameSocket.on("disconnect", onDisconnect);
}

function onRegister(data) {
    if (data !== null) {
        const gameRoom = serverIO.sockets.adapter.rooms.get(data.roomId);
        if (gameRoom && gameRoom.roomVars && gameRoom.roomVars.gameKey === data.gameKey) {
            this.join(data.roomId);
            this.to(data.roomId).emit("reconnectGame", data);
            return;
        }
    }
}

function onCreateGame(roomId) {
    // join room and wait for the other player
    this.join(roomId)

    // Return the Room ID (gameId)
    this.emit('sendRoomCode', {roomId: roomId});
    serverIO.sockets.adapter.rooms.get(roomId).roomVars = { "gameKey": null };
}   

function onJoinGame(data) {
    const gameRoom = serverIO.sockets.adapter.rooms.get(data.roomId);
    const roomSize = gameRoom ? gameRoom.size : 0;

    if (gameRoom === undefined) {
        this.emit("issueWarning", {msg: "room does not exist"});
        return;
    }

    if (gameRoom.has(this.id)) {
        this.emit("issueWarning", {msg: "You have already joined this room."});
        return;
    }

    if (gameRoom.roomVars.gameKey !== null) {
        this.emit("issueWarning", {msg: "game has already started"});
        return;
    }

    if (2 > roomSize) {
        this.join(data.roomId);
        const clients = Array.from(gameRoom);
        const gameKey = uuid();

        const p1Color = playerColors[Math.floor(Math.random() * playerColors.length)]
        const p2Color = (p1Color === playerColors[0]) ? playerColors[1] : playerColors[0];

        serverIO.to(clients[0]).emit("startGame", {color: p1Color, gameKey: gameKey.toString(), roomId: data.roomId});
        serverIO.to(clients[1]).emit("startGame", {color: p2Color, gameKey: gameKey.toString(), roomId: data.roomId});
        serverIO.sockets.adapter.rooms.get(data.roomId).roomVars.gameKey = gameKey;
    }
    else {
        this.emit("issueWarning", {msg: "Room full"});
    }
}

function onSendMove(data) {
    this.to(data.roomId).emit("opponentMove", data);
}

function onSyncGame(data) {
    if (data !== null) {
        this.to(data.roomId).emit('sendRoomCode', {roomId: data.roomId});
        this.to(data.roomId).emit("restoreGame", data);
    }
}

function onDisconnect() {
    setTimeout(function () {
        allSessions.splice(allSessions.indexOf(gameSocket), 1);
    }, 1000);
}

exports.initializeConnection = initializeConnection
