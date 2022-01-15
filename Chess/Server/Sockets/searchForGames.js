import Logger from '../Logger.js';
import GlobalData from '../GlobalData.js';

let channel = "searchForGames";

export default function searchForGames ({ client, opers, models, io }) {
    client.on(channel, function (data) {
        let timer = data.timer;
        opers.SelectByDataAndLimit(models.FreeGame, {
            timer: timer
        }, 1, function (data) {
            let obj = {
                data: data.data,
                timer: timer
            }
            io.sockets.to(client.id).emit(channel, obj);
        })
    })
}