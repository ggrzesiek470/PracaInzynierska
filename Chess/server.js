// External modules
import { createServer } from 'http';
import socketio from 'socket.io';
import mongoose from 'mongoose';
import express from 'express';

// Server Classes
import Models from './Server/Database/Models.js';
import Operations from "./Server/Database/Operations.js";
import Logger from "./Server/Logger.js";
import MongoCommunication from './Server/MongoCommunication.js';
import SocketsInit from './Server/SocketsInit.js';

// Consts
const port = 3000;
const models = Models(mongoose);
const opers = new Operations();
const app = express();
app.use(express.static('staticDir'))

// Express HTTP server starts
const server = createServer(app);
server.listen(port, () => {
    let message = "App initialization: Classic Chess starts!";
    Logger.print(message, Logger.type.INFO, "Init");
})

// Exception handling writing error to file
process.on('uncaughtException', function (err) {
    if (err) {
        // console.log("caughtException but no error msg" + err.stack);
        Logger.print(err.stack, Logger.type.CRITICAL, "Critical Error");
    }
});

// MongoDB initialization
MongoCommunication.init(mongoose, opers, models);
let db = MongoCommunication.getDB();

// Socket.io service listens to channels
const io = socketio.listen(server);
let sockets = new SocketsInit(io, opers, models);

