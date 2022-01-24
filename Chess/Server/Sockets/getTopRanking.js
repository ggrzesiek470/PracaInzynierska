import Logger from '../Logger.js';
import GlobalData from '../GlobalData.js';

let zalogowani = GlobalData.zalogowani;
let channel = "getTopRanking";

export default function getTopRanking ({ client, opers, models, io }) {
    client.on(channel, async function () {
        let allRanking = await opers.SelectTopStatistics(models.Ranking, 50);

        let dataToDeliver = {
            allRanking: allRanking.data,
        }

        io.sockets.to(client.id).emit(channel, dataToDeliver);
    })
}