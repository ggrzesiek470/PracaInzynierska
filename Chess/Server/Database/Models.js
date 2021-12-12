export default function (mongoose) {
    var Schema = mongoose.Schema;

    var userSchema = new Schema(
    {
        login: { type: String, required: true },
        password: { type: String, required: true },
        wins: { type: Number, required: true },
        draws: { type: Number, required: true },
        losses: { type: Number, required: true },
        points: { type: Number, required: true },
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
        Game: mongoose.model("Game", gameSchema),
        FreeGame: mongoose.model("FreeGame", freeGameSchema),
    }
    //==========================================================
    var userSchema1= new Schema({
        id:{ type: Number, required: true },
        login:{ type: String, required: true },
        password:{ type: String, required: true },
        salt:{ type: String, required: true },
        email:{ type: String, required: true },
        rankingId:{ type: Number, required: true },
        mutedGames:{ type: Number, required: true },
        isBanned: { type: Boolean, required: true}
    });

    var rankingSchema=new Schema({
        id:{ type: Number, required: true },
        wins: { type: Number, required: true },
        draws: { type: Number, required: true },
        losses: { type: Number, required: true },
        points: { type: Number, required: true },
        rank:{ type: Number, required: true }
    });

    var historicalGameSchema=new Schema({
        id:{ type: Number, required: true },
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

    var difficultyLevelsSchema=new Schema({
        id:{ type: Number, required: true },
        name:{ type: String, required: true },
        stepForeseen:{ type: Number, required: true }
    });

    var gameSchema1=new Schema({
        id:{ type: Number, required: true },
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

    var ChatMessageSchema =new Schema ({
        id:{ type: Number, required: true },
        content:{ type: String, required: true },
        markedForReview: { type: Boolean, required: true},
        date:{ type:String, required: true},
        userId:{ type: Number, required: true }, // na schemacie authorid
        gameId: { type: Number, required: false },
        historicalGameId:{ type: Number, required:false }
    });


    return models;
}