import Logger from './Logger.js';
import register from './Sockets/register.js';

let registerFunction = register.registerFunction;

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
            opers.DeleteAll(models.FreeGame); // Clearing all free games from DB
            opers.DeleteAll(models.Game); // Clearing all existing games from DB
            // Registering admin if it's non-existent
            opers.SelectByOnlyLogin(models.User, models.Ranking, "admin", (data) => {
                if (data.user.length == 0) {
                    registerFunction({
                        login: "admin",
                        password: "admin123",
                    },
                    {
                        opers: opers,
                        models: models
                    });
                }
            });
            // Creating difficulty levels if they're non-existent
            opers.SelectAll(models.DifficultyLevel, (data) => {
                if (data.data.length == 0) {
                    let diffLevels = [ 
                        { name: "Łatwy", stepsForeseen: 1 },
                        { name: "Normalny", stepsForeseen: 2 },
                        { name: "Trudny", stepsForeseen: 3 },
                        { name: "Bardzo trudny", stepsForeseen: 4 },
                        { name: "Spróbuj szczęścia", stepsForeseen: 5 }
                    ];

                    diffLevels.forEach(difficultyData => {
                        var diff = new models.DifficultyLevel(difficultyData);
                        opers.InsertOne(diff);
                    });
                }
            })
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