const express = require("express");
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();  // Aquí creas la instancia de la aplicación Express
const server = http.createServer(app);

app.use(cors());

const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("server is running");
});

// Conexión en tiempo real aquí
io.on("connection", (socket) => {
    // Aquí nos da nuestro id
    socket.emit("me", socket.id);

    // Método de desconexión
    socket.on("disconnect", () => {
        socket.broadcast.emit('callended o llamada terminada');
    });

    // Pasando data
    socket.on('calluser', ({ userToCall, signalData, from, name }) => {
        io.to(userToCall).emit('calluser', { signal: signalData, from, name });
        console.log('Received calluser event with data:', { userToCall, signalData, from, name });
    });
    socket.on('answercall', (data) => {
        io.to(data.to).emit('callAccepted', data.signal);
    });
});

server.listen(PORT, () => {
    console.log("server running on port", PORT);
});
