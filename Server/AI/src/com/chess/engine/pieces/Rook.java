package com.chess.engine.pieces;

import com.chess.engine.Alliance;
import com.chess.engine.board.Board;
import com.chess.engine.board.BoardUtils;
import com.chess.engine.board.Move;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import static com.chess.engine.board.Move.MajorAttackMove;
import static com.chess.engine.board.Move.MajorMove;

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
        return (BoardUtils.INSTANCE.FIRST_COLUMN.get(candidateDestinationCoordinate) && currentCandidate == -1) ||
               (BoardUtils.INSTANCE.EIGHTH_COLUMN.get(candidateDestinationCoordinate) && currentCandidate == 1);
    }
}