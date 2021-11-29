import { createServer } from 'http';
import socketio from 'socket.io';
import mongoose from 'mongoose';
import express from 'express';
import Models from './database/Models.js';
import Operations from "./database/Operations.js";
import AICommunication from "./server_files/AICommunication.js";

const port = 3000;
const models = Models(mongoose);
const opers = new Operations();
const app = express();
app.use(express.static('staticDir'))

const server = createServer(app);
server.listen(port, () => {
    console.log("Classic Chess");
})

const io = socketio.listen(server);
let db;

mongoose.connect('mongodb://localhost/ClassicChess', { useUnifiedTopology: true });
const connectToMongo = () => {
    db = mongoose.connection;
    db.on("error", function (err) {
        console.log("Wstąpiły błędy prz MongoDB.");
    });
    db.once("open", function () {
        console.log("Mongo jest podłączone i działa!");
        opers.DeleteAll(models.FreeGame);
        opers.DeleteAll(models.Game);
    });
    db.once("close", function () {
        console.log("Mongo zostało zamknięte.");
    });
}

connectToMongo();

var zalogowani = [];
var newGameId = 1;

io.sockets.on("connection", function (client) {
    console.log("Klient " + client.id + " pojawia się na serwerze!")
    client.on("disconnect", function () {
        console.log("Klient " + client.id + " wychodzi z serwera.")
        var waitingPlayer;

        for (var i = 0; i < zalogowani.length; i++) {
            if (zalogowani[i].id == client.id) {
                waitingPlayer = zalogowani[i].login;
            }
        }

        if (waitingPlayer != undefined) {
            opers.DeleteByWaitingPlayer(models.FreeGame, waitingPlayer);
        }

        for (var i = 0; i < zalogowani.length; i++) {
            if (zalogowani[i].id == client.id) {
                zalogowani.splice(i, 1);
            }
        }
    })    
	client.on("signup", function (data) {
        console.log("REJESTRACJA")
        var user = new models.User({
            login: data.login,
            password: data.password,
            wins: 0,
            draws: 0,
            losses: 0,
            points: 0,
        });
        console.log(user)

        io.sockets.to(client.id).emit("signup", {
            status: "został zarejestrowany.",
            user: data.login
        });

        opers.InsertOne(user);
    })
	client.on("login", function (data) {
	    console.log("LOGOWANIE");
	    var checking = false;
        for (var i = 0; i < zalogowani.length; i++) {
            if (zalogowani[i].login == data.login) {
                checking = true;
            }
        }
        if (checking == false) {
            var dane = {
                login: data.login,
                id: client.id
            }

            opers.SelectByLogin(models.User, data.login, data.password, 1, function (data) {
                if (data.data.length > 0) zalogowani.push(dane);
                io.sockets.to(client.id).emit("login", data);
            })
        } else {
            var data1 = {
                status: "deny",
            }

            io.sockets.to(client.id).emit("login", data1);
        }
    })
    client.on("read", function (data) {
        console.log("emit to " + client.id)
        opers.SelectAll(models.User, function (data) {
            io.sockets.to(client.id).emit("read", data);
        })
    })
    client.on("searchForGames", function (data) {
        opers.SelectAndLimit(models.FreeGame, 1, function (data) {
            io.sockets.to(client.id).emit("searchForGames", data);
        })
    })
    client.on("addFreeGame", function (data) {
        var freegame = new models.FreeGame({
            waitingPlayer: data.login
        });

        opers.InsertOne(freegame);
    })
    client.on("joinGame", function (data) {
        var me = data.login;
        opers.SelectAndLimit(models.FreeGame, 1, function (data) {
            var whitePlayer, blackPlayer;
            var color = Math.round(Math.random());
            var gameId = newGameId;
            newGameId++;

            var dane = {
                gameId: gameId,
            }
            
            if (color == 0) {
                whitePlayer = data.data[0].waitingPlayer;
                blackPlayer = me;
                dane.yourColor = "black";
            } else {
                whitePlayer = me;
                blackPlayer = data.data[0].waitingPlayer;
                dane.yourColor = "white";
            }
            io.sockets.to(client.id).emit("joinGame", dane);

            if (color == 0) dane.yourColor = "white";
            else dane.yourColor = "black";

            var opponentsId;

            for (var i = 0; i < zalogowani.length; i++) {
                if (zalogowani[i].login == data.data[0].waitingPlayer) {
                    opponentsId = zalogowani[i].id;
                }
            }

            io.sockets.to(opponentsId).emit("joinGame", dane);

            var game = new models.Game({
                gameId: gameId,
                whitePlayer: whitePlayer,
                blackPlayer: blackPlayer,
            });

            opers.DeleteFirst(models.FreeGame);
            opers.InsertOne(game);
        })
    })
    
    client.on("sendDataToAI", function (data) {
        AICommunication.sendDataToAIServer(data.localTable, data.depth, data.computer, function (response) {
            var dataToSend = {
                pawn: {
                    position: {
                        x: response.from.x,
                        y: response.from.y
                    },
                    type: response.type
                },
                xDes: response.to.x,
                yDes: response.to.y,
                enPassant: response.enpassant,
                casting: response.casting,
                from_ai: true
            }    
            io.sockets.to(client.id).emit("turn", dataToSend);
        });

    });

    client.on("turn", function (data) {
        console.log("co dostał: ");
        console.log(data)
        var me;
        for (var i = 0; i < zalogowani.length; i++) {
            if (zalogowani[i].id == client.id) {
                me = zalogowani[i].login;
            }
        }
        var priorData = data;
        if (priorData.ai_playing == true) {
            AICommunication.sendDataToAIServer(data.localTable, data.depth, data.computer, function (response) {
                var dataToSend = {
                    pawn: {
                        position: {
                            x: response.from.x,
                            y: response.from.y
                        },
                        type: response.type
                    },
                    xDes: response.to.x,
                    yDes: response.to.y,
                    enPassant: response.enpassant,
                    casting: response.casting
                }
                console.log("co zwrócił:")
                console.log(dataToSend)
        
                io.sockets.to(client.id).emit("turn", dataToSend);
            });
        } else {
            opers.SelectByGameId(models.Game, data.gameId, 1, function (data) {
                if (priorData.color == "white") {
                    console.log("white wykonal swoj ruch");
                    var opponentsId;
                    console.log(data.data[0].blackPlayer);
                    for (var i = 0; i < zalogowani.length; i++) {
                        console.log(zalogowani[i]);
                        if (zalogowani[i].login == data.data[0].blackPlayer) {
                            opponentsId = zalogowani[i].id;
                        }
                    }
                    io.sockets.to(opponentsId).emit("turn", priorData);
                } else if (priorData.color == "black") {
                    var opponentsId;
                    for (var i = 0; i < zalogowani.length; i++) {
                        console.log(zalogowani[i]);
                        if (zalogowani[i].login == data.data[0].whitePlayer) {
                            opponentsId = zalogowani[i].id;
                        }
                    }
                    io.sockets.to(opponentsId).emit("turn", priorData);
                }
            })
        }
    })
    client.on("getForRegister", function (data) {
        opers.SelectAll(models.User, function (data) {
            io.sockets.to(client.id).emit("getForRegister", data);
        })
    })
    client.on("setStatisticsForUser", function (data) {
        console.log("STATYSTYKI UPDATE");
        opers.UpdateStatistics(models.User, data.user, data.wins, data.draws, data.losses, data.points);
    })
})