import Logger from './Logger.js';

export default class MongoCommunication {
    
    static db;

    static init (mongoose, opers, models) {
        mongoose.connect('mongodb://localhost/ClassicChess', { useUnifiedTopology: true, useNewUrlParser: true });

        let db = mongoose.connection;
        db.on("error", function (err) {
            let message = "Database error: MongoDB has occured an error and cannot continue.";
            Logger.print(message, Logger.type.CRITICAL, "Init");
        });
        db.once("open", function () {
            let message = "App initialization: MongoDB has been connected and it's working!";
            Logger.print(message, Logger.type.INFO, "Init");
            opers.DeleteAll(models.FreeGame); // clearing all free games from DB
            opers.DeleteAll(models.Game); // clearing all existing games from DB
        });
        db.once("close", function () {
            let message = "App exit: MongoDB has been closed.";
            Logger.print(message, Logger.type.INFO, "Exit");
        });
        this.db = db;
    }

    static getDB () {
        return this.db;
    }
}