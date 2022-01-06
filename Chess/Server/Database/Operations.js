import Logger from './../Logger.js';

export default function () {
    var opers = {

        InsertOne: function (data, callback) {
            data.save(function (error, data) {
                if (error) Logger.print(error, Logger.type.CRITICAL, "Database Record INSERT Attempt - InsertOne func");
                if (callback) callback(data);
            })
        },

        SelectAll: function (Model, callback) {
            var obj = {};
            Model.find({}, function (err, data) {
                if (err) {
                    Logger.print(err, Logger.type.CRITICAL, "Database Record SELECT Attempt - SelectAll func");
                    obj.data = err;
                } else {
                    obj.data = data;
                }
                callback(obj);
            })
        },

        SelectAndLimit: function (Model, count, callback) {
            var obj = {};
            Model.find({}, function (err, data) {
                if (err) {
                    Logger.print(err, Logger.type.CRITICAL, "Database Record SELECT Attempt - SelectAndLimit func");
                    obj.data = err;
                }
                else obj.data = data;
                callback(obj);
            }).limit(count)
        },

        DeleteByWaitingPlayer: function (Model, waitingPlayer) {
            Model.deleteOne({ waitingPlayer: waitingPlayer }, function (err, data) {
                if (err) {
                    Logger.print(err, Logger.type.CRITICAL, "Database Record DELETE Attempt - DeleteByWaitingPlayer func");
                    return console.error(err);
                }
            })
        },

        DeleteAll: function (Model) {
            Model.deleteMany(function (err, data) {
                if (err) {
                    Logger.print(err, Logger.type.CRITICAL, "Database Record DELETE Attempt - DeleteAll func");
                    return console.error(err);
                }
            })
        },

        DeleteById: function (Model, _id) {
            Model.deleteOne({ _id: _id }, function (err, data) {
                if (err) {
                    Logger.print(err, Logger.type.CRITICAL, "Database Record DELETE Attempt - DeleteById func");
                    return console.error(err);
                }
            })
        },

        DeleteFirst: function (Model) {
            Model.deleteOne({}, function (err, data) {
                if (err) {
                    Logger.print(err, Logger.type.CRITICAL, "Database Record DELETE Attempt - DeleteFirst func");
                    return console.error(err);
                }
            })
        },

        SelectByOnlyLogin: function (ModelUser, ModelRanking, login, callback) {
            var obj = {};
            ModelUser.find({ login: login }, function (err, data) {
                if (err) {
                    Logger.print(err, Logger.type.CRITICAL, "Database Record SELECT Attempt - SelectByOnlyLogin func - in ModelUser section.");
                    obj.user = err;
                } else {
                    obj.user = data;
                }
                if (ModelRanking && data.length > 0) {
                    ModelRanking.find({ _id: data[0].rankingId }, function (err, data) {
                        if (err) {
                            Logger.print(err, Logger.type.CRITICAL, "Database Record SELECT Attempt - SelectByOnlyLogin func - in ModelRanking section.");
                            obj.ranking = err;
                        } else {
                            obj.ranking = data;
                        }
                        callback(obj);
                    }).limit(1)
                } else {
                    callback(obj);
                }
            }).limit(1)
        },
        SelectByLogin: function (Model, login, password, count, callback) {
            var obj = {};
            Model.find({ login: login, password: password }, function (err, data) {
                if (err) {
                    Logger.print(err, Logger.type.CRITICAL, "Database Record SELECT Attempt - SelectByLogin func");
                    obj.data = err;
                } else {
                    obj.data = data;
                }
                callback(obj);
            }).limit(count)
        },

        SelectByGameId: function (Model, gameId, count, callback) {
            var obj = {};
            Model.find({ gameId: gameId }, function (err, data) {
                if (err) {
                    Logger.print(err, Logger.type.CRITICAL, "Database Record SELECT Attempt - SelectByGameId func");
                    obj.data = err;
                } else {
                    obj.data = data;
                }
                callback(obj);
            }).limit(count)
        },

        SelectTopStatistics: function (Model, topCount, callback) {
            let obj = {};
            Model.find({}, function (err, data) {
                if (err) {
                    Logger.print(err, Logger.type.CRITICAL, "Database Record SELECT Attempt - SelectTopStatistics func");
                    obj.data = err;
                } else {
                    obj.data = data;
                }
                callback(obj);
            }).limit(topCount).sort({  points: -1, rank: -1, wins: -1, losses: 1, draws: -1, username: -1  })
        },

        UpdateStatistics: function (Model, login, wins, draws, losses, points) {
            Model.update({ username: login }, { username: login, wins: wins, draws: draws, losses: losses, points: points }, function (err, data) {
                if (err) {
                    Logger.print(err, Logger.type.CRITICAL, "Database Record UPDATE Attempt - UpdateStatistics func");
                    return console.error(err);
                }
            })
        },
    }

    return opers;
}