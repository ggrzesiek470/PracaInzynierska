package com.chess.player.ai;

import com.chess.board.Board;

public interface BoardEvaluator {
    int evaluate(Board board, int depth);
}
