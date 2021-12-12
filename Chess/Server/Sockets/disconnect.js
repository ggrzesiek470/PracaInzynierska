import Logger from '../Logger.js';
import GlobalData from '../GlobalData.js';

let zalogowani = GlobalData.zalogowani;
let channel = "disconnect";

export default function disconnect ({ client, opers, models }) {
    client.on(channel, function () {
        var waitingPlayer = zalogowani.find((a) => {
            return a.id == client.id;
        })?.login;

        if (waitingPlayer != undefined) {
            opers.DeleteByWaitingPlayer(models.FreeGame, waitingPlayer);
        }

        var zalogowanyId = zalogowani.findIndex((a) => {
            return a.id == client.id;
        });
        if (zalogowanyId != undefined && zalogowanyId != -1) {
            zalogowani.splice(zalogowanyId, 1);
        }

        Logger.print("Client of id " + client.id + " leaves the server.", Logger.type.INFO, "Disconnect");
    })
}