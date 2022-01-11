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
    public @ResponseBody String returnMove(@RequestBody Map<String, Object> game) throws ParseException {
        Integer searchDepth = (Integer) game.get("depth");
        String computerPlayerAllianceString = (String) game.get("computer");

        ArrayList<ArrayList<JSONObject>> boardAsArrayList = (ArrayList<ArrayList<JSONObject>>) game.get("board");
        String jsonFromBoard = new Gson().toJson(boardAsArrayList);
        JSONParser jsonParser = new JSONParser();
        Object objectFromBoardJson = jsonParser.parse(jsonFromBoard);
        JSONArray boardAsObjArray = (JSONArray) objectFromBoardJson;

        Board.Builder builder = new Board.Builder();
        Board board = builder.buildFromJSON(boardAsObjArray, computerPlayerAllianceString);

        AlphaBetaWithMoveOrdering ai = new AlphaBetaWithMoveOrdering(searchDepth);
        Move move = (Move) ai.execute(board);

        int[] oldPosition = move.getMovedPiece().getPiecePositionXY(move.getCurrentCoordinate());
        int[] newPosition = move.getMovedPiece().getPiecePositionXY(move.getDestinationCoordinate());

        StringBuilder bestMoveString = new StringBuilder();
        bestMoveString.append(move).append("<br>")
                .append(move.getMovedPiece().getPieceAlliance().toString().charAt(0))
                .append(move.getMovedPiece().getPieceType()).append(":")
                .append("(").append(8 - oldPosition[0]).append(",")
                .append(oldPosition[1]).append(")").append("->")
                .append("(").append(8 - newPosition[0]).append(",")
                .append(newPosition[1]).append(")");
        System.out.println(bestMoveString);

        return bestMoveString.toString();
    }
}