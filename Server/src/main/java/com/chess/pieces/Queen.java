package com.chess.pieces;

import com.chess.Alliance;
import com.chess.board.Board;
import com.chess.board.BoardUtils;
import com.chess.board.Move;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

import static com.chess.board.Move.*;

public class Queen extends Piece {
    private final static int[] CANDIDATE_MOVE_COORDINATES = {-9, -8, -7, -1, 1, 7, 8, 9};


    public Queen(final Alliance pieceAlliance,
                 final int piecePosition) {
        super(PieceType.QUEEN, piecePosition, pieceAlliance, true);
    }

    public Queen(final Alliance pieceAlliance,
                 final int piecePosition,
                 final boolean isFirstMove) {
        super(PieceType.QUEEN, piecePosition, pieceAlliance, isFirstMove);
    }

    @Override
    public Collection<Move> calculateLegalMoves(final Board board) {
        final List<Move> legalMoves = new ArrayList<>();

        for (final int currentCandidateOffset: CANDIDATE_MOVE_COORDINATES) {
            int candidateDestinationCoordinate = this.piecePosition;

            while (true) {
                if (isFirstColumnExclusion(currentCandidateOffset, candidateDestinationCoordinate) ||
                    isEighthColumnExclusion(currentCandidateOffset, candidateDestinationCoordinate))
                    break;

                candidateDestinationCoordinate += currentCandidateOffset;

                if (!BoardUtils.isValidTileCoordinate(candidateDestinationCoordinate))
                    break;
                else {
                    final Piece pieceAtDestination = board.getPiece(candidateDestinationCoordinate);

                    if (pieceAtDestination == null)
                        legalMoves.add(new MajorMove(board, this, candidateDestinationCoordinate));
                    else {
                        final Alliance pieceAtDestinationAlliance = pieceAtDestination.getPieceAlliance();

                        if (this.pieceAlliance != pieceAtDestinationAlliance)
                            legalMoves.add(new MajorAttackMove(board, this, candidateDestinationCoordinate,
                                    pieceAtDestination));

                        break;
                    }
                }
            }
        }

        return Collections.unmodifiableList(legalMoves);
    }

    @Override
    public Queen movePiece(Move move) {
        return PieceUtils.INSTANCE.getMovedQueen(move.getMovedPiece().getPieceAlliance(), move.getDestinationCoordinate());
    }

    @Override
    public int locationBonus() {
        return this.pieceAlliance.queenBonus(this.piecePosition);
    }

    @Override
    public String toString() {
        return this.pieceType.toString();
    }

    private static boolean isFirstColumnExclusion(final int currentPosition, final int candidatePosition) {
        return BoardUtils.FIRST_COLUMN.get(candidatePosition) &&
               (currentPosition == -9 || currentPosition == -1 || currentPosition == 7);
    }

    private static boolean isEighthColumnExclusion(final int currentPosition, final int candidatePosition) {
        return BoardUtils.EIGHTH_COLUMN.get(candidatePosition) &&
               (currentPosition == -7 || currentPosition == 1 || currentPosition == 9);
    }
}
