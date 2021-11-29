package com.chess.engine.pieces;

import com.chess.engine.Alliance;
import com.chess.engine.board.Board;
import com.chess.engine.board.BoardUtils;
import com.chess.engine.board.Move;

import java.util.Collection;
import java.util.Vector;


public abstract class Piece {
    final PieceType pieceType;
    final int piecePosition;
    int oldPosition;
    final Alliance pieceAlliance;
    private final boolean isFirstMove;
    private final int cachedHashCode;


    Piece(final PieceType pieceType,
          final int piecePosition,
          final Alliance pieceAlliance,
          final boolean isFirstMove) {
        this.pieceType = pieceType;
        this.piecePosition = piecePosition;
        this.pieceAlliance = pieceAlliance;
        this.isFirstMove = isFirstMove;
        this.cachedHashCode = computeHashCode();
    }

    public int[] getPiecePositionXY(int piecePosition) {
        int row = 0, col = 0;

        for (int i = 0; i < BoardUtils.NUM_TILES_PER_ROW; i++)
            for (int j = 0; j < BoardUtils.NUM_TILES_PER_ROW; j++)
                if (i * BoardUtils.NUM_TILES_PER_ROW + j == piecePosition) {
                    col = j;
                    row = i;
                    break;
                }

        return new int[]{row, col+1};
    }

    public int getPiecePosition() {
        return this.piecePosition;
    }

    public int getOldPosition() {
        return this.oldPosition;
    }

    public void setOldPosition(final int position) {
        this.oldPosition = position;
    }

    public Alliance getPieceAlliance() {
        return this.pieceAlliance;
    }

    public boolean isFirstMove() {
        return this.isFirstMove;
    }

    public PieceType getPieceType() {
        return this.pieceType;
    }

    public int getPieceValue() {
        return this.pieceType.getPieceValue();
    }

    public abstract int locationBonus();

    public abstract Collection<Move> calculateLegalMoves(final Board board);

    public abstract Piece movePiece(Move move);

    private int computeHashCode() {
        int result = pieceType.hashCode();
        result = 31 * result + pieceAlliance.hashCode();
        result = 31 * result + piecePosition;
        result = 31 * result + (this.isFirstMove ? 1 : 0);

        return result;
    }

    @Override
    public int hashCode() {
        return this.cachedHashCode;
    }

    @Override
    public boolean equals(final Object other) {
        if (this == other)
            return true;

        if (!(other instanceof final Piece otherPiece))
            return false;

        return this.piecePosition == otherPiece.piecePosition && this.pieceType == otherPiece.pieceType &&
                this.pieceAlliance == otherPiece.pieceAlliance && this.isFirstMove == otherPiece.isFirstMove;
    }


    public enum PieceType {
        PAWN("P", 100),
        KNIGHT("N", 300),
        BISHOP("B", 300),
        ROOK("R", 500) ,
        QUEEN("Q", 900),
        KING("K", 10000);

        private final String pieceName;
        private final int pieceValue;

        PieceType(final String pieceName,
                  final int pieceValue) {
            this.pieceName = pieceName;
            this.pieceValue = pieceValue;
        }

        @Override
        public String toString() {
            return this.pieceName;
        }

        public int getPieceValue() {
            return this.pieceValue;
        }
    }
}
