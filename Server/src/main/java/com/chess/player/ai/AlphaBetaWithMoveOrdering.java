package com.chess.player.ai;

import com.chess.Alliance;
import com.chess.board.Board;
import com.chess.board.BoardUtils;
import com.chess.board.Move;
import com.chess.board.MoveTransition;
import com.chess.player.Player;
import com.google.common.collect.ComparisonChain;
import com.google.common.collect.Ordering;

import java.util.Collection;
import java.util.Comparator;

public class AlphaBetaWithMoveOrdering implements MoveStrategy {
    private final BoardEvaluator evaluator;
    private final int searchDepth;
    private final MoveSorter moveSorter;
    private long boardsEvaluated;

    private enum MoveSorter {
        SORT {
            @Override
            Collection<Move> sort(final Collection<Move> moves) {
                return Ordering.from(SMART_SORT).immutableSortedCopy(moves);
            }
        };

        public static Comparator<Move> SMART_SORT = (move1, move2) ->
                ComparisonChain.start()
                .compareTrueFirst(BoardUtils.isThreatenedBoardImmediate(move1.getBoard()),
                                  BoardUtils.isThreatenedBoardImmediate(move2.getBoard()))
                .compareTrueFirst(move1.isAttack(), move2.isAttack())
                .compareTrueFirst(move1.isCastlingMove(), move2.isCastlingMove())
                .compare(move2.getMovedPiece().getPieceValue(), move1.getMovedPiece().getPieceValue())
                .result();

        abstract Collection<Move> sort(Collection<Move> moves);
    }

    public AlphaBetaWithMoveOrdering(final int searchDepth) {
        this.evaluator = StandardBoardEvaluator.get();
        this.searchDepth = searchDepth;
        this.moveSorter = MoveSorter.SORT;
        this.boardsEvaluated = 0;
    }

    @Override
    public String toString() {
        return "AB+MO";
    }

    @Override
    public long getNumBoardsEvaluated() {
        return this.boardsEvaluated;
    }

    @Override
    public Move execute(Board board) {
        final Player currentPlayer = board.currentPlayer();
        final Alliance alliance = currentPlayer.getAlliance();
        Move bestMove = Move.MoveFactory.getNullMove();
        int highestSeenValue = Integer.MIN_VALUE;
        int lowestSeenValue = Integer.MAX_VALUE;
        int currentValue;

        for (final Move move: this.moveSorter.sort(board.currentPlayer().getLegalMoves())) {
            final MoveTransition moveTransition = board.currentPlayer().makeMove(move);

            if (moveTransition.getMoveStatus().isDone()) {
                currentValue = alliance.isWhite() ?
                        min(moveTransition.getToBoard(), this.searchDepth - 1,
                                highestSeenValue, lowestSeenValue) :
                        max(moveTransition.getToBoard(), this.searchDepth - 1,
                                highestSeenValue, lowestSeenValue);
                if (alliance.isWhite() && currentValue > highestSeenValue) {
                    highestSeenValue = currentValue;
                    bestMove = move;
                } else if (alliance.isBlack() && currentValue < lowestSeenValue) {
                    lowestSeenValue = currentValue;
                    bestMove = move;
                }
            }
        }

        return bestMove;
    }

    public int max(final Board board, final int depth, final int highest, final int lowest) {
        if (depth == 0 || BoardUtils.isEndGame(board)) {
            this.boardsEvaluated++;
            return this.evaluator.evaluate(board, depth);
        }

        int currentHighest = highest;
        for (final Move move: this.moveSorter.sort(board.currentPlayer().getLegalMoves())) {
            final MoveTransition moveTransition = board.currentPlayer().makeMove(move);

            if (moveTransition.getMoveStatus().isDone()) {
                currentHighest = Math.max(currentHighest, min(moveTransition.getToBoard(),depth-1,
                                                              currentHighest, lowest));
                if (lowest <= currentHighest) break;
            }
        }

        return currentHighest;
    }

    public int min(final Board board, final int depth, final int highest, final int lowest) {
        if (depth == 0 || BoardUtils.isEndGame(board)) {
            this.boardsEvaluated++;
            return this.evaluator.evaluate(board, depth);
        }

        int currentLowest = lowest;
        for (final Move move: this.moveSorter.sort(board.currentPlayer().getLegalMoves())) {
            final MoveTransition moveTransition = board.currentPlayer().makeMove(move);

            if (moveTransition.getMoveStatus().isDone()) {
                currentLowest = Math.min(currentLowest, max(moveTransition.getToBoard(), depth-1,
                                                            highest, currentLowest));
                if (currentLowest <= highest) break;
            }
        }

        return currentLowest;
    }
}
