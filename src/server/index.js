const express = require("express");
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
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

let waitingUsers = [];
let inCallUsers = {};
let connectedUsers = 0;

io.on("connection", (socket) => {
    connectedUsers++;
    console.log('usuarios conectados al servidor: ', connectedUsers);
    console.log("Nuevo usuario conectado");

    socket.emit("me", socket.id);

    if (waitingUsers.length > 0) {
        const waitingUser = waitingUsers.pop();
        const pair = { userToCall: waitingUser, from: socket.id };
        inCallUsers[socket.id] = waitingUser;
        inCallUsers[waitingUser] = socket.id;

        io.to(waitingUser).emit('paired', pair);
    } else {
        waitingUsers.push(socket.id);
        console.log("Usuario agregado a waitingUsers");
        console.log("Estado actual de waitingUsers:", waitingUsers.length);
    }

    socket.on("disconnect", () => {
        connectedUsers--;
        waitingUsers = waitingUsers.filter(id => id !== socket.id);
        delete inCallUsers[socket.id];
        console.log("Estado actual de waitingUsers después de desconexión:", waitingUsers);

        socket.broadcast.emit('callended');
    });

    socket.on('calluser', ({ userToCall, signalData, from, name }) => {
        io.to(userToCall).emit('calluser', { signal: signalData, from, name });
    });

    socket.on('answercall', (data) => {
        io.to(data.to).emit('callAccepted', data.signal);
    });

    socket.on('next', () => {
        const currentCallUser = inCallUsers[socket.id];
        if (currentCallUser) {
            io.to(currentCallUser).emit('callended');
            delete inCallUsers[socket.id];
            delete inCallUsers[currentCallUser];
            waitingUsers.push(currentCallUser);
        }

        if (waitingUsers.length > 0) {
            const waitingUser = waitingUsers.pop();
            const pair = { userToCall: waitingUser, from: socket.id };
            inCallUsers[socket.id] = waitingUser;
            inCallUsers[waitingUser] = socket.id;

            io.to(waitingUser).emit('paired', pair);
        } else {
            waitingUsers.push(socket.id);
        }
    });
});




server.listen(PORT, () => {
    console.log("server running on port", PORT);
});
