package com.chess.player.ai;

import com.chess.board.Board;
import com.chess.board.BoardUtils;
import com.chess.board.Move;
import com.chess.board.MoveTransition;

import java.util.concurrent.atomic.AtomicLong;

public final class MiniMax implements MoveStrategy {
    private final BoardEvaluator evaluator;
    private final int searchDepth;
    private long boardsEvaluated;
    private FreqTableRow[] freqTable;
    private int freqTableIndex;


    public MiniMax(final int searchDepth) {
        this.evaluator = StandardBoardEvaluator.get();
        this.boardsEvaluated = 0;
        this.searchDepth = searchDepth;
    }

    @Override
    public String toString() {
        return "MiniMax";
    }

    @Override
    public long getNumBoardsEvaluated() {
        return this.boardsEvaluated;
    }

    public Move execute(final Board board) {
        Move bestMove = Move.MoveFactory.getNullMove();
        int highestSeenValue = Integer.MIN_VALUE;
        int lowestSeenValue = Integer.MAX_VALUE;
        int currentValue;

        this.freqTable = new FreqTableRow[board.currentPlayer().getLegalMoves().size()];
        this.freqTableIndex = 0;

        for (final Move move: board.currentPlayer().getLegalMoves()) {
            final MoveTransition moveTransition = board.currentPlayer().makeMove(move);
            if (moveTransition.getMoveStatus().isDone()) {
                final FreqTableRow row = new FreqTableRow(move);
                this.freqTable[this.freqTableIndex] = row;
                currentValue = board.currentPlayer().getAlliance().isWhite() ?
                        min(moveTransition.getToBoard(), this.searchDepth - 1) :
                        max(moveTransition.getToBoard(), this.searchDepth - 1);

                this.freqTableIndex++;

                if (board.currentPlayer().getAlliance().isWhite() &&
                    currentValue >= highestSeenValue) {
                    highestSeenValue = currentValue;
                    bestMove = move;
                } else if (board.currentPlayer().getAlliance().isBlack() &&
                           currentValue <= lowestSeenValue) {
                    lowestSeenValue = currentValue;
                    bestMove = move;
                }
            }
        }

        long total = 0;
        for (final FreqTableRow row: this.freqTable)
            if (row != null) total += row.getCount();

        if (this.boardsEvaluated != total) System.out.println("somethings wrong with the # of boards evaluated!");

        return bestMove;
    }

    private int min(final Board board, final int depth) {
        if (depth == 0) {
            this.boardsEvaluated++;
            this.freqTable[this.freqTableIndex].increment();
            return this.evaluator.evaluate(board, depth);
        }

        if (isEndGameScenario(board)) return this.evaluator.evaluate(board, depth);

        int lowestSeenValue = Integer.MAX_VALUE;
        for (final Move move: board.currentPlayer().getLegalMoves()) {
            final MoveTransition moveTransition = board.currentPlayer().makeMove(move);

            if (moveTransition.getMoveStatus().isDone()) {
                final int currentValue = max(moveTransition.getToBoard(), depth - 1);
                if (currentValue <= lowestSeenValue) lowestSeenValue = currentValue;
            }
        }

        return lowestSeenValue;
    }

    private int max(final Board board, final int depth) {
        if (depth == 0) {
            this.boardsEvaluated++;
            this.freqTable[this.freqTableIndex].increment();

            return this.evaluator.evaluate(board, depth);
        }

        if (isEndGameScenario(board)) return this.evaluator.evaluate(board, depth);

        int highestSeenValue = Integer.MIN_VALUE;
        for (final Move move: board.currentPlayer().getLegalMoves()) {
            final MoveTransition moveTransition = board.currentPlayer().makeMove(move);
            if (moveTransition.getMoveStatus().isDone()) {
                final int currentValue = min(moveTransition.getToBoard(), depth - 1);
                if (currentValue >= highestSeenValue) highestSeenValue = currentValue;
            }
        }

        return highestSeenValue;
    }

    private static boolean isEndGameScenario(final Board board) {
        return board.currentPlayer().isInCheckMate() || board.currentPlayer().isInStaleMate();
    }


    private static class FreqTableRow {
        private final Move move;
        private final AtomicLong count;


        FreqTableRow(final Move move) {
            this.count = new AtomicLong();
            this.move = move;
        }

        long getCount() {
            return this.count.get();
        }

        void increment() {
            this.count.incrementAndGet();
        }

        @Override
        public String toString() {
            return BoardUtils.INSTANCE.getPositionAtCoordinate(this.move.getCurrentCoordinate()) +
                   BoardUtils.INSTANCE.getPositionAtCoordinate(this.move.getDestinationCoordinate()) +
                   " : " + this.count;
        }
    }
}