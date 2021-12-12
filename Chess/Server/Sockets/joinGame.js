import Logger from '../Logger.js';
import GlobalData from '../GlobalData.js';

let zalogowani = GlobalData.zalogowani;
let channel = "joinGame";

export default function joinGame ({ client, opers, models, io }) {
    client.on(channel, function (data) {
        var me = data.login;
        opers.SelectAndLimit(models.FreeGame, 1, function (data) {
            var whitePlayer, blackPlayer;
            var color = Math.round(Math.random());
            var gameId = GlobalData.newGameId;
            GlobalData.newGameId++;

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
            io.sockets.to(client.id).emit(channel, dane);

            if (color == 0) dane.yourColor = "white";
            else dane.yourColor = "black";

            var opponentsId;

            for (var i = 0; i < zalogowani.length; i++) {
                if (zalogowani[i].login == data.data[0].waitingPlayer) {
                    opponentsId = zalogowani[i].id;
                }
            }

            io.sockets.to(opponentsId).emit(channel, dane);

            var game = new models.Game({
                gameId: gameId,
                whitePlayer: whitePlayer,
                blackPlayer: blackPlayer,
            });

            opers.DeleteFirst(models.FreeGame);
            opers.InsertOne(game);
        })
    })
}