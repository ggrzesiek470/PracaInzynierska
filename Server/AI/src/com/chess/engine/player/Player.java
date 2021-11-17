package com.chess.engine.player;

import com.chess.engine.Alliance;
import com.chess.engine.board.Board;
import com.chess.engine.board.Move;
import com.chess.engine.board.MoveTransition;
import com.chess.engine.pieces.King;
import com.chess.engine.pieces.Piece;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static com.chess.engine.board.Move.MoveStatus;

public abstract class Player {
    protected final Board board;
    protected final King playerKing;
    protected final Collection<Move> legalMoves;
    private final boolean isInCheck;


    Player(final Board board,
           final Collection<Move> legalMoves,
           final Collection<Move> opponentLegalMoves) {
        this.board = board;
        this.playerKing = establishKing();
        this.legalMoves = Stream.of(legalMoves, calculateKingCastles(legalMoves, opponentLegalMoves))
                .flatMap(Collection::stream).collect(Collectors.toList());
        this.isInCheck = !calculateAttacksOnTile(this.playerKing.getPiecePosition(), opponentLegalMoves).isEmpty();
    }

    public King getPlayerKing() {
        return this.playerKing;
    }

    public Collection<Move> getLegalMoves() {
        return this.legalMoves;
    }

    public boolean isMoveLegal(final Move move) {
        return this.legalMoves.contains(move);
    }

    public boolean isInCheck() {
        return this.isInCheck;
    }

    public boolean isInCheckMate() {
        return this.isInCheck && !hasEscapeMoves();
    }

    public boolean isInStaleMate() {
        return !this.isInCheck && !hasEscapeMoves();
    }

//    public boolean isInEndlessCheck() {
//        final List<Move> lastMoves = BoardUtils.lastNPlayerMoves(this.board, this, 3);
//
//        if (lastMoves.size() >= 3) {
//            final Move lastMove = lastMoves.get(lastMoves.size() - 1);
//            final Move thirdLastMove = lastMoves.get(0);
//
//            if (lastMove == thirdLastMove)
//                return !this.isInCheck && !hasEscapeMovesOtherThanThisMove(lastMove);
//        }
//
//        return false;
//    }

    public boolean isKingSideCastleCapable() {
        return this.playerKing.isKingSideCastleCapable();
    }

    public boolean isQueenSideCastleCapable() {
        return this.playerKing.isQueenSideCastleCapable();
    }

    public boolean isCastled() {
        return this.playerKing.isCastled();
    }

    public MoveTransition makeMove(final Move move) {
        if (!isMoveLegal(move))
            return new MoveTransition(this.board, this.board, move, MoveStatus.ILLEGAL_MOVE);

        final Board transitionBoard = move.execute();

        return transitionBoard.currentPlayer().getOpponent().isInCheck ?
                new MoveTransition(this.board, this.board, move, MoveStatus.LEAVES_PLAYER_IN_CHECK) :
                new MoveTransition(this.board, transitionBoard, move, MoveStatus.DONE);
    }

    private boolean hasEscapeMoves() {
        for (final Move move: this.legalMoves) {
            final MoveTransition transition = makeMove(move);

            if (transition.getMoveStatus().isDone())
                return true;
        }

        return false;
    }

    protected static Collection<Move> calculateAttacksOnTile(final int piecePosition, final Collection<Move> moves) {
        final List<Move> attackMoves = new ArrayList<>();
        for (final Move move: moves)
            if (piecePosition == move.getDestinationCoordinate())
                attackMoves.add(move);

        return attackMoves;
    }

    private King establishKing() {
        for (final Piece piece: getActivePieces()) {
            if (piece.getPieceType() == Piece.PieceType.KING)
                System.out.print((piece.getPieceType() == Piece.PieceType.KING) + ": ");
            System.out.println(piece.getPieceAlliance().toString().charAt(0) + piece.getPieceType().toString() + piece.getPiecePosition());

            if (piece.getPieceType() == Piece.PieceType.KING) {
                System.out.println("outta here");
                return (King) piece;
            }
        }

        throw new RuntimeException("Should not reach here! Not a valid board!");
    }

    protected boolean hasCastleOpportunities() {
        return !this.isInCheck && !this.playerKing.isCastled() &&
               (this.playerKing.isKingSideCastleCapable() || this.playerKing.isQueenSideCastleCapable());
    }

    public abstract Collection<Piece> getActivePieces();
    public abstract Alliance getAlliance();
    public abstract Player getOpponent();
    protected abstract Collection<Move> calculateKingCastles(Collection<Move> playerLegals, Collection<Move> opponentsLegals);

    public MoveTransition unMakeMove(final Move move) {
        return new MoveTransition(this.board, move.undo(), move, MoveStatus.DONE);
    }
}