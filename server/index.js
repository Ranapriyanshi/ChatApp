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
        methods: ["GET", "POST"]
    }
})

app.use(express.json());

io.on('connection', (socket) => {
    console.log(socket.id)

    socket.on('join_room', (data) => {
        socket.join(data)
        console.log('User joined room: ' + data)
    })

    socket.on('send_message', (msg) => {
        socket.to(msg.id).emit('recieve_message', msg.input)
    })
})

const port = process.env.PORT || 4000;
server.listen(port, function () {
    console.log('Listening on port ' + port)
})

app.get('/', function (req, res) {
    res.json({'msg': 'Welcome to ChatApp'})
})