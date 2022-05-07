var serverIO;
var gameSocket;

var allSessions = []

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

    // send move to clients
    gameSocket.on("sendMove", onSendMove);
}

// const onCreateGame = () => {
//     this.join(gameSocket.id);
//     this.emit("createRoom", gameSocket.id);
// }
function onCreateGame(gameRoom) {
    this.join(gameRoom)
    // Return the Room ID (gameId) and the socket ID (mySocketId) to the browser client
    this.emit('createRoom', gameRoom);

    // Join the Room and wait for the other player

}

function onJoinGame(roomCode) {
    this.join(roomCode);

    serverIO.to(roomCode).emit("startGame")
    console.log("joined game");
}

function onSendMove(move_info) {
    this.to(move_info.roomId).emit("opponentMove", move_info.move);
}
exports.initializeConnection = initializeConnection
