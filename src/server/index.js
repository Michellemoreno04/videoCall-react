const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("server is running");
});

let waitingUsers = [];
let inCallUsers = [];
let connectedUsers = 0;

io.on("connection", (socket) => {
  connectedUsers++;

  //console.log('usuarios conectados al servidor: ', connectedUsers);
  console.log("Nuevo usuario conectado:", connectedUsers, socket.id);

  socket.emit("me", socket.id);

  
  if (waitingUsers.length > 0) {
    
      const waitingUser = waitingUsers.shift();//shift() elimina el primer elemento de un array.
      const pair = { userToCall: waitingUser, from: socket.id };
   

     io.to(waitingUser).emit("paired", pair);
    inCallUsers.push(pair);
  } else {
    //aqui estamos en la situación en la que no hay ningún usuario esperando solo el que se conectó
    waitingUsers.push(socket.id);

  }
  console.log("usuarios en espera: ", waitingUsers);

  socket.on("disconnect", () => {
    connectedUsers--;
    waitingUsers = waitingUsers.filter((id) => id !== socket.id);
    const pairedUser = inCallUsers[socket.id];
    if (pairedUser) {
      io.to(pairedUser).emit("callended");
      waitingUsers.push(pairedUser); // Reagrega el otro usuario a waitingUsers
      delete inCallUsers[pairedUser];
    }

    delete inCallUsers[socket.id];

    // Informar a otros usuarios que la llamada ha terminado
    socket.broadcast.emit("callended");
  });

  socket.on("calluser", ({ userToCall, signalData, from, name }) => {
    if (inCallUsers[userToCall] && inCallUsers[userToCall].userToCall !== null) {
      console.log("El usuario destino ya está llamando a alguien más");
      // No permitir que el usuario llame
      return;
    }
    if (inCallUsers[userToCall] && inCallUsers[userToCall].from !== null) {
      console.log("El usuario destino ya está en llamada con alguien más");
      // No permitir que el usuario llame
      return;
    }
    // Si no hay llamada en curso, permitir que el usuario llame
    io.to(userToCall).emit("calluser", { signal: signalData, from, name });
  });

  socket.on("answercall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });

    // Evento de mensajería
  socket.on('sendMessage', (message) => {
    const pairedUser = inCallUsers.find(pair => pair.from === socket.id || pair.userToCall === socket.id);
    if (pairedUser) {
      const recipient = pairedUser.from === socket.id ? pairedUser.userToCall : pairedUser.from;
      io.to(recipient).emit('receiveMessage', message);
    }
  });
   

  socket.on("next", () => {
    if (inCallUsers[socket.id]) {
      const pairedUser = inCallUsers[socket.id];
      delete inCallUsers[socket.id];
      delete inCallUsers[pairedUser];
      waitingUsers.push(pairedUser);
    }
  
    if (waitingUsers.length > 0) {
      const waitingUser = waitingUsers.pop();
      const pair = { userToCall: waitingUser, from: socket.id };
      inCallUsers.push(pair);
      console.log("usuarios en llamada: ", inCallUsers);
      io.to(waitingUser).emit("paired", pair);
    } else {
      waitingUsers.push(socket.id);
    }
  });
      
    
  
  });


server.listen(PORT, () => {
  console.log("server running on port", PORT);
});