import disconnect from './disconnect.js';
import getAllDiffLevels from './getAllDiffLevels.js';
import register from './register.js';
import login from './login.js';
import read from './read.js';
import searchForGames from './searchForGames.js';
import addFreeGame from './addFreeGame.js';
import joinGame from './joinGame.js';
import sendDataToAI from './sendDataToAI.js';
import turn from './turn.js';
import getForRegister from './getForRegister.js';
import setStatisticsForUser from './setStatisticsForUser.js';
import sendMessageByChat from './sendMessageByChat.js';
import surrender from './surrender.js';
import sendStalematePreposition from './sendStalematePreposition.js';
import getTopRanking from './getTopRanking.js';
import changePassword from './changePassword.js';

var Sockets = {
    disconnect: disconnect,
    register: register.registerListener,
    login: login,
    read: read,
    searchForGames: searchForGames,
    addFreeGame: addFreeGame,
    joinGame: joinGame,
    sendDataToAI: sendDataToAI,
    turn: turn,
    getForRegister: getForRegister,
    setStatisticsForUser: setStatisticsForUser,
    sendMessageByChat: sendMessageByChat,
    getAllDiffLevels: getAllDiffLevels,
    surrender: surrender,
    sendStalematePreposition: sendStalematePreposition,
    getTopRanking: getTopRanking,
    changePassword: changePassword
}

export default Sockets;