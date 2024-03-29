import express from "express";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { createServer } from 'node:http'

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000"
    }
})

app.use(express.json());

io.on('connection', (socket) => {
    console.log(socket.id)

    socket.on('send_message', (msg) => {
        socket.broadcast.emit('recieve_message', msg)
    })
})

const port = process.env.PORT || 4000;
server.listen(port, function () {
    console.log('Listening on port ' + port)
})

app.get('/', function (req, res) {
    res.json({'msg': 'Welcome to ChatApp'})
})