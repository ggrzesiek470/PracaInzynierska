package com.chess.board;

import com.chess.Alliance;
import com.chess.pieces.*;
import com.chess.player.BlackPlayer;
import com.chess.player.Player;
import com.chess.player.WhitePlayer;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class Board {
    private final Map<Integer, Piece> boardConfig;
    private final Collection<Piece> whitePieces;
    private final Collection<Piece> blackPieces;
    private final WhitePlayer whitePlayer;
    private final BlackPlayer blackPlayer;
    private final Player currentPlayer;
    private final Pawn enPassantPawn;
    private final Move transitionMove;

    private Board(final Builder builder) {
        this.boardConfig = Collections.unmodifiableMap(builder.boardConfig);
        this.whitePieces = calculateActivePieces(builder, Alliance.WHITE);
        this.blackPieces = calculateActivePieces(builder, Alliance.BLACK);
        this.enPassantPawn = builder.enPassantPawn;
        final Collection<Move> whiteStandardMoves = calculateLegalMoves(this.whitePieces);
        final Collection<Move> blackStandardMoves = calculateLegalMoves(this.blackPieces);
        this.whitePlayer = new WhitePlayer(this, whiteStandardMoves, blackStandardMoves);
        this.blackPlayer = new BlackPlayer(this, whiteStandardMoves, blackStandardMoves);
        this.currentPlayer = builder.nextMoveMaker
                                    .choosePlayerByAlliance(this.whitePlayer, this.blackPlayer);
        this.transitionMove = builder.transitionMove != null ?
                builder.transitionMove : Move.MoveFactory.getNullMove();
    }

    @Override
    public String toString() {
        final StringBuilder builder = new StringBuilder();
        for (int i = 0; i < BoardUtils.NUM_TILES; i++) {
            final String tileText = prettyPrint(this.boardConfig.get(i));
            builder.append(String.format("%3s", tileText));
            if ((i + 1) % 8 == 0) builder.append("\n");
        }
        return builder.reverse().toString();
    }

    private static String prettyPrint(final Piece piece) {
        if (piece != null) return piece.getPieceAlliance().isBlack() ?
                    piece.toString().toLowerCase() : piece.toString();
        return "-";
    }

    public Player whitePlayer() {
        return this.whitePlayer;
    }

    public Player blackPlayer() {
        return this.blackPlayer;
    }

    public Player currentPlayer() {
        return this.currentPlayer;
    }

    public Piece getPiece(final int coordinate) {
        return this.boardConfig.get(coordinate);
    }

    public Pawn getEnPassantPawn() {
        return this.enPassantPawn;
    }

    public Move getTransitionMove() {
        return this.transitionMove;
    }

    public Collection<Piece> getBlackPieces() {
        return this.blackPieces;
    }

    public Collection<Piece> getWhitePieces() {
        return this.whitePieces;
    }

    public Collection<Piece> getAllPieces() {
        return Stream.concat(this.whitePieces.stream(), this.blackPieces.stream())
                     .collect(Collectors.toList());
    }

    private Collection<Move> calculateLegalMoves(Collection<Piece> pieces) {
        final List<Move> legalMoves = new ArrayList<>();
        for (final Piece piece: pieces) legalMoves.addAll(piece.calculateLegalMoves(this));
        return legalMoves;
    }

    private static Collection<Piece> calculateActivePieces(final Builder builder,
                                                           final Alliance alliance) {
        return builder.boardConfig.values().stream()
                .filter(piece -> piece.getPieceAlliance() == alliance).collect(Collectors.toList());
    }

    public static class Builder {
        Map<Integer, Piece> boardConfig;
        Alliance nextMoveMaker;
        Pawn enPassantPawn;
        Move transitionMove;

        public Builder() {
            this.boardConfig = new HashMap<>(32);
        }

        public Builder setPiece(final Piece piece) {
            this.boardConfig.put(piece.getPiecePosition(), piece);
            return this;
        }

        public void setMoveMaker(final Alliance nextMoveMaker) {
            this.nextMoveMaker = nextMoveMaker;
        }

        public Board build() {
            return new Board(this);
        }

        public void setEnPassantPawn(Pawn enPassantPawn) {
            this.enPassantPawn = enPassantPawn;
        }

        public void setMoveTransition(final Move transitionMove) {
            this.transitionMove = transitionMove;
        }

        public Board buildFromJSON(JSONArray JSONboard, String computerAlliance) {
            for (int i = 0; i < BoardUtils.NUM_TILES_PER_ROW; i++) {
                JSONArray row = (JSONArray) JSONboard.get(i);
                for (int j = 0; j < BoardUtils.NUM_TILES_PER_ROW; j++)
                    if (row.get(j) != "") {
                        JSONObject piece = (JSONObject) row.get(j);
                        parsePiece(piece);
                    }
            }
            this.setMoveMaker(parseAlliance(computerAlliance));
            return new Board(this);
        }

        private void parsePiece(JSONObject JSONpiece) {
            if (JSONpiece.isEmpty()) return;
            String pieceType = (String) JSONpiece.get("type");
            String pieceAlliance = (String) JSONpiece.get("color");
            Alliance alliance = parseAlliance(pieceAlliance);
            boolean firstMove = !(boolean) JSONpiece.get("firstMove");
            JSONObject position = (JSONObject) JSONpiece.get("position");
            Long x = (Long) position.get("x");
            Long y = (Long) position.get("y");
            int coordinate = calculateCoordinate(8-x, y-1);
            Piece piece;
            switch (pieceType) {
                case "Pawn" -> {
                    piece = new Pawn(alliance, coordinate, firstMove);
                    this.setPiece(piece);
                }
                case "Rook" -> {
                    piece = new Rook(alliance, coordinate, firstMove);
                    this.setPiece(piece);
                }
                case "Knight" -> {
                    piece = new Knight(alliance, coordinate, firstMove);
                    this.setPiece(piece);
                }
                case "Bishop" -> {
                    piece = new Bishop(alliance, coordinate, firstMove);
                    this.setPiece(piece);
                }
                case "King" -> {
                    boolean kingSideCastleCapable = (boolean) JSONpiece.get("kingSideCastlePossible");
                    boolean queenSideCastleCapable = (boolean) JSONpiece.get("queenSideCastlePossible");
                    piece = new King(alliance, coordinate, firstMove, false,
                            kingSideCastleCapable, queenSideCastleCapable);
                    this.setPiece(piece);
                }
                case "Queen" -> {
                    piece = new Queen(alliance, coordinate, firstMove);
                    this.setPiece(piece);
                }
                default -> {}
            }
        }

        private static int calculateCoordinate(final Long x, final Long y) {
            return 63 - (y.intValue() * BoardUtils.NUM_TILES_PER_ROW + x.intValue());
        }

        private static Alliance parseAlliance(final String alliance) {
            return switch (alliance) {
                case "white" -> Alliance.WHITE;
                case "black" -> Alliance.BLACK;
                default -> null;
            };
        }
    }
}
