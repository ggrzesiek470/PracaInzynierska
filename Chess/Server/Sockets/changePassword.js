import Logger from '../Logger.js';
import GlobalData from '../GlobalData.js';

import crypto from 'crypto';
import SHA2 from 'sha2';

let zalogowani = GlobalData.zalogowani;
let channel = "changePassword";

export default function changePassword ({ client, opers, models, io }) {
    client.on(channel, function (data) {
        console.log(data.newPassword)
        let nick = data.nick;
        var salt = crypto.randomBytes(4);
        var password = SHA2.SHA512_t(80, data.newPassword+salt);

        opers.ChangePassword(models.User, nick, password, salt);
    })
}