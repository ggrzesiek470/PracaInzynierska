package com.chess.player.ai;

import com.chess.board.Board;
import com.chess.board.Move;

public interface MoveStrategy {
    long getNumBoardsEvaluated();
    Move execute(Board board);
}
