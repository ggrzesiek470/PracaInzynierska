package com.chess.pieces;

import com.chess.Alliance;
import com.chess.board.Board;
import com.chess.board.BoardUtils;
import com.chess.board.Move;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class Bishop extends Piece {
    private final static int[] CANDIDATE_MOVE_COORDINATES = {-9, -7, 7, 9};


    public Bishop(final Alliance pieceAlliance,
                  final int piecePosition) {
        super(PieceType.BISHOP, piecePosition, pieceAlliance, true);
    }

    public Bishop(final Alliance pieceAlliance,
                  final int piecePosition,
                  final boolean isFirstMove) {
        super(PieceType.BISHOP, piecePosition, pieceAlliance, isFirstMove);
    }

    @Override
    public Collection<Move> calculateLegalMoves(final Board board) {
        final List<Move> legalMoves = new ArrayList<>();

        for (final int candidateCoordinateOffset: CANDIDATE_MOVE_COORDINATES) {
            int candidateDestinationCoordinate = this.piecePosition;

            while (BoardUtils.isValidTileCoordinate(candidateDestinationCoordinate)) {
                if (isFirstColumnExclusion(candidateCoordinateOffset, candidateDestinationCoordinate) ||
                        isEighthColumnExclusion(candidateCoordinateOffset, candidateDestinationCoordinate))
                    break;

                candidateDestinationCoordinate += candidateCoordinateOffset;

                if (BoardUtils.isValidTileCoordinate(candidateDestinationCoordinate)) {
                    final Piece pieceAtDestination = board.getPiece(candidateDestinationCoordinate);

                    if (pieceAtDestination == null)
                        legalMoves.add(new Move.MajorMove(board, this, candidateDestinationCoordinate));
                    else {
                        final Alliance pieceAlliance = pieceAtDestination.getPieceAlliance();

                        if (this.pieceAlliance != pieceAlliance)
                            legalMoves.add(new Move.MajorAttackMove(board, this, candidateDestinationCoordinate, pieceAtDestination));

                        break;
                    }
                }
            }
        }
        return legalMoves;
    }

    @Override
    public Bishop movePiece(Move move) {
        return PieceUtils.INSTANCE.getMovedBishop(move.getMovedPiece().getPieceAlliance(),
                                                  move.getDestinationCoordinate());
    }

    @Override
    public int locationBonus() {
        return this.pieceAlliance.bishopBonus(this.piecePosition);
    }

    @Override
    public String toString() {
        return this.pieceType.toString();
    }

    private static boolean isFirstColumnExclusion(final int currentCandidate, final int candidateDestinationCoordinate) {
        return (BoardUtils.FIRST_COLUMN.get(candidateDestinationCoordinate) &&
                (currentCandidate == -9 || currentCandidate == 7));
    }

    private static boolean isEighthColumnExclusion(final int currentCandidate, final int candidateDestinationCoordinate) {
        return (BoardUtils.EIGHTH_COLUMN.get(candidateDestinationCoordinate) &&
                (currentCandidate == -7 || currentCandidate == 9));
    }
}
