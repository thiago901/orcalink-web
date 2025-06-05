// src/lib/socket.ts
import { io } from 'socket.io-client';

export const socket = ()=>{
    console.log('webSOCKET');

    return io('http://localhost:3000',{
        transports:['websocket']
    });
}


