package com.server;

import com.chess.engine.board.Board;
import com.chess.engine.board.Move;
import com.chess.engine.player.ai.StockAlphaBeta;
import com.chess.gui.Table;
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
        return new String("Hello, why are you here?");
    }

    @GetMapping("/ai_module")
    public String String(/*@RequestParam(value = "game", defaultValue = "") JSONObject jsonObj*/) {
        JSONObject jsonObj = readJSON();
        JSONArray jsonBoard = (JSONArray) jsonObj.get("board");
        Board.Builder builder = new Board.Builder();
        Board board = builder.buildFromJson(jsonBoard, (String)jsonObj.get("computer"));
        StockAlphaBeta ai = new StockAlphaBeta(((Long)jsonObj.get("depth")).intValue());

        return ((Move)ai.execute(board)).toString();
    }

    JSONObject readJSON() {
        File jsonFile = new File(System.getProperty("user.dir"), "Server/src/board.json");
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