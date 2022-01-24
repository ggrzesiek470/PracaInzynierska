import Logger from '../Logger.js';
import GlobalData from '../GlobalData.js';
import AICommunication from "../AICommunication.js";

let zalogowani = GlobalData.zalogowani;
let channel = "sendStalematePreposition";
let channelBack = "sendStalematePrepositionBack";

export default function sendStalematePreposition ({ client, opers, models, io }) {
    // sendStalematePreposition
    client.on(channel, function (data) {
        var priorData = data;

        opers.SelectByGameId(models.Game, data.gameId, 1, function (data) {
            let foundGames = data.data;
            let opponentPlayer = (priorData.nick == foundGames[0].whitePlayer) ? foundGames[0].blackPlayer : foundGames[0].whitePlayer;

            var opponentsId;
            for (var i = 0; i < zalogowani.length; i++) {
                if (zalogowani[i].login == opponentPlayer) {
                    opponentsId = zalogowani[i].id;
                }
            }
            io.sockets.to(opponentsId).emit(channel, priorData);
        })
    })
    // sendStalematePrepositionBack
    client.on(channelBack, function (data) {
        var priorData = data;
        if (data.accepted) {
            let gameId = data.gameId;
            let nick = data.nick;
    
            opers.SelectByGameId(models.Game, gameId, 1, async function (data) {
                let gameData = data.data[0];
                let historyOfMoves = JSON.parse(JSON.stringify(gameData.historyOfMoves));
                let pointsGainedWhite = 25;
                let pointsGainedBlack = 25;
                var opponentPlayer = (nick == gameData.whitePlayer) ? gameData.blackPlayer : gameData.whitePlayer;
                var opponentsId;
    
                for (var i = 0; i < zalogowani.length; i++) {
                    if (zalogowani[i].login == opponentPlayer) {
                        opponentsId = zalogowani[i].id;
                    }
                }
    
                let winInMoves = Math.ceil(historyOfMoves.length / 2);
    
                historyOfMoves.push("1/2-1/2");
    
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
    
                io.sockets.to(opponentsId).emit(channelBack, {
                    gameId: gameId,
                    nick: nick,
                    accepted: true
                });
            });

        } else {
            var priorData = data;

            opers.SelectByGameId(models.Game, data.gameId, 1, function (data) {
                let foundGames = data.data;
                let opponentPlayer = (priorData.nick == foundGames[0].whitePlayer) ? foundGames[0].blackPlayer : foundGames[0].whitePlayer;
    
                var opponentsId;
                for (var i = 0; i < zalogowani.length; i++) {
                    if (zalogowani[i].login == opponentPlayer) {
                        opponentsId = zalogowani[i].id;
                    }
                }
                io.sockets.to(opponentsId).emit(channelBack, priorData);
            })
        }
    });
}