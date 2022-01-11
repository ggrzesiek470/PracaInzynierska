package com.chess.player.ai;

import com.chess.board.Board;
import com.chess.board.BoardUtils;
import com.chess.board.Move;
import com.chess.board.MoveTransition;
import com.chess.player.Player;
import com.google.common.collect.ComparisonChain;
import com.google.common.collect.Ordering;

import java.util.Collection;
import java.util.Comparator;

public class StockAlphaBeta implements MoveStrategy {
    private final BoardEvaluator evaluator;
    private final int searchDepth;
    private long boardsEvaluated;
    private int quiescenceCount;
    private static final int MAX_QUIESCENCE = 5000 * 5;


    private enum MoveSorter {
        STANDARD {
            @Override
            Collection<Move> sort(final Collection<Move> moves) {
                return Ordering.from((Comparator<Move>)(move1, move2) -> ComparisonChain.start()
                       .compareTrueFirst(move1.isCastlingMove(), move2.isCastlingMove())
                       .compare(BoardUtils.mvvlva(move2), BoardUtils.mvvlva(move1))
                       .result()).immutableSortedCopy(moves);
            }
        },

        EXPENSIVE {
            @Override
            Collection<Move> sort(final Collection<Move> moves) {
                return Ordering.from((Comparator<Move>) (move1, move2) -> ComparisonChain.start()
                        .compareTrueFirst(BoardUtils.kingThreat(move1), BoardUtils.kingThreat(move2))
                        .compareTrueFirst(move1.isCastlingMove(), move2.isCastlingMove())
                        .compare(BoardUtils.mvvlva(move2), BoardUtils.mvvlva(move1))
                        .result()).immutableSortedCopy(moves);
            }
        };

        abstract Collection<Move> sort(Collection<Move> moves);
    }

    public StockAlphaBeta(final int searchDepth) {
        this.evaluator = StandardBoardEvaluator.get();
        this.searchDepth = searchDepth;
        this.boardsEvaluated = 0;
        this.quiescenceCount = 0;
    }

    @Override
    public String toString() {
        return "StockAB";
    }

    @Override
    public long getNumBoardsEvaluated() {
        return this.boardsEvaluated;
    }

    @Override
    public Move execute(final Board board) {
        final Player currentPlayer = board.currentPlayer();
        Move bestMove = Move.MoveFactory.getNullMove();
        int highestSeenValue = Integer.MIN_VALUE;
        int lowestSeenValue = Integer.MAX_VALUE;
        int currentValue;

        for (final Move move: MoveSorter.EXPENSIVE.sort(board.currentPlayer().getLegalMoves())) {
            move.getMovedPiece().setOldPosition(move.getCurrentCoordinate());

            final MoveTransition moveTransition = board.currentPlayer().makeMove(move);
            this.quiescenceCount = 0;

            if (moveTransition.getMoveStatus().isDone()) {
                currentValue = currentPlayer.getAlliance().isWhite() ?
                        min(moveTransition.getToBoard(), this.searchDepth - 1, highestSeenValue, lowestSeenValue) :
                        max(moveTransition.getToBoard(), this.searchDepth - 1, highestSeenValue, lowestSeenValue);

                if (currentPlayer.getAlliance().isWhite() && currentValue > highestSeenValue) {
                    highestSeenValue = currentValue;
                    bestMove = move;
                    if (moveTransition.getToBoard().blackPlayer().isInCheckMate()) break;
                } else if (currentPlayer.getAlliance().isBlack() && currentValue < lowestSeenValue) {
                    lowestSeenValue = currentValue;
                    bestMove = move;
                    if (moveTransition.getToBoard().whitePlayer().isInCheckMate()) break;
                }


            }
        }

        return bestMove;
    }

    private static String score(final Player currentPlayer, final int highestSeenValue, final int lowestSeenValue) {
        if (currentPlayer.getAlliance().isWhite()) return "[score: " + highestSeenValue + "]";
        else if (currentPlayer.getAlliance().isBlack()) return "[score: " + lowestSeenValue + "]";

        throw new RuntimeException("somethings wrong");
    }

    private int max(final Board board, final int depth, final int highest, final int lowest) {
        if (depth == 0 || BoardUtils.isEndGame(board)) {
            this.boardsEvaluated++;
            return this.evaluator.evaluate(board, depth);
        }

        int currentHighest = highest;
        for (final Move move: MoveSorter.STANDARD.sort(board.currentPlayer().getLegalMoves())) {
            final MoveTransition moveTransition = board.currentPlayer().makeMove(move);
            if (moveTransition.getMoveStatus().isDone()) {
                final Board toBoard = moveTransition.getToBoard();
                currentHighest = Math.max(currentHighest, min(toBoard, calculateQuiescenceDepth(toBoard, depth),
                                                              currentHighest, lowest));
                if (currentHighest >= lowest) return lowest;
            }
        }

        return currentHighest;
    }

    private int min(final Board board, final int depth, final int highest, final int lowest) {
        if (depth == 0 || BoardUtils.isEndGame(board)) {
            this.boardsEvaluated++;
            return this.evaluator.evaluate(board, depth);
        }

        int currentLowest = lowest;
        for (final Move move: MoveSorter.STANDARD.sort(board.currentPlayer().getLegalMoves())) {
            final MoveTransition moveTransition = board.currentPlayer().makeMove(move);
            if (moveTransition.getMoveStatus().isDone()) {
                final Board toBoard = moveTransition.getToBoard();
                currentLowest = Math.min(currentLowest, max(toBoard, calculateQuiescenceDepth(toBoard, depth),
                                                            highest, currentLowest));
                if (currentLowest <= highest)return highest;
            }
        }

        return currentLowest;
    }

    private int calculateQuiescenceDepth(final Board toBoard, final int depth) {
        if (depth == 1 && this.quiescenceCount < MAX_QUIESCENCE) {
            int activityMeasure = 0;

            if (toBoard.currentPlayer().isInCheck())
                activityMeasure++;

            for (final Move move: BoardUtils.lastNMoves(toBoard, 2))
                if (move.isAttack()) activityMeasure++;

            if (activityMeasure >= 2) {
                this.quiescenceCount++;
                return 2;
            }
        }

        return depth - 1;
    }

    private static String calculateTimeTaken(final long start, final long end) {
        final long timeTaken = (end - start) / 1000000;
        return timeTaken + "ms";
    }
}
