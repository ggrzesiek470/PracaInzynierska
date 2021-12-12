import Logger from '../Logger.js';
import GlobalData from '../GlobalData.js';
import AICommunication from "../AICommunication.js";

let channel = "sendDataToAI";
let channelBack = "turn";

export default function sendDataToAI ({ client, opers, models, io }) {
    client.on(channel, function (data) {
        AICommunication.sendDataToAIServer(data.localTable, data.depth, data.computer, function (response) {
            var dataToSend = {
                pawn: {
                    position: {
                        x: response.from.x,
                        y: response.from.y
                    },
                    type: response.type
                },
                xDes: response.to.x,
                yDes: response.to.y,
                enPassant: response.enpassant,
                casting: response.casting,
                from_ai: true
            }    
            io.sockets.to(client.id).emit(channelBack, dataToSend);
        });
    });
}