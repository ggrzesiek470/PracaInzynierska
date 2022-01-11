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


public class King extends Piece {
    private static final int[] CANDIDATE_MOVE_COORDINATES = {-9, -8, -7, -1, 1, 7, 8, 9};

    private final boolean isCastled;
    private final boolean kingSideCastleCapable;
    private final boolean queenSideCastleCapable;


    public King(final Alliance pieceAlliance,
                final int piecePosition,
                final boolean kingSideCastleCapable,
                final boolean queenSideCastleCapable) {
        super(PieceType.KING, piecePosition, pieceAlliance, true);
        this.isCastled = false;
        this.kingSideCastleCapable = kingSideCastleCapable;
        this.queenSideCastleCapable = queenSideCastleCapable;
    }

    public King(final Alliance pieceAlliance,
                final int piecePosition,
                final boolean isFirstMove,
                final boolean isCastled,
                final boolean kingSideCastleCapable,
                final boolean queenSideCastleCapable) {
        super(PieceType.KING, piecePosition, pieceAlliance, isFirstMove);
        this.isCastled = isCastled;
        this.kingSideCastleCapable = kingSideCastleCapable;
        this.queenSideCastleCapable = queenSideCastleCapable;
    }

    public boolean isCastled() {
        return this.isCastled;
    }

    public boolean isKingSideCastleCapable() {
        return this.kingSideCastleCapable;
    }

    public boolean isQueenSideCastleCapable() {
        return this.queenSideCastleCapable;
    }

    @Override
    public Collection<Move> calculateLegalMoves(final Board board) {
        final List<Move> legalMoves = new ArrayList<>();

        for (final int currentCandidateOffset: CANDIDATE_MOVE_COORDINATES) {
            if (isFirstColumnExclusion(this.piecePosition, currentCandidateOffset) ||
                isEighthColumnExclusion(this.piecePosition, currentCandidateOffset))
                continue;

            final int candidateDestinationCoordinate = this.piecePosition + currentCandidateOffset;

            if (BoardUtils.isValidTileCoordinate(candidateDestinationCoordinate)) {
                final Piece pieceAtDestination = board.getPiece(candidateDestinationCoordinate);

                if (pieceAtDestination == null)
                    legalMoves.add(new MajorMove(board, this, candidateDestinationCoordinate));
                else {
                    final Alliance pieceAtDestinationAlliance = pieceAtDestination.getPieceAlliance();

                    if (this.pieceAlliance != pieceAtDestinationAlliance)
                        legalMoves.add(new MajorAttackMove(board, this, candidateDestinationCoordinate,
                                pieceAtDestination));
                }
            }
        }

        return Collections.unmodifiableList(legalMoves);
    }

    @Override
    public King movePiece(Move move) {
        return new King(this.pieceAlliance, move.getDestinationCoordinate(), false, move.isCastlingMove(),
                false, false);
    }

    @Override
    public int locationBonus() {
        return this.pieceAlliance.kingBonus(this.piecePosition);
    }

    @Override
    public String toString() {
        return this.pieceType.toString();
    }

    @Override
    public boolean equals(final Object other) {
        if (this == other)
            return true;

        if (!(other instanceof final King king))
            return false;

        if (!super.equals(other))
            return false;

        return isCastled == king.isCastled;
    }

    @Override
    public int hashCode() {
        return (31 * super.hashCode()) + (isCastled ? 1 : 0);
    }

    private static boolean isFirstColumnExclusion(final int currentCandidate, final int candidateDestinationCoordinate) {
        return BoardUtils.FIRST_COLUMN.get(currentCandidate) &&
               (candidateDestinationCoordinate == -9 ||
                candidateDestinationCoordinate == -1 ||
                candidateDestinationCoordinate == 7);
    }

    private static boolean isEighthColumnExclusion(final int currentCandidate, final int candidateDestinationCoordinate) {
        return BoardUtils.EIGHTH_COLUMN.get(currentCandidate) &&
               (candidateDestinationCoordinate == -7 ||
                candidateDestinationCoordinate == 1 ||
                candidateDestinationCoordinate == 9);
    }
}
