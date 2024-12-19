import {io} from "socket.io-client"
export const initSocket=async()=>{
    const option={
        'force new connection':true,
        reconnectionAttempt:'Infinity',
        timeout:10000,
        transports:['websocket']
    };

    return io(process.env.BACKEND_URL,option);
}