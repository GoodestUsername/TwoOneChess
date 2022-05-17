var serverIO;
var gameSocket;

var allSessions  = [];
var playerColors = ["white", "black"]
// code inspired by https://www.youtube.com/watch?v=QwUZxCBtfLw&t=865s
const initializeConnection = (io, client) => {
    serverIO = io;
    gameSocket = client;

    allSessions.push(gameSocket);

    // #region count
    const count = io.engine.clientsCount;
    const count2 = io.of("/").sockets.size;
    console.log("clients: ", count)
    console.log("sockets: ", count2)
    // #endregion count

    // create match
    gameSocket.on("createGame", onCreateGame);

    // join match
    gameSocket.on("joinGame", onJoinGame);

    // send move to opponent
    gameSocket.on("sendMove", onSendMove);

    gameSocket.on("disconnect", onDisconnect);
}

function onCreateGame(roomId) {
    // join room and wait for the other player
    this.join(roomId)

    // Return the Room ID (gameId)
    this.emit('sendRoomCode', roomId);
}   

function onJoinGame(roomId) {
    let gameRoom = serverIO.sockets.adapter.rooms.get(roomId);
    let roomSize = gameRoom ? gameRoom.size : 0;
    if (gameRoom === undefined) {
        this.emit("issueWarning", {message: "room does not exist"});
        return;
    }
    if (gameRoom.has(this.id)) {
        this.emit("issueWarning", {message: "You have already joined this room."});
        return;
    }
    if (2 > roomSize) {
        this.join(roomId);
        let clients = Array.from(gameRoom);
        let p1Color = playerColors[Math.floor(Math.random() * playerColors.length)]
        let p2Color = (p1Color === playerColors[0]) ? playerColors[1] : playerColors[0];
        serverIO.to(clients[0]).emit("startGame", p1Color);
        serverIO.to(clients[1]).emit("startGame", p2Color);
        console.log("joined")
    }
    else {
        this.emit("issueWarning", {message: "Room full"});
    }
}

function onSendMove(move_info) {
    this.to(move_info.roomId).emit("opponentMove", move_info);
}

function onDisconnect() {
    allSessions.splice(allSessions.indexOf(gameSocket), 1);
}

exports.initializeConnection = initializeConnection
