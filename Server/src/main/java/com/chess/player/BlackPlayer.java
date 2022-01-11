package com.chess.player;

import com.chess.Alliance;
import com.chess.board.Board;
import com.chess.board.BoardUtils;
import com.chess.board.Move;
import com.chess.pieces.Piece;
import com.chess.pieces.Rook;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

public class BlackPlayer extends Player {
    public BlackPlayer(final Board board,
                       final Collection<Move> whiteStandardLegalMoves,
                       final Collection<Move> blackStandardLegalMoves) {
        super(board, blackStandardLegalMoves, whiteStandardLegalMoves);
    }

    @Override
    public Collection<Piece> getActivePieces() {
        return this.board.getBlackPieces();
    }

    @Override
    public Alliance getAlliance() {
        return Alliance.BLACK;
    }

    @Override
    public Player getOpponent() {
        return this.board.whitePlayer();
    }

    @Override
    protected Collection<Move> calculateKingCastles(final Collection<Move> playerLegals, final Collection<Move> opponentLegals) {
        if (!hasCastleOpportunities()) return Collections.emptyList();

        final List<Move> kingCastles = new ArrayList<>();

        if (this.playerKing.isFirstMove() && this.playerKing.getPiecePosition() == 4 && !this.isInCheck()) {
            //blacks king side castle
            if (this.board.getPiece(5) == null && this.board.getPiece(6) == null) {
                final Piece kingSideRook = this.board.getPiece(7);

                if (kingSideRook != null && kingSideRook.isFirstMove() &&
                        calculateAttacksOnTile(5, opponentLegals).isEmpty() &&
                        calculateAttacksOnTile(6, opponentLegals).isEmpty() &&
                        kingSideRook.getPieceType() == Piece.PieceType.ROOK)
                    if (!BoardUtils.isKingPawnTrap(this.board, this.playerKing, 12))
                        kingCastles.add(new Move.KingSideCastleMove(this.board, this.playerKing, 6, (Rook) kingSideRook,
                                kingSideRook.getPiecePosition(), 5));

            }

            //blacks queen side castle
            if (this.board.getPiece(1) == null && this.board.getPiece(2) == null &&
                    this.board.getPiece(3) == null) {
                final Piece queenSideRook = this.board.getPiece(0);

                if (queenSideRook != null && queenSideRook.isFirstMove() &&
                        calculateAttacksOnTile(2, opponentLegals).isEmpty() &&
                        calculateAttacksOnTile(3, opponentLegals).isEmpty() &&
                        queenSideRook.getPieceType() == Piece.PieceType.ROOK)
                    if (!BoardUtils.isKingPawnTrap(this.board, this.playerKing, 12))
                        kingCastles.add(new Move.QueenSideCastleMove(this.board, this.playerKing, 2, (Rook) queenSideRook,
                                queenSideRook.getPiecePosition(), 3));
            }
        }

        return kingCastles;
    }

    @Override
    public String toString() {
        return Alliance.BLACK.toString();
    }
}