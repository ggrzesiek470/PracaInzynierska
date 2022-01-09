import Logger from '../Logger.js';
import GlobalData from '../GlobalData.js';

import crypto from 'crypto';
import SHA2 from 'sha2';

let channel = "register";

export default {
    registerListener: function ({ client, opers, models, io }) {
        client.on(channel, function (data) {
            register(data, { client, opers, models, io });
        })
    },
    registerFunction: function (data, { client, opers, models, io }) {
        register(data, { client, opers, models, io });
    }
}

function register (data, { client, opers, models, io }) {
    var ranking = new models.Ranking({ username: data.login });
    opers.InsertOne(ranking, (rankingData) => {
        var salt = crypto.randomBytes(4);
        var userData = {
            login: data.login,
            password: SHA2.SHA512_t(80, data.password+salt),
            salt: salt,
            rankingId: rankingData._id,
        };

        var user = new models.User(userData);
        Logger.print("" + userData.login + " register on a server.", Logger.type.INFO, "Register");

        if (client != undefined && io != undefined) {
            io.sockets.to(client.id).emit(channel, {
                status: "został zarejestrowany.",
                user: data.login
            });
        }
        opers.InsertOne(user);
    });
}