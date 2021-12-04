package com.chess.pieces;

import com.chess.Alliance;
import com.chess.board.Board;
import com.chess.board.BoardUtils;
import com.chess.board.Move;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class Pawn extends Piece {
    private final static int[] CANDIDATE_MOVE_COORDINATE = {8, 16, 7, 9};


    public Pawn(final Alliance pieceAlliance,
                final int piecePosition) {
        super(PieceType.PAWN, piecePosition, pieceAlliance, true);
    }

    public Pawn(final Alliance pieceAlliance,
                final int piecePosition,
                final boolean isFirstMove) {
        super(PieceType.PAWN, piecePosition, pieceAlliance, isFirstMove);
    }

    @Override
    public Collection<Move> calculateLegalMoves(final Board board) {
        final List<Move> legalMoves = new ArrayList<>();

        for (final int currentCandidateOffset: CANDIDATE_MOVE_COORDINATE) {
            final int candidateDestinationCoordinate = this.piecePosition +
                    (this.pieceAlliance.getDirection() * currentCandidateOffset);

            if (!BoardUtils.isValidTileCoordinate(candidateDestinationCoordinate))
                continue;

            if (currentCandidateOffset == 8 && board.getPiece(candidateDestinationCoordinate) == null) {
                if (this.pieceAlliance.isPawnPromotionSquare(candidateDestinationCoordinate))
                    legalMoves.add(new Move.PawnPromotion(new Move.PawnMove(board, this, candidateDestinationCoordinate),
                            PieceUtils.INSTANCE.getMovedQueen(this.pieceAlliance, candidateDestinationCoordinate)));
                else
                    legalMoves.add(new Move.PawnMove(board, this, candidateDestinationCoordinate));
            } else if (currentCandidateOffset == 16 && this.isFirstMove() &&
                      ((BoardUtils.SECOND_ROW.get(this.piecePosition) && this.pieceAlliance.isWhite()) ||
                       (BoardUtils.SEVENTH_ROW.get(this.piecePosition) && this.pieceAlliance.isBlack()))) {
                final int behindCandidateDestinationCoordinate = this.piecePosition + (this.pieceAlliance.getDirection() * 8);

                if (board.getPiece(behindCandidateDestinationCoordinate) == null &&
                    board.getPiece(candidateDestinationCoordinate) == null)
                    legalMoves.add(new Move.PawnJump(board, this, candidateDestinationCoordinate));
            } else if (currentCandidateOffset == 7 &&
                      !((BoardUtils.EIGHTH_COLUMN.get(this.piecePosition) && this.pieceAlliance.isBlack() ||
                        (BoardUtils.FIRST_COLUMN.get(this.piecePosition) && this.pieceAlliance.isWhite())))) {
                if (board.getPiece(candidateDestinationCoordinate) != null) {
                    final Piece pieceOnCandidate = board.getPiece(candidateDestinationCoordinate);

                    if (this.pieceAlliance != pieceOnCandidate.getPieceAlliance()) {
                        if (this.pieceAlliance.isPawnPromotionSquare(candidateDestinationCoordinate))
                            legalMoves.add(new Move.PawnPromotion(new Move.PawnAttackMove(board, this,
                                                             candidateDestinationCoordinate, pieceOnCandidate),
                                           PieceUtils.INSTANCE.getMovedQueen(this.pieceAlliance,
                                                                             candidateDestinationCoordinate)));
                        else
                            legalMoves.add(new Move.PawnAttackMove(board, this, candidateDestinationCoordinate,
                                                              pieceOnCandidate));
                    }
                } else if (board.getEnPassantPawn() != null &&
                           board.getEnPassantPawn().getPiecePosition() ==
                               (this.piecePosition + this.pieceAlliance.getOppositeDirection())) {
                    final Piece pieceOnCandidate = board.getEnPassantPawn();

                    if (this.pieceAlliance != pieceOnCandidate.getPieceAlliance())
                        legalMoves.add(new Move.PawnEnPassantAttackMove(board, this, candidateDestinationCoordinate,
                                                                   pieceOnCandidate));
                }
            } else if (currentCandidateOffset == 9 &&
                       !((BoardUtils.FIRST_COLUMN.get(this.piecePosition) && this.pieceAlliance.isWhite() ||
                         (BoardUtils.EIGHTH_COLUMN.get(this.piecePosition) && this.pieceAlliance.isBlack())))) {
                if (board.getPiece(candidateDestinationCoordinate) != null) {
                    if (this.pieceAlliance != board.getPiece(candidateDestinationCoordinate).getPieceAlliance()) {
                        if (this.pieceAlliance.isPawnPromotionSquare(candidateDestinationCoordinate))
                            legalMoves.add(new Move.PawnPromotion(new Move.PawnAttackMove(board, this,
                                    candidateDestinationCoordinate, board.getPiece(candidateDestinationCoordinate)),
                                    PieceUtils.INSTANCE.getMovedQueen(this.pieceAlliance, candidateDestinationCoordinate)));
                        else
                            legalMoves.add(new Move.PawnAttackMove(board, this, candidateDestinationCoordinate,
                                    board.getPiece(candidateDestinationCoordinate)));
                    }
                } else if (board.getEnPassantPawn() != null &&
                           board.getEnPassantPawn().getPiecePosition() ==
                               (this.piecePosition - (this.pieceAlliance.getOppositeDirection()))) {
                        final Piece pieceOnCandidate = board.getEnPassantPawn();
                        if (this.pieceAlliance != pieceOnCandidate.getPieceAlliance())
                            legalMoves.add(new Move.PawnEnPassantAttackMove(board, this,
                                                                       candidateDestinationCoordinate, pieceOnCandidate));
                }
            }
        }

        return legalMoves;
    }

    @Override
    public Pawn movePiece(Move move) {
        return PieceUtils.INSTANCE.getMovedPawn(move.getMovedPiece().getPieceAlliance(), move.getDestinationCoordinate());
    }

    @Override
    public int locationBonus() {
        return this.pieceAlliance.pawnBonus(this.piecePosition);
    }

    @Override
    public String toString() {
        return this.pieceType.toString();
    }
}
