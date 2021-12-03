package com.chess.engine.board;

import com.chess.engine.Alliance;
import com.chess.engine.pieces.*;
import com.chess.engine.player.BlackPlayer;
import com.chess.engine.player.Player;
import com.chess.engine.player.WhitePlayer;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static com.chess.engine.board.Move.MoveFactory;

public class Board {
    private final Map<Integer, Piece> boardConfig;

    private final Collection<Piece> whitePieces;
    private final Collection<Piece> blackPieces;

    private final WhitePlayer whitePlayer;
    private final BlackPlayer blackPlayer;
    private Player currentPlayer;

    private final Pawn enPassantPawn;
    private final Move transitionMove;


    private Board(Builder builder) {
        this.boardConfig = Collections.unmodifiableMap(builder.boardConfig);

        this.whitePieces = calculateActivePieces(builder, Alliance.WHITE);
        this.blackPieces = calculateActivePieces(builder, Alliance.BLACK);

        this.enPassantPawn = builder.enPassantPawn;

        final Collection<Move> whiteStandardMoves = calculateLegalMoves(this.whitePieces);
        final Collection<Move> blackStandardMoves = calculateLegalMoves(this.blackPieces);

        this.whitePlayer = new WhitePlayer(this, whiteStandardMoves, blackStandardMoves);
        this.blackPlayer = new BlackPlayer(this, whiteStandardMoves, blackStandardMoves);
        this.currentPlayer = builder.nextMoveMaker.choosePlayerByAlliance(this.whitePlayer, this.blackPlayer);

        this.transitionMove = builder.transitionMove != null ? builder.transitionMove : MoveFactory.getNullMove();
    }

    @Override
    public String toString() {
        final StringBuilder builder = new StringBuilder();
        for (int i = 0; i < BoardUtils.NUM_TILES; i++) {
            final String tileText = prettyPrint(this.boardConfig.get(i));
            builder.append(String.format("%3s", tileText));

            if ((i + 1) % 8 == 0)
                builder.append("\n");
        }

        return builder.reverse().toString();
    }

