import Logger from '../Logger.js';
import GlobalData from '../GlobalData.js';

let channel = "addFreeGame";

export default function addFreeGame ({ client, opers, models }) {
    client.on(channel, function (data) {
        var freegame = new models.FreeGame({
            waitingPlayer: data.login,
            timer: data.timer
        });

        opers.InsertOne(freegame);
    })
}