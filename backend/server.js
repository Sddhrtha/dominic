const express = require('express');
const routes = require('./routes');
const cors = require("cors");
const http = require('http');
const { Server } = require('socket.io');
const { orderTracking } = require('./controllers/orderTracking');
require("dotenv").config();

const app = express();
const PORT = process.env.PORT;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
      origin: "http://localhost:3000",  
      methods: ["GET", "POST"],       
      credentials: true           
  }
});

io.on('connection', (socket) => {
  console.log('a user connected');
});

app.use(express.json());

app.use(
    cors({
      origin: "*",
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      credentials: true,
    })
);

app.use('/', routes);
orderTracking(io);

server.listen(PORT, () => {
    console.log(`Server Running on PORT: ${PORT}`);
})