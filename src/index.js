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
    console.log(
      `El cliente ${socket.username} se ha unido a la sala ${data.room}`
    );
    socket.broadcast.to(data.room).emit("user_connected", data);
  });

  socket.on("users", () => {
    let users = [];
    io.sockets.sockets.forEach((s) => {
      users.push(s.username);
    });
    socket.emit("users_in_room", users);
  });

  socket.on("disconnecting", (reason) => {
    index = 0;
    for (const room of socket.rooms) {
      if (index == 0) {
        index++;
        continue;
      }
      index++;
      socket.to(room).emit("leave_room", { room, username: socket.username });
      console.log(`El Usuario ${socket.username} ha salido`);
    }
  });

  socket.on("send:message", ({ message }) => {
    message["type"] = "sender";
    socket.broadcast.to(message.room).emit("message_received", message);
  });

  socket.on("logout",()=>{
    for (const room of socket.rooms) {
      socket.to(room).emit("leave_room",{room,username:socket.username})
      socket.leave(room)
    }
  })
});

io.listen(5001);

console.log("Server Listening on port: ", 5001);
