import Logger from '../Logger.js';
import GlobalData from '../GlobalData.js';

import md5 from 'md5';

let zalogowani = GlobalData.zalogowani;
let channel = "login";

export default function login ({ client, opers, models, io }) {
    client.on(channel, function (data) {
        var checking = false;
        for (var i = 0; i < zalogowani.length; i++) {
            if (zalogowani[i].login == data.login) {
                checking = true;
            }
        }
        if (checking == false) {
            var dane = {
                login: data.login,
                id: client.id
            }

            opers.SelectByLogin(models.User, data.login, md5(data.password), 1, function (data) {
                if (data.data.length > 0) zalogowani.push(dane);
                io.sockets.to(client.id).emit(channel, data);
            })
        } else {
            var data1 = {
                status: "deny",
            }

            io.sockets.to(client.id).emit(channel, data1);
        }
    })
}