import { Box, Button } from "@mui/material";

// hooks
import { useContext } from "react";
// types
import { Socket } from "socket.io-client";

// context
import { SocketContext } from "context/socketContext";

// helper functions
import { v4 as uuidv4 } from 'uuid';


/**
 * component placed above the chessboard
 * @returns BoardTopBar component
 */
const BoardTopBar = () => {
    // Socket Context
    const socket = useContext<Socket>(SocketContext);
    
    return (
        <Box>
            {/* emits to socket to create a game room */}
            <Button variant="contained" color="primary" onClick={ () => { socket.emit("createGame", uuidv4().slice(0, 8)) } }>Create Invite Link</Button>
        </Box>
    )
}

export default BoardTopBar;