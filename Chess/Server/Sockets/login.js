import Logger from '../Logger.js';
import GlobalData from '../GlobalData.js';

import SHA2 from 'sha2';

let zalogowani = GlobalData.zalogowani;
let channel = "login";

export default function login ({ client, opers, models, io }) {
    client.on(channel, async function (credentials) {
        var index = zalogowani.findIndex((x) => {
            return x.login == credentials.login;
        })
        if (index == -1) {
            var sentPassword = credentials.password;
            let data = await opers.SelectByOnlyLogin(models.User, models.Ranking, credentials.login);

            if (data.user.length > 0) {
                var pass = data.user[0].password;
                var salt = data.user[0].salt;
                if (SHA2.SHA512_t(80, sentPassword+salt) == pass) { // Password verified
                    let allRanking = await opers.SelectTopStatistics(models.Ranking, 10);

                    let dataToDeliver = {
                        user: data.user,
                        ranking: data.ranking,
                        allRanking: allRanking.data
                    }
                    zalogowani.push({
                        login: data.user[0].login,
                        id: client.id
                    });
                    io.sockets.to(client.id).emit(channel, dataToDeliver);
                } else { // Bad password
                    io.sockets.to(client.id).emit(channel, { status: "badPassword" });
                }
            } else { // User does not exist
                io.sockets.to(client.id).emit(channel, { status: "userNonExistent" });
            }

        } else { // User already logged
            var data1 = {
                status: "userAlreadyLogged",
            }

            io.sockets.to(client.id).emit(channel, data1);
        }
    })
}