import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

const port = process.env.PORT || 4000;
app.listen(port, function () {
    console.log('Listening on port ' + port)
})

app.get('/', function (req, res) {
    res.json({'msg': 'Welcome to ChatApp'})
})