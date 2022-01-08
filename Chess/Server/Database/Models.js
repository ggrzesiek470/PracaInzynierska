export default function (mongoose) {
    var Schema = mongoose.Schema;

    var userSchema = new Schema({
        login: { type: String, required: true },
        password: { type: String, required: true },
        salt: { type: String, required: true },
        email: { type: String, required: false },
        rankingId: { type: "objectId", required: true },
        mutedGames: { type: Array, required: false, default: [] },
        isBanned: { type: Boolean, required: false, default: false }
    });

    var rankingSchema = new Schema({
        username: { type: String, required: true },
        wins: { type: Number, required: false, default: 0 },
        draws: { type: Number, required: false, default: 0 },
        losses: { type: Number, required: false, default: 0 },
        points: { type: Number, required: false, default: 0 },
        rank:{ type: Number, required: false, default: 0 }
    });

    var freeGameSchema = new Schema({
        waitingPlayer: { type: String, required: true },
    })

    var gameSchema = new Schema(
    {
        gameId: { type: Number, required: true },
        whitePlayer: { type: String, required: true },
        blackPlayer: { type: String, required: true },
    });

    var models = {
        User: mongoose.model("User", userSchema),
        Ranking: mongoose.model("Ranking", rankingSchema),
        Game: mongoose.model("Game", gameSchema),
        FreeGame: mongoose.model("FreeGame", freeGameSchema),
    }
    //==========================================================

    var historicalGameSchema = new Schema({
        historyOfMoves:{ type: Array, required: true },
        currentBoardState:{ type: Array, required: true },
        isAiPlaying: { type: Boolean, required: true},
        whitePlayer:{ type: Number, required: true },
        blackPlayer:{ type: Number, required: true },
        difficultyLevels:{ type: Number, required: true },
        whitePlayerPointsGain:{ type: Number, required: true },
        blackPlayerPointsGain:{ type: Number, required: true },
        winInMoves:{ type: Number, required: true },
        gameTime:{ type: Number, required: true }, // tu powinno być coś innego 
    });

    var difficultyLevelsSchema = new Schema({
        name:{ type: String, required: true },
        stepForeseen:{ type: Number, required: true }
    });

    var gameSchema1 = new Schema({
        historyOfMoves:{ type: Array, required: true },
        currentBoardState:{ type: Array, required: true },
        isAiPlaying: { type: Boolean, required: true},
        whitePlayer:{ type: Number, required: true },
        blackPlayer:{ type: Number, required: true },
        difficultyLevels:{ type: Number, required: true },
        whitePlayerPointsGain:{ type: Number, required: true },
        blackPlayerPointsGain:{ type: Number, required: true },
        gameTime:{ type: Number, required: true }, // tu powinno być coś innego 
    });

    var ChatMessageSchema = new Schema ({
        content:{ type: String, required: true },
        markedForReview: { type: Boolean, required: true},
        date:{ type:String, required: true},
        userId:{ type: Number, required: true }, // na schemacie authorid
        gameId: { type: Number, required: false },
        historicalGameId:{ type: Number, required:false }
    });


    return models;
}