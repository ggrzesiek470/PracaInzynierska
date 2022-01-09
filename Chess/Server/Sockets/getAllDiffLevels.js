import Logger from '../Logger.js';

let channel = "getAllDiffLevels";

export default function getAllDiffLevels ({ client, opers, models, io }) {
    client.on(channel, function () {
        opers.SelectAll(models.DifficultyLevel, function (data) {
            io.sockets.to(client.id).emit(channel, data.data);
        })

    })
}