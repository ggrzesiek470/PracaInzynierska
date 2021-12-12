import Logger from '../Logger.js';
import GlobalData from '../GlobalData.js';

let zalogowani = GlobalData.zalogowani;
let channel = "read";

export default function read ({ client, opers, models, io }) {
    client.on(channel, function (data) {
        opers.SelectAll(models.User, function (data) {
            io.sockets.to(client.id).emit(channel, data);
        })
    })
}