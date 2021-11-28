package com.server;

import com.chess.engine.board.Board;
import com.chess.engine.board.BoardUtils;
import com.chess.engine.board.Move;
import com.chess.engine.player.ai.StockAlphaBeta;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.io.FileReader;
import java.io.IOException;


@RestController
public class AIController {
    @GetMapping("/index")
    public String hello () {
        return "Hello, why are you here?";
    }

    @GetMapping("/ai_module")
    public String String(/*@RequestParam(value = "game", defaultValue = "") JSONObject jsonObj*/) {
        JSONObject jsonObj = readJSON();
        JSONArray jsonBoard = (JSONArray) jsonObj.get("board");

        Board.Builder builder = new Board.Builder();
        Board board = builder.buildFromJson(jsonBoard, (String)jsonObj.get("computer"));

        StockAlphaBeta ai = new StockAlphaBeta(((Long)jsonObj.get("depth")).intValue());
        Move bestMove = (Move) ai.execute(board);

        int[] oldPosition = bestMove.getMovedPiece().getPiecePositionXY(bestMove.getMovedPiece().getOldPosition());
        int[] newPosition = bestMove.getMovedPiece().getPiecePositionXY(BoardUtils.INSTANCE.getCoordinateAtPosition(bestMove.toString().substring(1)));

        return new StringBuilder().append(bestMove).append("<br>")
                .append(bestMove.getMovedPiece().getPieceAlliance().toString().charAt(0))
                .append(bestMove.getMovedPiece().getPieceType()).append("<br>")
                .append("(").append(oldPosition[0]).append(",")
                .append(oldPosition[1]).append(")").append("->")
                .append("(").append(newPosition[0]).append(",")
                .append(newPosition[1]).append(")").toString();
    }

    JSONObject readJSON() {
//        File jsonFile = new File(System.getProperty("user.dir"), "Server/src/board.json");
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