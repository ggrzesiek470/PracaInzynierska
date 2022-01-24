import Logger from '../Logger.js';
import GlobalData from '../GlobalData.js';

let zalogowani = GlobalData.zalogowani;
let channel = "joinGame";

export default function joinGame ({ client, opers, models, io }) {
    client.on(channel, function (data) {
        const me = data.login;
        const currentBoardState = data.currentBoardState;
        const dataTimer = data.timer;
        opers.SelectByDataAndLimit(models.FreeGame, {
            timer: dataTimer
        }, 1, function (data) {
            const color = Math.round(Math.random());
            const date = new Date();
            const gameId = parseInt(("" + date.getFullYear()) + ("" + (date.getMonth()+1)) + ("" + date.getDate()) +
                                    ("" + date.getHours()) + ("" + date.getMinutes()) + ("" + date.getSeconds()) +
                                    ("" + GlobalData.newGameId));

            let whitePlayer, blackPlayer;
            GlobalData.newGameId++;

            let dataToSendBack = {
                gameId: gameId,
            }
            
            if (color == 0) {
                whitePlayer = data.data[0].waitingPlayer;
                blackPlayer = me;
                dataToSendBack.yourColor = "black";
            } else {
                whitePlayer = me;
                blackPlayer = data.data[0].waitingPlayer;
                dataToSendBack.yourColor = "white";
            }
            dataToSendBack.whitePlayer = whitePlayer;
            dataToSendBack.blackPlayer = blackPlayer;
            io.sockets.to(client.id).emit(channel, dataToSendBack);

            if (color == 0) dataToSendBack.yourColor = "white";
            else dataToSendBack.yourColor = "black";

            var opponentsId;

            for (var i = 0; i < zalogowani.length; i++) {
                if (zalogowani[i].login == data.data[0].waitingPlayer) {
                    opponentsId = zalogowani[i].id;
                }
            }

            io.sockets.to(opponentsId).emit(channel, dataToSendBack);

            var game = new models.Game({
                gameId: gameId,
                whitePlayer: whitePlayer,
                blackPlayer: blackPlayer,
                currentBoardState: currentBoardState,
                isAiPlaying: false,
                gameTime: dataTimer
            });

            opers.DeleteByWaitingPlayerAndTimer(models.FreeGame, data.data[0].waitingPlayer, data.data[0].timer);
            opers.InsertOne(game);
        })
    })
}