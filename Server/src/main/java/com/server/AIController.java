package com.server;

import com.chess.engine.board.Board;
import com.chess.engine.board.Move;
import com.chess.engine.player.ai.StockAlphaBeta;
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
    @GetMapping("/index")
    public String hello () {
        return "Hello, why are you here?";
    }

    @RequestMapping(
            value = "/ai_module",
            method = RequestMethod.POST,
            consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE},
            produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})
    public @ResponseBody String returnMove (@RequestBody Map<String, Object> game) throws ParseException {
        Integer depth = (Integer) game.get("depth");
        String computer = (String) game.get("computer");

        ArrayList<ArrayList<JSONObject>> boardArrayList = (ArrayList<ArrayList<JSONObject>>) game.get("board");
        String json = new Gson().toJson(boardArrayList);
        JSONParser jsonParser = new JSONParser();
        Object object = jsonParser.parse(json);
        JSONArray arrayObj = (JSONArray) object;

        Board.Builder builder = new Board.Builder();
        Board board = builder.buildFromJson(arrayObj, computer);

        StockAlphaBeta ai = new StockAlphaBeta(depth);
        Move bestMove = (Move) ai.execute(board);

        int[] oldPosition = bestMove.getMovedPiece().getPiecePositionXY(bestMove.getMovedPiece().getOldPosition());
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