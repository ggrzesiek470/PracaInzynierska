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

public class WhitePlayer extends Player {
    public WhitePlayer(final Board board,
                       final Collection<Move> whiteStandardLegalMoves,
                       final Collection<Move> blackStandardLegalMoves) {
        super(board, whiteStandardLegalMoves, blackStandardLegalMoves);
    }

    @Override
    public Collection<Piece> getActivePieces() {
        return this.board.getWhitePieces();
    }

    @Override
    public Alliance getAlliance() {
        return Alliance.WHITE;
    }

    @Override
    public Player getOpponent() {
        return this.board.blackPlayer();
    }

    @Override
    protected Collection<Move> calculateKingCastles(final Collection<Move> playerLegals, final Collection<Move> opponentLegals) {
        if (!hasCastleOpportunities())
            return Collections.emptyList();

        final List<Move> kingCastles = new ArrayList<>();

        if (this.playerKing.isFirstMove() && this.playerKing.getPiecePosition() == 60 && !this.isInCheck()) {
            //whites king side castle
            if (this.board.getPiece(61) == null && this.board.getPiece(62) == null) {
                final Piece kingSideRook = this.board.getPiece(63);

                if (kingSideRook != null && kingSideRook.isFirstMove())
                    if (calculateAttacksOnTile(61, opponentLegals).isEmpty() &&
                        calculateAttacksOnTile(62, opponentLegals).isEmpty() &&
                        kingSideRook.getPieceType() == Piece.PieceType.ROOK)
                        if (!BoardUtils.isKingPawnTrap(this.board, this.playerKing, 52))
                            kingCastles.add(new Move.KingSideCastleMove(this.board, this.playerKing, 62, (Rook) kingSideRook,
                                    kingSideRook.getPiecePosition(), 61));
            }
            //whites queen side castle
            if (this.board.getPiece(59) == null && this.board.getPiece(58) == null &&
                this.board.getPiece(57) == null) {
                final Piece queenSideRook = this.board.getPiece(56);

                if (queenSideRook != null && queenSideRook.isFirstMove())
                    if (calculateAttacksOnTile(58, opponentLegals).isEmpty() &&
                        calculateAttacksOnTile(59, opponentLegals).isEmpty() &&
                        queenSideRook.getPieceType() == Piece.PieceType.ROOK)
                        if (!BoardUtils.isKingPawnTrap(this.board, this.playerKing, 52))
                            kingCastles.add(new Move.QueenSideCastleMove(this.board, this.playerKing, 58, (Rook) queenSideRook,
                                    queenSideRook.getPiecePosition(), 59));
            }
        }

        return kingCastles;
    }

    @Override
    public String toString() {
        return Alliance.WHITE.toString();
    }
}