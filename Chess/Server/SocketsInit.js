import Logger from './Logger.js';
import GlobalData from './GlobalData.js';
import Sockets from './Sockets/_socketsCompile.js';

export default class SocketsInit {
    constructor(io, opers, models) {
        var zalogowani = GlobalData.zalogowani;
        
        io.sockets.on("connection", function (client) {            
            Logger.print("Client of id " + client.id + " pops in to the server!", Logger.type.INFO, "Connect");

            var tools = {
                client: client, opers: opers, models: models, io: io
            }

            Sockets.disconnect(tools);
            Sockets.register(tools);
            Sockets.login(tools);
            Sockets.read(tools);
            Sockets.searchForGames(tools);
            Sockets.addFreeGame(tools);
            Sockets.joinGame(tools);
            Sockets.sendDataToAI(tools);
            Sockets.turn(tools);
            Sockets.getForRegister(tools);
            
        })
    }
}