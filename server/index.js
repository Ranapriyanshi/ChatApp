import express from "express";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { createServer } from 'node:http'

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    }
})

// app.use(express.json());

io.on('connection', (socket) => {
    console.log(socket.id)

    socket.on('send_message', (msg) => {
        socket.broadcast.emit('recieve_message', msg)
    })
})

// const port = process.env.PORT || 4000;
server.listen(8176, function () {
    console.log('Listening on port ' + 8176)
})

app.get('/', function (req, res) {
    res.json({'msg': 'Welcome to ChatApp'})
})