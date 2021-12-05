package com.server;

import com.chess.board.Board;
import com.chess.board.Move;
import com.chess.player.ai.AlphaBetaWithMoveOrdering;
import com.chess.player.ai.StockAlphaBeta;
import com.google.gson.Gson;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Map;


@RestController
public class AIController {
    @RequestMapping(
            value = "/ai_module",
            method = RequestMethod.POST,
            consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE},
            produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})
<<<<<<< HEAD
    public @ResponseBody String ReturnMove (@RequestBody Map<String, Object> payload) throws ParseException {
        Integer depth = (Integer)payload.get("depth");
        String computer = (String)payload.get("computer");

        ArrayList<ArrayList<JSONObject>> boardArrayList = (ArrayList<ArrayList<JSONObject>>) payload.get("board");
=======
    public @ResponseBody String returnMove(@RequestBody Map<String, Object> game) throws ParseException {
        Integer depth = (Integer) game.get("depth");
        String computer = (String) game.get("computer");

        ArrayList<ArrayList<JSONObject>> boardArrayList = (ArrayList<ArrayList<JSONObject>>) game.get("board");
>>>>>>> 21bb94fdd117c6a13b5514887765f7a2f3e5be3b
        String json = new Gson().toJson(boardArrayList);
        JSONParser jsonParser = new JSONParser();
        Object object = jsonParser.parse(json);
        JSONArray arrayObj = (JSONArray) object;

        Board.Builder builder = new Board.Builder();
        Board board = builder.buildFromJson(arrayObj, computer);

        //StockAlphaBeta ai = new StockAlphaBeta(depth); // slower
        AlphaBetaWithMoveOrdering ai = new AlphaBetaWithMoveOrdering(depth); // faster
        Move bestMove = (Move) ai.execute(board);

<<<<<<< HEAD
        int[] oldPosition = bestMove.getMovedPiece().getPiecePositionXY(bestMove.getMovedPiece().getOldPosition());
=======
        int[] oldPosition = bestMove.getMovedPiece().getPiecePositionXY(bestMove.getCurrentCoordinate());
>>>>>>> 21bb94fdd117c6a13b5514887765f7a2f3e5be3b
        int[] newPosition = bestMove.getMovedPiece().getPiecePositionXY(bestMove.getDestinationCoordinate());

        StringBuilder bestMoveString = new StringBuilder();
        bestMoveString.append(bestMove).append("<br>")
                .append(bestMove.getMovedPiece().getPieceAlliance().toString().charAt(0))
                .append(bestMove.getMovedPiece().getPieceType()).append(":")
                .append("(").append(8 - oldPosition[0]).append(",")
                .append(oldPosition[1]).append(")").append("->")
                .append("(").append(8 - newPosition[0]).append(",")
<<<<<<< HEAD
                .append(newPosition[1]).append(")").toString();
=======
                .append(newPosition[1]).append(")");
        System.out.println(bestMoveString);

        return bestMoveString.toString();
>>>>>>> 21bb94fdd117c6a13b5514887765f7a2f3e5be3b
    }

    // bug fixed, Pawn class code changed
    @GetMapping("/error/{depth}")
    public String errorTest(@PathVariable int depth) {
        Board.Builder builder = new Board.Builder();
        Board board = builder.errorBoard();
        StockAlphaBeta ai = new StockAlphaBeta(depth);
        Move bestMove = (Move) ai.execute(board);
        int[] oldPosition = bestMove.getMovedPiece().getPiecePositionXY(bestMove.getCurrentCoordinate());
        int[] newPosition = bestMove.getMovedPiece().getPiecePositionXY(bestMove.getDestinationCoordinate());

        StringBuilder bestMoveString = new StringBuilder();
        bestMoveString.append(bestMove).append("<br>")
                .append(bestMove.getMovedPiece().getPieceAlliance().toString().charAt(0))
                .append(bestMove.getMovedPiece().getPieceType()).append(":")
                .append("(").append(8 - oldPosition[0]).append(",")
                .append(oldPosition[1]).append(")").append("->")
                .append("(").append(8 - newPosition[0]).append(",")
                .append(newPosition[1]).append(")");
        System.out.println(bestMoveString);

        return bestMoveString.toString();
    }
}