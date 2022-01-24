package com.server;

import com.chess.board.Board;
import com.chess.board.Move;
import com.chess.board.MoveTransition;
import com.chess.pieces.Piece;
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
import java.util.Collection;
import java.util.List;
import java.util.Map;


@RestController
public class AIController {
    @RequestMapping(
            value = "/ai_module",
            method = RequestMethod.POST,
            consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE},
            produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})
    public @ResponseBody String returnMove(@RequestBody Map<String, Object> game) throws ParseException {
        Integer depth = (Integer) game.get("depth");
        String computer = (String) game.get("computer");

        ArrayList<ArrayList<JSONObject>> boardArrayList = (ArrayList<ArrayList<JSONObject>>) game.get("board");
        String json = new Gson().toJson(boardArrayList);
        JSONParser jsonParser = new JSONParser();
        Object object = jsonParser.parse(json);
        JSONArray arrayObj = (JSONArray) object;

        Board.Builder builder = new Board.Builder();
        Board board = builder.buildFromJson(arrayObj, computer);

        //StockAlphaBeta ai = new StockAlphaBeta(depth); // slower
        AlphaBetaWithMoveOrdering ai = new AlphaBetaWithMoveOrdering(depth); // faster
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

    @RequestMapping(
            value = "/get_notation",
            method = RequestMethod.POST,
            consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE},
            produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})
    public @ResponseBody String returnNotation(@RequestBody Map<String, Object> game) throws ParseException {
        ArrayList<ArrayList<JSONObject>> boardArrayList = (ArrayList<ArrayList<JSONObject>>) game.get("board");
        String player = (String) game.get("player");

        Integer fromX = (Integer) game.get("fromX");
        Integer fromY = ((8 - (Integer) game.get("fromY")) - 1) * 8;
        Integer posFrom = (fromX + fromY);
        Integer toX = (Integer) game.get("toX");
        Integer toY = ((8 - (Integer) game.get("toY")) - 1) * 8;
        Integer posTo = (toX + toY);

        System.out.println("Liczę pole skąd: " + posFrom);
        System.out.println("Liczę pole dokąd: " + posTo);
        System.out.println(player);

        String json = new Gson().toJson(boardArrayList);
        JSONParser jsonParser = new JSONParser();
        Object object = jsonParser.parse(json);
        JSONArray arrayObj = (JSONArray) object;

        Board.Builder builder = new Board.Builder();
        Board board = builder.buildFromJson(arrayObj, player);

        Collection<Move> legalMoves = board.currentPlayer().getLegalMoves();

        for (Move move : legalMoves) {
            if (move.getCurrentCoordinate() == posFrom
                    && move.getDestinationCoordinate() == posTo) {
                System.out.println(move.toString());
                return move.toString();
            }
        }

        return null;
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