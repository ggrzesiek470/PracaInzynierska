package com.tests;

import com.chess.engine.Alliance;
import com.chess.engine.board.Board;
import com.chess.engine.pieces.King;
import com.chess.engine.pieces.Pawn;
import org.junit.jupiter.api.Test;

class EndlessCheckTest {
    @Test
    public void testEndlessCheck() {
        final Board.Builder builder = new Board.Builder();

        builder.setPiece(new King(Alliance.BLACK, 9, false, false));
        builder.setPiece(new Pawn(Alliance.BLACK, 8));
        builder.setPiece(new Pawn(Alliance.BLACK, 10));
        builder.setPiece(new Pawn(Alliance.BLACK, 13));
        builder.setPiece(new Pawn(Alliance.BLACK, 15));
        builder.setPiece(new Pawn(Alliance.BLACK, 26));

        builder.setPiece(new King(Alliance.WHITE, 42, false, false));
        builder.setPiece(new Pawn(Alliance.WHITE, 48));
        builder.setPiece(new Pawn(Alliance.WHITE, 54));

        builder.setMoveMaker(Alliance.BLACK);
        final Board board = builder.build();
        System.out.println(board);
    }
}