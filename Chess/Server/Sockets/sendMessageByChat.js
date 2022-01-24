import Logger from '../Logger.js';
import GlobalData from '../GlobalData.js';
import AICommunication from "../AICommunication.js";

let zalogowani = GlobalData.zalogowani;
let channel = "sendMessageByChat";
let conveyChannel = "getMessageByChat";

export default function sendMessageByChat ({ client, opers, models, io }) {
    client.on(channel, function (data) {
        var priorData = data;

        opers.SelectByGameId(models.Game, data.gameId, 1, function (data) {
            let foundGames = data.data;

            opers.SelectByGameId(models.HistoricalGame, priorData.gameId, 1, function (data) {
                let foundHistoricalGames = data.data;

                if (foundGames.length == 0) {
                    foundGames = foundHistoricalGames;
                }

                if (priorData.color == "white") {
                    var opponentsId;
                    for (var i = 0; i < zalogowani.length; i++) {
                        if (zalogowani[i].login == foundGames[0].blackPlayer) {
                            opponentsId = zalogowani[i].id;
                        }
                    }
                    io.sockets.to(opponentsId).emit(conveyChannel, priorData);
                } else if (priorData.color == "black") {
                    var opponentsId;
                    for (var i = 0; i < zalogowani.length; i++) {
                        if (zalogowani[i].login == foundGames[0].whitePlayer) {
                            opponentsId = zalogowani[i].id;
                        }
                    }
                    io.sockets.to(opponentsId).emit(conveyChannel, priorData);
                }
            });
        })
    })
}