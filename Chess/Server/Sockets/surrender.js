import Logger from '../Logger.js';
import GlobalData from '../GlobalData.js';

let zalogowani = GlobalData.zalogowani;
let channel = "surrender";

export default function surrender ({ client, opers, models, io }) {
    client.on(channel, function (data) {
        let gameId = data.gameId;
        let nick = data.nick;

        opers.SelectByGameId(models.Game, gameId, 1, async function (data) {
            let gameData = data.data[0];
            let whoSurrendered = (nick == gameData.whitePlayer) ? "white" : "black";
            let historyOfMoves = JSON.parse(JSON.stringify(gameData.historyOfMoves));
            let pointsGainedWhite = (whoSurrendered == "white") ? -25 : 50;
            let pointsGainedBlack = (whoSurrendered == "black") ? -25 : 50;
            var opponentPlayer = (whoSurrendered == "white") ? gameData.blackPlayer : gameData.whitePlayer;
            var opponentsId;

            for (var i = 0; i < zalogowani.length; i++) {
                if (zalogowani[i].login == opponentPlayer) {
                    opponentsId = zalogowani[i].id;
                }
            }

            let winInMoves = (whoSurrendered == "black") ? Math.ceil(historyOfMoves.length / 2) : Math.floor(historyOfMoves.length / 2);

            historyOfMoves.push((whoSurrendered == "white") ? "0-1" : "1-0");

            let objToSave = {
                gameId: gameId,
                historyOfMoves: historyOfMoves,
                currentBoardState: gameData.currentBoardState,
                whitePlayer: gameData.whitePlayer,
                blackPlayer: gameData.blackPlayer,
                isAiPlaying: false,
                whitePlayerPointsGain: pointsGainedWhite,
                blackPlayerPointsGain: pointsGainedBlack,
                winInMoves: winInMoves,
            };

            if (gameData.whitePlayerTimeLeft != undefined && gameData.whitePlayerTimeLeft != null &&
                gameData.blackPlayerTimeLeft != undefined && gameData.blackPlayerTimeLeft != null &&
                gameData.gameTime != undefined && gameData.gameTime != null) {
                    objToSave.finalGameTime = Math.abs(gameData.gameTime * 60 * 2 - (gameData.whitePlayerTimeLeft + gameData.blackPlayerTimeLeft));
                }

            var historicalGame = new models.HistoricalGame(objToSave);

            opers.InsertOne(historicalGame);
            opers.DeleteGameById(models.Game, gameId);

            io.sockets.to(opponentsId).emit(channel, {
                gameId: gameId,
                nick: nick
            });
        });
    })
}