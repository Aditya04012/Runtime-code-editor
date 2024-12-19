import express from "express";
import http from "http";
import { fileURLToPath } from 'url';
import path from 'path';
import { Server } from "socket.io";
import Action from "./src/pages/action.js"; // Use `import` to get the `Action` object

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static('dist'));

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
const userSocketMap = {};

function getAllClients(roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
    return {
      socketId,
      username: userSocketMap[socketId],
    };
  });
}

io.on("connection", (socket) => {
  console.log("socket.id", socket.id);
  socket.on(Action.JOIN, ({ roomId, username }) => {
    userSocketMap[socket.id] = username;
    socket.join(roomId);
    const clients = getAllClients(roomId);
     clients.forEach(({socketId})=>{
        io.to(socketId).emit(Action.JOINED,{
            clients,
            username,
            socketId:socket.id,
        });
     });
  });


  socket.on(Action.CODE_CHANGE,({roomId,code})=>{
    socket.in(roomId).emit(Action.CODE_CHANGE,{code});
  })


  socket.on(Action.SYNC_CODE,({socketId,code})=>{
   io.to(socketId).emit(Action.CODE_CHANGE,{code});
  });



socket.on('disconnecting',()=>{
    const rooms=[...socket.rooms];
    rooms.forEach((roomId)=>{
        socket.in(roomId).emit(Action.DISCONNECTED,{
            socketId:socket.id,
            username:userSocketMap[socket.id]
        });
    });
    delete userSocketMap[socket.id];
    socket.leave();

})


});

server.listen(3000, () => {
  console.log("server is live at port 3000");
});
