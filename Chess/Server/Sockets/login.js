import Logger from '../Logger.js';
import GlobalData from '../GlobalData.js';

import SHA2 from 'sha2';

let zalogowani = GlobalData.zalogowani;
let channel = "login";

export default function login ({ client, opers, models, io }) {
    client.on(channel, function (data) {
        var index = zalogowani.findIndex((x) => {
            return x.login == data.login;
        })
        if (index == -1) {
            var sentPassword = data.password;

            opers.SelectByOnlyLogin(models.User, models.Ranking, data.login, (data) => {
                if (data.user.length > 0) {
                    var pass = data.user[0].password;
                    var salt = data.user[0].salt;
                    if (SHA2.SHA512_t(80, sentPassword+salt) == pass) { // Password verified
                        opers.SelectTopStatistics(models.Ranking, 10, (allRanking) => {
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
                        })
                    } else { // Bad password
                        io.sockets.to(client.id).emit(channel, { status: "badPassword" });
                    }
                } else {
                    io.sockets.to(client.id).emit(channel, { status: "userNonExistent" });
                }
            })

        } else { // User already logged
            var data1 = {
                status: "userAlreadyLogged",
            }

            io.sockets.to(client.id).emit(channel, data1);
        }
    })
}