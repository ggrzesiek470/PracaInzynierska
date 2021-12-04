package com.chess.pieces;

import com.chess.Alliance;
import com.chess.board.Board;
import com.chess.board.BoardUtils;
import com.chess.board.Move;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class Rook extends Piece {
    private final static int[] CANDIDATE_MOVE_COORDINATES = {-8, -1, 1, 8};


    public Rook(final Alliance pieceAlliance,
                final int piecePosition) {
        super(PieceType.ROOK, piecePosition, pieceAlliance, true);
    }

    public Rook(final Alliance pieceAlliance,
                final int piecePosition,
                final boolean isFirstMove) {
        super(PieceType.ROOK, piecePosition, pieceAlliance, isFirstMove);
    }

    @Override
    public Collection<Move> calculateLegalMoves(final Board board) {
        final List<Move> legalMoves = new ArrayList<>();

        for (final int currentCandidateOffset: CANDIDATE_MOVE_COORDINATES) {
            int candidateDestinationCoordinate = this.piecePosition;

            while (BoardUtils.isValidTileCoordinate(candidateDestinationCoordinate)) {
                if (isColumnColumnExclusion(currentCandidateOffset, candidateDestinationCoordinate))
                    break;

                candidateDestinationCoordinate += currentCandidateOffset;

                if (BoardUtils.isValidTileCoordinate(candidateDestinationCoordinate)) {
                    final Piece pieceAtDestination = board.getPiece(candidateDestinationCoordinate);

                    if (pieceAtDestination == null)
                        legalMoves.add(new Move.MajorMove(board, this, candidateDestinationCoordinate));
                    else {
                        final Alliance pieceAtDestinationAlliance = pieceAtDestination.getPieceAlliance();

                        if (this.pieceAlliance != pieceAtDestinationAlliance)
                            legalMoves.add(new Move.MajorAttackMove(board, this, candidateDestinationCoordinate,
                                                               pieceAtDestination));

                        break;
                    }
                }
            }
        }
        return legalMoves;
    }

    @Override
    public Rook movePiece(Move move) {
        return PieceUtils.INSTANCE.getMovedRook(move.getMovedPiece().getPieceAlliance(), move.getDestinationCoordinate());
    }

    @Override
    public int locationBonus() {
        return this.pieceAlliance.rookBonus(this.piecePosition);
    }

    @Override
    public String toString() {
        return this.pieceType.toString();
    }

    private static boolean isColumnColumnExclusion(final int currentCandidate, final int candidateDestinationCoordinate) {
        return (BoardUtils.FIRST_COLUMN.get(candidateDestinationCoordinate) && currentCandidate == -1) ||
               (BoardUtils.EIGHTH_COLUMN.get(candidateDestinationCoordinate) && currentCandidate == 1);
    }
}
