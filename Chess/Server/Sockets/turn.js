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
                var dataToSend = {
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
            opers.SelectByGameId(models.Game, data.gameId, 1, function (data) {
                if (priorData.color == "white") {
                    var opponentsId;
                    for (var i = 0; i < zalogowani.length; i++) {
                        if (zalogowani[i].login == data.data[0].blackPlayer) {
                            opponentsId = zalogowani[i].id;
                        }
                    }
                    io.sockets.to(opponentsId).emit(channel, priorData);
                } else if (priorData.color == "black") {
                    var opponentsId;
                    for (var i = 0; i < zalogowani.length; i++) {
                        if (zalogowani[i].login == data.data[0].whitePlayer) {
                            opponentsId = zalogowani[i].id;
                        }
                    }
                    io.sockets.to(opponentsId).emit(channel, priorData);
                }
            })
        }
    })
}