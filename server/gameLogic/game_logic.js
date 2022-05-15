var serverIO;
var gameSocket;

var allSessions  = [];
var allGames     = new Map();
var playerColors = ["white", "black"]

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
}

function onCreateGame(roomId) {
    // join room and wait for the other player
    this.join(roomId)

    let newgameSession = {
        players: [this.id]
    }
    allGames.set(roomId, newgameSession)

    // Return the Room ID (gameId)
    this.emit('sendRoomCode', roomId);
}

function onJoinGame(roomId) {
    let currentGame = allGames.get(roomId);
    if (currentGame.players.length < 2) {
        currentGame.players.push(this.id);
        this.join(roomId);
        let p1Color = playerColors[Math.floor(Math.random() * playerColors.length)]
        let p2Color = (p1Color === playerColors[0]) ? playerColors[1] : playerColors[0];
        serverIO.to(currentGame.players[0]).emit("startGame", p1Color);
        serverIO.to(currentGame.players[1]).emit("startGame", p2Color);
        console.log("joined")
    }
}

function onSendMove(move_info) {
    // console.log(move_info);
    this.to(move_info.roomId).emit("opponentMove", move_info);
}
exports.initializeConnection = initializeConnection
