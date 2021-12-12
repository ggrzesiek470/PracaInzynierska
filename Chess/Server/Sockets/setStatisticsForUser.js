import Logger from '../Logger.js';

let channel = "setStatisticsForUser";

export default function setStatisticsForUser ({ client, opers, models }) {
    client.on(channel, function (data) {
        Logger.print("Change of statistics of user " + data.user
                        + ". Wins: " + data.wins
                        + ", draws: " + data.draws
                        + ", losses: " + data.losses
                        + ", points: " + data.points,
                        Logger.type.INFO, "Stat change");
                    
        opers.UpdateStatistics(models.User, data.user, data.wins, data.draws, data.losses, data.points);
    })
}