    private static String prettyPrint(final Piece piece) {
        if (piece != null)
            return piece.getPieceAlliance().isBlack() ? piece.toString().toLowerCase() : piece.toString();

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

    public void setCurrentPlayer(final Alliance currentPlayerAlliance) {
        if (currentPlayerAlliance == Alliance.WHITE)
            this.currentPlayer = whitePlayer;
        else if (currentPlayerAlliance == Alliance.BLACK)
            this.currentPlayer = blackPlayer;
    }

    private Collection<Move> calculateLegalMoves(Collection<Piece> pieces) {
        final List<Move> legalMoves = new ArrayList<>();

        for (final Piece piece: pieces)
            legalMoves.addAll(piece.calculateLegalMoves(this));

        return legalMoves;
    }

    private static Collection<Piece> calculateActivePieces(final Builder builder, final Alliance alliance) {
        return builder.boardConfig.values().stream()
                .filter(piece -> piece.getPieceAlliance() == alliance)
                .collect(Collectors.toList());
    }

//    public static Board getStandardBoard() {
//        return STANDARD_BOARD;
//    }

//    private static Board createStandardBoard() {
//        final Builder builder = new Builder();
//
//        //black layout
//        builder.setPiece(new Rook(Alliance.BLACK, 0));
//        builder.setPiece(new Knight(Alliance.BLACK, 1));
//        builder.setPiece(new Bishop(Alliance.BLACK, 2));
//        builder.setPiece(new Queen(Alliance.BLACK, 3));
//        builder.setPiece(new King(Alliance.BLACK, 4, true, true));
//        builder.setPiece(new Bishop(Alliance.BLACK, 5));
//        builder.setPiece(new Knight(Alliance.BLACK, 6));
//        builder.setPiece(new Rook(Alliance.BLACK, 7));
//        builder.setPiece(new Pawn(Alliance.BLACK, 8));
//        builder.setPiece(new Pawn(Alliance.BLACK, 9));
//        builder.setPiece(new Pawn(Alliance.BLACK, 10));
//        builder.setPiece(new Pawn(Alliance.BLACK, 11));
//        builder.setPiece(new Pawn(Alliance.BLACK, 12));
//        builder.setPiece(new Pawn(Alliance.BLACK, 13));
//        builder.setPiece(new Pawn(Alliance.BLACK, 14));
//        builder.setPiece(new Pawn(Alliance.BLACK, 15));
//
//        //white layout
//        builder.setPiece(new Pawn(Alliance.WHITE, 48));
//        builder.setPiece(new Pawn(Alliance.WHITE, 49));
//        builder.setPiece(new Pawn(Alliance.WHITE, 50));
//        builder.setPiece(new Pawn(Alliance.WHITE, 51));
//        builder.setPiece(new Pawn(Alliance.WHITE, 52));
//        builder.setPiece(new Pawn(Alliance.WHITE, 53));
//        builder.setPiece(new Pawn(Alliance.WHITE, 54));
//        builder.setPiece(new Pawn(Alliance.WHITE, 55));
//        builder.setPiece(new Rook(Alliance.WHITE, 56));
//        builder.setPiece(new Knight(Alliance.WHITE, 57));
//        builder.setPiece(new Bishop(Alliance.WHITE, 58));
//        builder.setPiece(new King(Alliance.WHITE, 59, true, true));
//        builder.setPiece(new Queen(Alliance.WHITE, 60));
//        builder.setPiece(new Bishop(Alliance.WHITE, 61));
//        builder.setPiece(new Knight(Alliance.WHITE, 62));
//        builder.setPiece(new Rook(Alliance.WHITE, 63));
//
//        //white to move
//        builder.setMoveMaker(Alliance.WHITE);
//
//        return builder.build();
//    }

    public Iterable<Move> getAllLegalMoves() {
        return Stream.concat(this.whitePlayer.getLegalMoves().stream(), this.blackPlayer.getLegalMoves().stream())
                .collect(Collectors.toList());
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

        public Builder setMoveMaker(final Alliance nextMoveMaker) {
            this.nextMoveMaker = nextMoveMaker;
            return this;
        }

        public Board build() {
            return new Board(this);
        }

        public Board build2() {
            this.setPiece(new King(Alliance.BLACK, 6, false, false));
            this.setPiece(new Pawn(Alliance.BLACK, 14));
            this.setPiece(new Rook(Alliance.BLACK, 33));
            this.setPiece(new Queen(Alliance.BLACK, 40));
            this.setPiece(new Bishop(Alliance.BLACK, 43));
            this.setPiece(new Queen(Alliance.WHITE, 31));
            this.setPiece(new King(Alliance.WHITE, 30, false, false));
            this.setMoveMaker(Alliance.WHITE);
            return new Board(this);
        }

        public void setEnPassantPawn(Pawn enPassantPawn) {
            this.enPassantPawn = enPassantPawn;
        }

        public void setMoveTransition(final Move transitionMove) {
            this.transitionMove = transitionMove;
        }

        public Board buildFromJson(JSONArray board, String computerAlliance) {
            for (int i = 0; i < 8; i++) {
                JSONArray row = (JSONArray) board.get(i);

                for (int j = 0; j < 8; j++) {
                    if (row.get(j) != "") {
                        JSONObject piece = (JSONObject) row.get(j);
                        parsePiece(piece);
                    }
                }
            }
            this.setMoveMaker(parseAlliance(computerAlliance));

            Board newBoard = new Board(this);
            System.out.println(newBoard);
            return newBoard;
        }

        private void parsePiece(JSONObject piece) {
            if (piece.isEmpty()) return;

            String pieceType = (String) piece.get("type");
            String pieceAlliance = (String) piece.get("color");
            Alliance alliance = parseAlliance(pieceAlliance);
            boolean firstMove = (boolean) piece.get("firstMove");
            JSONObject position = (JSONObject) piece.get("position");
            Long x = (Long) position.get("x");
            Long y = (Long) position.get("y");
            int coordinate = calculateCoordinate(8-x, y-1);
            Piece newPiece;

            switch (pieceType) {
                case "Pawn" -> {
                    newPiece = new Pawn(alliance, coordinate, firstMove);
                    this.setPiece(newPiece);
                }
                case "Rook" -> {
                    newPiece = new Rook(alliance, coordinate, firstMove);
                    this.setPiece(newPiece);
                }
                case "Knight" -> {
                    newPiece = new Knight(alliance, coordinate, firstMove);
                    this.setPiece(newPiece);
                }
                case "Bishop" -> {
                    newPiece = new Bishop(alliance, coordinate, firstMove);
                    this.setPiece(newPiece);
                }
                case "King" -> {
                    boolean kingSideCastleCapable = (boolean) piece.get("kingSideCastlePossible");
                    boolean queenSideCastleCapable = (boolean) piece.get("queenSideCastlePossible");
                    newPiece = new King(alliance, coordinate, firstMove, false, kingSideCastleCapable, queenSideCastleCapable);
                    this.setPiece(newPiece);
                }
                case "Queen" -> {
                    newPiece = new Queen(alliance, coordinate, firstMove);
                    this.setPiece(newPiece);
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
