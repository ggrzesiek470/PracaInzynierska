import Logger from '../Logger.js';
import GlobalData from '../GlobalData.js';
import AICommunication from "../AICommunication.js";

let zalogowani = GlobalData.zalogowani;
let channel = "turn";
let channelForNotation = "notationBack";

export default function turn ({ client, opers, models, io }) {
    client.on(channel, async function (data) {
        var priorData = data;
        if (priorData.ai_playing == true) {
            let notationText = await AICommunication.getNotationBasedOnMove(priorData.previousLocalTable, priorData.color, {
                from: {
                    x: priorData.from.x - 1,
                    y: priorData.from.y - 1,
                },
                to: {
                    x: priorData.xDes - 1,
                    y: priorData.yDes - 1
                }
            });
            io.sockets.to(client.id).emit(channelForNotation, notationText);

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
                    fromAI: true,
                    entry: response.entry.split("<br>")[0],
                }
        
                io.sockets.to(client.id).emit(channel, dataToSend);
            });
        } else {
            opers.SelectByGameId(models.Game, data.gameId, 1, async function (data) {
                var gameData = data.data[0];
                var opponentPlayer = (priorData.color == "white") ? gameData.blackPlayer : gameData.whitePlayer;
                var opponentsId;

                for (var i = 0; i < zalogowani.length; i++) {
                    if (zalogowani[i].login == opponentPlayer) {
                        opponentsId = zalogowani[i].id;
                    }
                }

                let notationText = await AICommunication.getNotationBasedOnMove(priorData.localTable, priorData.color, {
                    from: {
                        x: priorData.from.x - 1,
                        y: priorData.from.y - 1,
                    },
                    to: {
                        x: priorData.xDes - 1,
                        y: priorData.yDes - 1
                    }
                });
                io.sockets.to(client.id).emit(channelForNotation, notationText);

                priorData.localTable[priorData.yDes - 1][priorData.xDes - 1] = priorData.localTable[priorData.from.y - 1][priorData.from.x - 1];
                priorData.localTable[priorData.from.y - 1][priorData.from.x - 1] = '';

                if (priorData.casting) {
                    if (notationText == "0-0-0") {
                        if (priorData.color == "white") {
                            priorData.localTable[0][3] = priorData.localTable[0][0];
                            priorData.localTable[0][0] = '';
                        } else if (priorData.color == "black") {
                            priorData.localTable[7][3] = priorData.localTable[7][0];
                            priorData.localTable[7][0] = '';
                        }
                    } else if (notationText == "0-0") {
                        if (priorData.color == "white") {
                            priorData.localTable[0][7] = priorData.localTable[0][5];
                            priorData.localTable[0][5] = '';
                        } else if (priorData.color == "black") {
                            priorData.localTable[7][7] = priorData.localTable[7][5];
                            priorData.localTable[7][5] = '';
                        }
                    }
                }

                let objToSend = {
                    gameId: gameData.gameId,
                    currentBoardState: priorData.localTable,
                    historicalMove: notationText,

                    whoseTurn: (priorData.color == "white") ? "black" : "white",
                }
                if (priorData.isFinishedGame == "stalemate" || priorData.isFinishedGame == "checkmate") {
                    var winner = (priorData.color == "white") ? gameData.whitePlayer : gameData.blackPlayer;
                    objToSend.whoseTurn = undefined;
                    objToSend.historicalMove = undefined;

                    let historyOfMoves = JSON.parse(JSON.stringify(gameData.historyOfMoves));
                    objToSend.whitePlayer = gameData.whitePlayer;
                    objToSend.blackPlayer = gameData.blackPlayer;
                    objToSend.whitePlayerPointsGain = (priorData.color == "white") ? 50 : -25;
                    objToSend.blackPlayerPointsGain = (priorData.color == "black") ? 50 : -25;
                    objToSend.winInMoves = (priorData.color == "black") ? Math.ceil(historyOfMoves.length / 2) : Math.floor(historyOfMoves.length / 2);

                    historyOfMoves.push((priorData.color == "white") ? "1-0" : "0-1");
                    objToSend.historyOfMoves = historyOfMoves;
                    objToSend.currentBoardState = priorData.localTable;
                    objToSend.isAiPlaying = false;

                    if (gameData.whitePlayerTimeLeft != undefined && gameData.whitePlayerTimeLeft != null &&
                        gameData.blackPlayerTimeLeft != undefined && gameData.blackPlayerTimeLeft != null &&
                        gameData.gameTime != undefined && gameData.gameTime != null) {
                            objToSend.finalGameTime = Math.abs(gameData.gameTime * 60 * 2 - (gameData.whitePlayerTimeLeft + gameData.blackPlayerTimeLeft));
                        }

                    let historicalGame = new models.HistoricalGame(objToSend);

                    opers.InsertOne(historicalGame);
                    opers.DeleteGameById(models.Game, gameData.gameId);
                } else {
                    if (priorData.color == "white") {
                        objToSend.whitePlayerTimeLeft = priorData.timeLeft;
                    } else if (priorData.color == "black") {
                        objToSend.blackPlayerTimeLeft = priorData.timeLeft;
                    }
    
                    await opers.UpdateGame(models.Game, objToSend);
                }

                priorData.entry = notationText;
                io.sockets.to(opponentsId).emit(channel, priorData);
            })
        }
    })
}