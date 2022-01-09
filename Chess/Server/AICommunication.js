import axios from 'axios';

import Logger from './Logger.js';

export default class AICommunication {
    static AI_URL = "http://localhost:3001/ai_module";

    static sendDataToAIServer (board, depth, computer, callback) {
        axios.post(this.AI_URL, this.toJSON(board, depth, computer))
          .then((response) => {
            let coords = response.data.split(":")[1];
            let move = response.data.split("<br>")[0];
            let casting = (move == "0-0" || move == "0-0-0");
            let enpassant = move.split(";").length > 1 ? true : false; 
            let color = response.data.split("<br>")[1][0] == "W" ? "white" : "black";
            var figure = response.data.split("<br>")[1][1];
            
            let assoc = { "P": "Pawn", "R": "Rook", "N": "Knight", "B": "Bishop", "K": "King", "Q": "Queen" };
            figure = assoc[figure];

            let from = {
                x: parseInt(coords.split("->")[0][3]),
                y: parseInt(coords.split("->")[0][1])
            };
            let to = {
                x: parseInt(coords.split("->")[1][3]),
                y: parseInt(coords.split("->")[1][1])
            };

            callback({
                from: from,
                to: to,
                casting: casting,
                enpassant: enpassant,
                type: figure,
                color: color
            });
          })
          .catch((error) => {
            Logger.print(error, Logger.type.CRITICAL, "AI Connection Attempt. Request sent. Got type error");
          });
    }

    static toJSON(board, depth, computer) {
        var data = {
            board: board,
            depth: depth,
            computer: computer
        }
        
        return data;
    }
}