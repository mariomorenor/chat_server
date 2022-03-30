const { Server } = require("socket.io");

const io = new Server({
  allowEIO3: true,
  cors: {
    origin: true,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Nuevo Cliente", socket.id);

  socket.on("set:username", (data) => {
    socket.username = data.username;
  });

  socket.on("join:room", (data) => {
    socket.join(data.room);
    console.log(`El cliente ${socket.username} se ha unido a la sala ${data.room}`);
  });

  socket.on("send:message",({message})=>{
    message["type"] = "sender";
    socket.broadcast.to(message.room).emit("message_received",message);
  });

});

io.listen(5000);

console.log("Server Listening on port: ", 5000);
