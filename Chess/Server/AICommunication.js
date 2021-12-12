import axios from 'axios';

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
            switch (figure) {
                case "P":
                    figure = "Pawn"; break;
                case "R":
                    figure = "Rook"; break;
                case "N":
                    figure = "Knight"; break;
                case "B":
                    figure = "Bishop"; break;
                case "K":
                    figure = "King"; break;
                case "Q":
                    figure = "Queen"; break;
            }
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
            console.log(new Date() + "fail");
            console.log(error);
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