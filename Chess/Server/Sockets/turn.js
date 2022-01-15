import Logger from '../Logger.js';
import GlobalData from '../GlobalData.js';
import AICommunication from "../AICommunication.js";

let zalogowani = GlobalData.zalogowani;
let channel = "turn";

export default function turn ({ client, opers, models, io }) {
    client.on(channel, function (data) {
        var me;
        for (var i = 0; i < zalogowani.length; i++) {
            if (zalogowani[i].id == client.id) {
                me = zalogowani[i].login;
            }
        }
        var priorData = data;
        if (priorData.ai_playing == true) {
            AICommunication.sendDataToAIServer(data.localTable, data.depth, data.computer, function (response) {
                const dataToSend = {
                    pawn: {
                        position: {
                            x: response.from.x,
                            y: response.from.y
                        },
                        color: response.color,
                        type: response.type
                    },
                    xDes: response.to.x,
                    yDes: response.to.y,
                    enPassant: response.enpassant,
                    casting: response.casting,
                    fromAI: true
                }
        
                io.sockets.to(client.id).emit(channel, dataToSend);
            });
        } else {
            opers.SelectByGameId(models.Game, data.gameId, 1, async function (data) {
                var gameData = data.data[0];
                if (priorData.color == "white") {
                    var opponentsId;
                    for (var i = 0; i < zalogowani.length; i++) {
                        if (zalogowani[i].login == gameData.blackPlayer) {
                            opponentsId = zalogowani[i].id;
                        }
                    }

                    let assoc = { "Pawn": "", "Rook": "W", "Knight": "S", "Bishop": "G", "King": "K", "Queen": "H" };
                    let columnMapping = { 1: "a", 2: "b", 3: "c", 4: "d", 5: "e", 6: "f", 7: "g", 8: "h" }
                    let figure = assoc[priorData.pawn.type];
                    let action = priorData.hitPawn ? ":" : "->";
                    let notation = figure + columnMapping[priorData.from.x] + priorData.from.y + action + columnMapping[priorData.xDes] + priorData.yDes;

                    priorData.localTable[priorData.yDes - 1][priorData.xDes - 1] = priorData.localTable[priorData.from.y - 1][priorData.from.x - 1];
                    priorData.localTable[priorData.from.y - 1][priorData.from.x - 1] = '';

                    if (priorData.casting) {
                        if (notation == "Ke1->c1") {
                            notation = "O-O-O";
                            priorData.localTable[0][3] = priorData.localTable[0][0];
                            priorData.localTable[0][0] = '';
                        } else if (notation == "Ke1->g1") {
                            notation = "O-O";
                            priorData.localTable[0][7] = priorData.localTable[0][5];
                            priorData.localTable[0][5] = '';
                        }
                    }

                    console.log(notation);
                    console.log("enPassant:")
                    console.log(priorData.enPassant)
                    console.log("casting:")
                    console.log(priorData.casting)

                    /*
                    let result = await opers.UpdateGame(Model.Game, {
                        gameId: gameData.gameId,
                        currentBoardState: priorData.localTable,
                        historicalMove: notation,

                        whoseTurn: "black"
                    });
                    */

                    priorData.historicalMove = notation;
                    io.sockets.to(opponentsId).emit(channel, priorData);
                } else if (priorData.color == "black") {
                    var opponentsId;
                    for (var i = 0; i < zalogowani.length; i++) {
                        if (zalogowani[i].login == gameData.whitePlayer) {
                            opponentsId = zalogowani[i].id;
                        }
                    }

                    let assoc = { "Pawn": "", "Rook": "W", "Knight": "S", "Bishop": "G", "King": "K", "Queen": "H" };
                    let columnMapping = { 1: "a", 2: "b", 3: "c", 4: "d", 5: "e", 6: "f", 7: "g", 8: "h" }
                    let figure = assoc[priorData.pawn.type];
                    let action = priorData.hitPawn ? ":" : "->";
                    let notation = figure + columnMapping[priorData.from.x] + priorData.from.y + action + columnMapping[priorData.xDes] + priorData.yDes;
                    
                    priorData.localTable[priorData.yDes - 1][priorData.xDes - 1] = priorData.localTable[priorData.from.y - 1][priorData.from.x - 1];
                    priorData.localTable[priorData.from.y - 1][priorData.from.x - 1] = '';

                    if (priorData.casting) {
                        if (notation == "Ke8->c8") {
                            notation = "O-O-O";
                            priorData.localTable[7][3] = priorData.localTable[7][0];
                            priorData.localTable[7][0] = '';
                        } else if (notation == "Ke8->g8") {
                            notation = "O-O";
                            priorData.localTable[7][7] = priorData.localTable[7][5];
                            priorData.localTable[7][5] = '';
                        }
                    }

                    console.log(notation);
                    console.log("enPassant:")
                    console.log(priorData.enPassant)
                    console.log("casting:")
                    console.log(priorData.casting)

                    // Remember to put the update game here as well!


                    io.sockets.to(opponentsId).emit(channel, priorData);
                }
            })
        }
    })
}