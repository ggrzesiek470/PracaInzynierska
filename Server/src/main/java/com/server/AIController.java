package com.server;

import com.chess.engine.board.Board;
import com.chess.engine.board.BoardUtils;
import com.chess.engine.board.Move;
import com.chess.engine.player.ai.StockAlphaBeta;
import com.google.gson.Gson;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.lang.reflect.Array;
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
    public @ResponseBody String ReturnMove (@RequestBody Map<String, Object> payload) throws ParseException {

        Integer depth = (Integer)payload.get("depth");
        String computer = (String)payload.get("computer");

        ArrayList<ArrayList<JSONObject>> boardArrayList = (ArrayList<ArrayList<JSONObject>>) payload.get("board");
        String json = new Gson().toJson(boardArrayList);
        JSONParser jsonParser = new JSONParser();
        Object object = jsonParser.parse(json);
        JSONArray arrayObj=(JSONArray) object;

        Board.Builder builder = new Board.Builder();

        Board board = builder.buildFromJson(arrayObj, computer);

        StockAlphaBeta ai = new StockAlphaBeta(depth);
        Move bestMove = (Move) ai.execute(board);

        int[] oldPosition = bestMove.getMovedPiece().getPiecePositionXY(bestMove.getMovedPiece().getOldPosition());
        //int[] newPosition = bestMove.getMovedPiece().getPiecePositionXY(BoardUtils.INSTANCE.getCoordinateAtPosition(bestMove.toString().substring(1)));
        int[] newPosition = bestMove.getMovedPiece().getPiecePositionXY(bestMove.getDestinationCoordinate());

        return new StringBuilder().append(bestMove).append("<br>")
                .append(bestMove.getMovedPiece().getPieceAlliance().toString().charAt(0))
                .append(bestMove.getMovedPiece().getPieceType()).append(":")
                .append("(").append(8 - oldPosition[0]).append(",")
                .append(8 - oldPosition[1]).append(")").append("->")
                .append("(").append(8 - newPosition[0]).append(",")
                .append(8 - newPosition[1]).append(")").toString();
    }

    private static JSONObject readJSON() {
        File jsonFile = new File(System.getProperty("user.dir"), "src/board.json");
        JSONParser parser = new JSONParser();
        try (FileReader reader = new FileReader(jsonFile)) {
            Object obj = parser.parse(reader);
            return (JSONObject) obj;
        } catch (IOException | ParseException e) {
            e.printStackTrace();
        }
        return null;
    }
}