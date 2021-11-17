package com.chess;

import com.chess.engine.board.Board;
import com.chess.gui.Table;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import java.io.File;
import java.io.FileReader;
import java.io.IOException;

public class JChess {
    public static void main(String[] args) {
        JSONObject jsonObj = readJSON();
        JSONArray jsonBoard = (JSONArray) jsonObj.get("board");
        Board.Builder builder = new Board.Builder();
        Board board = builder.buildFromJson(jsonBoard, (String)jsonObj.get("computer"));
        System.out.println(board);

        //Table.get().setGameBoard(board);
        //Table.get().show();
    }

    static JSONObject readJSON() {
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