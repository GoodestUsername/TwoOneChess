var serverIO;
var gameSocket;
var userID;
var opponentId;

const initializeConnection = (io, client, userId) => {
    serverIO = io;
    gameSocket = client;
    userID = userId;

    // create match
    gameSocket.on("createGame", onCreateGame)

    // join match
    gameSocket.on("joinGame", (roomCode) => onJoinGame(roomCode))

    // receive opponent ID
    gameSocket.on("opponentID", (sentOpponentId) => onOpponentID(sentOpponentId))

    // send move to clients
    gameSocket.on("sendMove", (move) => onSendMove(move))

    // end match
    gameSocket.on("disconnect", onDisconnect)
}

const onCreateGame = () => {
    gameSocket.join(userID);
    gameSocket.emit("createRoom", userID);
}

const onJoinGame = (roomCode) => {
    gameSocket.join(roomCode);
    opponentID = roomCode;
    serverIO.to(roomCode).emit("opponentID", userID);
    console.log("joined game")
}

const onOpponentID = (sentOpponentId) => {
    opponentId = sentOpponentId;
    console.log("opponent joined game")
}

const onSendMove = (move) => {
    console.log(move);
    serverIO.to(opponentId).emit(move);
}

const onDisconnect = () => {
    // gameSocket.
}

exports.initializeConnection = initializeConnection
