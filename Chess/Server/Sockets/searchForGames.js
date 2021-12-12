import Logger from '../Logger.js';
import GlobalData from '../GlobalData.js';

let channel = "searchForGames";

export default function searchForGames ({ client, opers, models, io }) {
    client.on(channel, function (data) {
        opers.SelectAndLimit(models.FreeGame, 1, function (data) {
            io.sockets.to(client.id).emit(channel, data);
        })
    })
}