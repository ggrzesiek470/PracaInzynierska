import Logger from '../Logger.js';
import GlobalData from '../GlobalData.js';

import md5 from 'md5';

let channel = "register";

export default function register ({ client, opers, models, io }) {
    client.on(channel, function (data) {
        var userData = {
            login: data.login,
            password: md5(data.password),
            wins: 0,
            draws: 0,
            losses: 0,
            points: 0,
        };

        var user = new models.User(userData);
        Logger.print("" + userData.login + " register on a server.", Logger.type.INFO, "Register");

        io.sockets.to(client.id).emit(channel, {
            status: "został zarejestrowany.",
            user: data.login
        });

        opers.InsertOne(user);
    })
}