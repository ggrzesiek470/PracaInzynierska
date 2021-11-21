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


public class Knight extends Piece {
    private final static int[] CANDIDATE_MOVE_COORDINATES = { -17, -15, -10, -6, 6, 10, 15, 17 };


    public Knight(final Alliance pieceAlliance,
                  final int piecePosition) {
        super(PieceType.KNIGHT, piecePosition, pieceAlliance, true);
    }

    public Knight(final Alliance pieceAlliance,
                  final int piecePosition,
                  final boolean isFirstMove) {
        super(PieceType.KNIGHT, piecePosition, pieceAlliance, isFirstMove);
    }

    @Override
    public Collection<Move> calculateLegalMoves(final Board board) {
        final List<Move> legalMoves = new ArrayList<>();

        for (final int currentCandidateOffset : CANDIDATE_MOVE_COORDINATES) {
            if (isFirstColumnExclusion(this.piecePosition, currentCandidateOffset) ||
                isSecondColumnExclusion(this.piecePosition, currentCandidateOffset) ||
                isSeventhColumnExclusion(this.piecePosition, currentCandidateOffset) ||
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
                        legalMoves.add(new MajorAttackMove(board, this, candidateDestinationCoordinate, pieceAtDestination));
                }
            }
        }

        return legalMoves;
    }

    @Override
    public Knight movePiece(Move move) {
        return PieceUtils.INSTANCE.getMovedKnight(move.getMovedPiece().getPieceAlliance(), move.getDestinationCoordinate());
    }

    @Override
    public int locationBonus() {
        return this.pieceAlliance.knightBonus(this.piecePosition);
    }

    @Override
    public String toString() {
        return this.pieceType.toString();
    }

    private static boolean isFirstColumnExclusion(final int currentPosition, final int candidateOffset) {
        return BoardUtils.INSTANCE.FIRST_COLUMN.get(currentPosition) &&
               (candidateOffset == -17 || candidateOffset == -10 ||
                candidateOffset == 6 || candidateOffset == 15);
    }

    private static boolean isSecondColumnExclusion(final int currentPosition, final int candidateOffset) {
        return BoardUtils.INSTANCE.SECOND_COLUMN.get(currentPosition) &&
               (candidateOffset == -10 || candidateOffset == 6);
    }

    private static boolean isSeventhColumnExclusion(final int currentPosition, final int candidateOffset) {
        return BoardUtils.INSTANCE.SEVENTH_COLUMN.get(currentPosition) &&
                (candidateOffset == -6 || candidateOffset == 10);
    }

    private static boolean isEighthColumnExclusion(final int currentPosition, final int candidateOffset) {
        return BoardUtils.INSTANCE.EIGHTH_COLUMN.get(currentPosition) &&
               (candidateOffset == -15 || candidateOffset == -6 ||
                candidateOffset == 10 || candidateOffset == 17);
    }
}
