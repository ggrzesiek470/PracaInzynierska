import disconnect from './disconnect.js';
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

var Sockets = {
    disconnect: disconnect,
    register: register,
    login: login,
    read: read,
    searchForGames: searchForGames,
    addFreeGame: addFreeGame,
    joinGame: joinGame,
    sendDataToAI: sendDataToAI,
    turn: turn,
    getForRegister: getForRegister,
    setStatisticsForUser: setStatisticsForUser,
    sendMessageByChat: sendMessageByChat
}

export default Sockets;