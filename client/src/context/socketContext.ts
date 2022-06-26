import { io } from 'socket.io-client';
import React from 'react';

const URL = 'http://localhost:3001';

export const socket = io(URL,
     {transports: ['websocket'], 
     forceNew: true}
     );

export const SocketContext = React.createContext(socket);
