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

    var difficultyLevelsSchema = new Schema({
        name:{ type: String, required: true },
        stepsForeseen:{ type: Number, required: true }
    });

    var gameSchema = new Schema({
        gameId: { type: Number, required: true },
        historyOfMoves:{ type: Array, required: false },
        currentBoardState:{ type: Array, required: false },
        isAiPlaying: { type: Boolean, required: false },
        whitePlayer:{ type: String, required: true },
        blackPlayer:{ type: String, required: true },
        difficultyLevel:{ type: "objectId", required: false },
        whitePlayerTimeLeft:{ type: Number, required: false },
        blackPlayerTimeLeft:{ type: Number, required: false },
        gameTime:{ type: Number, required: false },
    });

    var historicalGameSchema = new Schema({
        gameId: { type: Number, required: true },
        historyOfMoves:{ type: Array, required: false },
        currentBoardState:{ type: Array, required: false },
        isAiPlaying: { type: Boolean, required: false },
        whitePlayer:{ type: String, required: true },
        blackPlayer:{ type: String, required: true },
        difficultyLevel:{ type: "objectId", required: false },
        whitePlayerPointsGain:{ type: Number, required: false },
        blackPlayerPointsGain:{ type: Number, required: false },
        winInMoves:{ type: Number, required: false },
        gameTime:{ type: Number, required: false },
    });

    var chatMessageSchema = new Schema ({
        content: { type: String, required: true },
        markedForReview: { type: Boolean, required: false },
        date: { type: Date, required: true },
        userId: { type: Number, required: true }, // na schemacie authorid
        gameId: { type: Number, required: false },
        historicalGameId:{ type: Number, required: false }
    });

    var models = {
        User: mongoose.model("User", userSchema),
        Ranking: mongoose.model("Ranking", rankingSchema),
        DifficultyLevel: mongoose.model("DifficultyLevel", difficultyLevelsSchema),
        Game: mongoose.model("Game", gameSchema),
        HistoricalGame: mongoose.model("HistoricalGame", historicalGameSchema),
        FreeGame: mongoose.model("FreeGame", freeGameSchema),
        ChatMessage: mongoose.model("ChatMessage", chatMessageSchema)
    }

    return models;
}