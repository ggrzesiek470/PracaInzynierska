import Logger from '../Logger.js';
import GlobalData from '../GlobalData.js';

let channel = "getForRegister";

export default function getForRegister ({ client, opers, models, io }) {
    client.on(channel, function (data) {
        opers.SelectAll(models.User, function (data) {
            io.sockets.to(client.id).emit(channel, data);
        })
    })
}