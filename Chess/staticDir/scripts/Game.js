function Game() {
    var localTable;
    var gameId = 0; // DO ZMIANY
    var idCount = 0;
    var gameEnabled = false;
    var chosenColor = "white";
    var yourColor;
    var chosenPawn;
    var whereCanGo = [];
    var whereCanAttack = [];
    var whereCanEnPassant = [];
    var whereCanCast = [];
    var kingCheck = false;
    var kingColorCheck = "";
    var howManyTurns = 0;
    var ai_playing = false;
    
    this.loadingFigures = 0; // out of 32
    this.depth = 5;

    this.ai_playing = false;
    this.timer;

    this.turnTheGameOn = function () {
        gameEnabled = true;
    }

    this.turnTheGameOff = function () {
        gameEnabled = false;
    }

    this.isGameEnabled = function () {
        return gameEnabled;
    }

    this.getLocalTable = function () {
        var tempLocalTable = [ [], [], [], [], [], [], [], [] ];
        for (var i = 0; i < localTable.length; i++) {
            for (var j = 0; j < localTable[i].length; j++) {
                tempLocalTable[i][j] = localTable[i][j];
            }
        }
        return tempLocalTable;
    }

    this.setGameId = function (newGameId) {
        gameId = newGameId;
    }

    this.getGameId = function () {
        return gameId;
    }

    this.setYourColor = function (newYourColor) {
        yourColor = newYourColor;
    }

    this.getYourColor = function () {
        return yourColor;
    }

    this.placeClicked = function (x, y) {
        document.getElementById("x" + x + "_y" + y).click();
    }

    this.opponentMove = async function (pawn, xDes, yDes, enPassant, casting) {
        await moveFigure(pawn, xDes, yDes, enPassant, casting);
        checkIfCheck();
        document.getElementById("checkText").innerHTML = document.getElementById("check").innerHTML;
        if (game.isGameEnabled() == true) {
            game.timer.startTimer();
        }
    }

    async function createTable() {
        var div = document.createElement("div");
        div.id = "plansza";
        div.style.width = "432px";
        div.style.height = "432px";
        div.style.margin = "10px";
        for (var i = 0; i < 8; i++) {
            for (j = 0; j < 8; j++) {
                var window = document.createElement("div");
                window.style.width = "50px";
                window.style.height = "50px";
                window.style.border = "2px solid black";
                window.style.borderTop = "0";
                window.style.borderLeft = "0";
                window.style.display = "inline-block";
                window.style.float = "left";
                window.id = "x" + (j + 1) + "_y" + (i + 1);
                if (i == 0) window.style.borderTop = "2px solid black";
                if (j == 0) window.style.borderLeft = "2px solid black";
                div.appendChild(window);

                window.addEventListener("click", async function () {
                    if (gameEnabled == true && chosenColor == yourColor) {
                        var x = (parseInt(this.id[1]) - 1);
                        var y = (parseInt(this.id[4]) - 1);
                        if (chosenPawn == undefined) {
                            if (localTable[y][x] != "") {
                                if (localTable[y][x].color == chosenColor) {
                                    chosenPawn = localTable[y][x];
                                    typeWhereToGo(chosenPawn);
                                    this.style.backgroundColor = "blue";
                                    main.changeColorOfPlace(x, y, "blue");
                                }
                            }
                        } else {
                            if (localTable[y][x].color != chosenColor) {
                                var isPossible = false;
                                var enPassant = false;
                                var Casting = false;
                                for (var i = 0; i < whereCanGo.length; i++) if (whereCanGo[i] == this) isPossible = true;
                                for (var i = 0; i < whereCanAttack.length; i++) if (whereCanAttack[i] == this) isPossible = true;
                                for (var i = 0; i < whereCanEnPassant.length; i++) if (whereCanEnPassant[i] == this) { isPossible = true; enPassant = true; }
                                for (var i = 0; i < whereCanCast.length; i++) if (whereCanCast[i] == this) { isPossible = true; Casting = true; }
                                if (isPossible == true) {
                                    game.timer.stopTimer();
                                    let fromX = chosenPawn.position.x;
                                    let fromY = chosenPawn.position.y;
                                    let hitPawn = false;
                                    let previousLocalTable;
                                    if (localTable[y][x].color == "black" || localTable[y][x].color == "white") {
                                        hitPawn = true;
                                    }
                                    clearColors();

                                    let objToBeSent = { pawn: JSON.parse(JSON.stringify(chosenPawn)),
                                        fromX: fromX,
                                        fromY: fromY,
                                        xDes: x + 1,
                                        yDes: y + 1,
                                        hitPawn: hitPawn,
                                        enPassant: enPassant,
                                        casting: Casting,
                                        color: yourColor,
                                        gmid: gameId,
                                        localTable: JSON.parse(JSON.stringify(localTable))
                                    }

                                    if (ai_playing == true) {
                                        previousLocalTable = JSON.parse(JSON.stringify(localTable));
                                    }
                                    await moveFigure(chosenPawn, x + 1, y + 1, enPassant, Casting);
                                    if (ai_playing == true) {
                                        checkIfCheck();
                                        objToBeSent.isFinishedGame = (game.isFinishedGame != undefined) ? game.isFinishedGame : false;
                                        if (gameEnabled == true) {
                                            objToBeSent.pawn = JSON.parse(JSON.stringify(chosenPawn));
                                            objToBeSent.localTable = JSON.parse(JSON.stringify(localTable));
                                            objToBeSent.depth = game.depth;
                                            objToBeSent.previousLocalTable = JSON.parse(JSON.stringify(previousLocalTable));

                                            net.turn(objToBeSent);
                                        }
                                    } else {
                                        checkIfCheck();
                                        objToBeSent.isFinishedGame = (game.isFinishedGame != undefined) ? game.isFinishedGame : false;
                                        net.turn(objToBeSent);
                                    }
                                    chosenPawn = undefined;
                                    
                                    var string;
                                    if (game.getYourColor() == "white") string = "białymi.<br/>Ruch przeciwnika.";
                                    if (game.getYourColor() == "black") string = "czarnymi.<br/>Ruch przeciwnika.";
                                    net.window.showWindow("Grasz " + string);
                                    readTable();
                                    checkIfCheck();
                                    document.getElementById("checkText").innerHTML = document.getElementById("check").innerHTML;
                                }
                            } else {
                                chosenPawn = localTable[y][x];
                                typeWhereToGo(chosenPawn);
                                this.style.backgroundColor = "blue";
                                main.changeColorOfPlace(x, y, "blue");
                            }
                        }
                    }
                })
            }
        }
        var check = document.createElement("div");
        check.innerHTML = "Twój król nie jest zagrożony.";
        check.style.textAlign = "center";
        check.style.width = "432px";
        check.id = "check";
        document.body.appendChild(div);
        document.body.appendChild(check);
        net.window.safe();
    }

    function readTable() {
        if (chosenColor == "white") {
            document.getElementById("plansza").style.webkitTransform = 'rotate(' + 180 + 'deg)';
            document.getElementById("plansza").style.mozTransform = 'rotate(' + 180 + 'deg)';
            document.getElementById("plansza").style.msTransform = 'rotate(' + 180 + 'deg)';
            document.getElementById("plansza").style.oTransform = 'rotate(' + 180 + 'deg)';
            document.getElementById("plansza").style.transform = 'rotate(' + 180 + 'deg)';
        } else {
            document.getElementById("plansza").style.webkitTransform = 'rotate(' + 0 + 'deg)';
            document.getElementById("plansza").style.mozTransform = 'rotate(' + 0 + 'deg)';
            document.getElementById("plansza").style.msTransform = 'rotate(' + 0 + 'deg)';
            document.getElementById("plansza").style.oTransform = 'rotate(' + 0 + 'deg)';
            document.getElementById("plansza").style.transform = 'rotate(' + 0 + 'deg)';
        }

        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
                if (localTable[i][j] != "") {
                    if (localTable[i][j].color == "white") {
                        if (localTable[i][j].type == "Rook") {
                            document.getElementById("x" + (j + 1) + "_y" + (i + 1)).style.backgroundImage = "url('/gfx/ww.png')";
                        } else if (localTable[i][j].type == "Knight") {
                            document.getElementById("x" + (j + 1) + "_y" + (i + 1)).style.backgroundImage = "url('/gfx/hw.png')";
                        } else if (localTable[i][j].type == "Bishop") {
                            document.getElementById("x" + (j + 1) + "_y" + (i + 1)).style.backgroundImage = "url('/gfx/gw.png')";
                        } else if (localTable[i][j].type == "Queen") {
                            document.getElementById("x" + (j + 1) + "_y" + (i + 1)).style.backgroundImage = "url('/gfx/qw.png')";
                        } else if (localTable[i][j].type == "King") {
                            document.getElementById("x" + (j + 1) + "_y" + (i + 1)).style.backgroundImage = "url('/gfx/kw.png')";
                        } else if (localTable[i][j].type == "Pawn") {
                            document.getElementById("x" + (j + 1) + "_y" + (i + 1)).style.backgroundImage = "url('/gfx/pw.png')";
                        }
                    } else if (localTable[i][j].color == "black") {
                        if (localTable[i][j].type == "Rook") {
                            document.getElementById("x" + (j + 1) + "_y" + (i + 1)).style.backgroundImage = "url('/gfx/wb.png')";
                        } else if (localTable[i][j].type == "Knight") {
                            document.getElementById("x" + (j + 1) + "_y" + (i + 1)).style.backgroundImage = "url('/gfx/hb.png')";
                        } else if (localTable[i][j].type == "Bishop") {
                            document.getElementById("x" + (j + 1) + "_y" + (i + 1)).style.backgroundImage = "url('/gfx/gb.png')";
                        } else if (localTable[i][j].type == "Queen") {
                            document.getElementById("x" + (j + 1) + "_y" + (i + 1)).style.backgroundImage = "url('/gfx/qb.png')";
                        } else if (localTable[i][j].type == "King") {
                            document.getElementById("x" + (j + 1) + "_y" + (i + 1)).style.backgroundImage = "url('/gfx/kb.png')";
                        } else if (localTable[i][j].type == "Pawn") {
                            document.getElementById("x" + (j + 1) + "_y" + (i + 1)).style.backgroundImage = "url('/gfx/pb.png')";
                        }
                    }
                } else {
                    document.getElementById("x" + (j + 1) + "_y" + (i + 1)).style.backgroundImage = "";
                }
                if (chosenColor == "white") {
                    document.getElementById("x" + (j + 1) + "_y" + (i + 1)).style.webkitTransform = 'rotate(' + 180 + 'deg)';
                    document.getElementById("x" + (j + 1) + "_y" + (i + 1)).style.mozTransform = 'rotate(' + 180 + 'deg)';
                    document.getElementById("x" + (j + 1) + "_y" + (i + 1)).style.msTransform = 'rotate(' + 180 + 'deg)';
                    document.getElementById("x" + (j + 1) + "_y" + (i + 1)).style.oTransform = 'rotate(' + 180 + 'deg)';
                    document.getElementById("x" + (j + 1) + "_y" + (i + 1)).style.transform = 'rotate(' + 180 + 'deg)';
                } else {
                    document.getElementById("x" + (j + 1) + "_y" + (i + 1)).style.webkitTransform = 'rotate(' + 0 + 'deg)';
                    document.getElementById("x" + (j + 1) + "_y" + (i + 1)).style.mozTransform = 'rotate(' + 0 + 'deg)';
                    document.getElementById("x" + (j + 1) + "_y" + (i + 1)).style.msTransform = 'rotate(' + 0 + 'deg)';
                    document.getElementById("x" + (j + 1) + "_y" + (i + 1)).style.oTransform = 'rotate(' + 0 + 'deg)';
                    document.getElementById("x" + (j + 1) + "_y" + (i + 1)).style.transform = 'rotate(' + 0 + 'deg)';
                }
            }
        }
    }

    async function moveFigure(pawn, xDes, yDes, enPassant, casting) {
        return new Promise(async (resolve) => {
            for (var i = 0; i < localTable.length; i++) {
                for (var j = 0; j < localTable[0].length; j++) {
                    if (localTable[i][j] != undefined) {
                        if (localTable[i][j].type == "Pawn") {
                            localTable[i][j].enPassant = false;
                        }
                    }
                }
            }
            let isDeleted = main.deletePawn(xDes, yDes);
            await main.moveFigure(pawn.position.x, pawn.position.y, xDes, yDes,
                                                                            pawn.type == "Knight" ? true : false, true);
            if (pawn.type == "Pawn") {
                if (pawn.position.y - yDes == 2 || pawn.position.y - yDes == (-2)) {
                    pawn.enPassant = true;
                }
            }
            if (casting == true) {
                if (pawn.position.x - xDes < 0) { // -4
                    await main.moveFigure(pawn.position.x + 3, pawn.position.y, xDes - 1, yDes, true);
                    localTable[pawn.position.y - 1][pawn.position.x - 1 + 1] = localTable[pawn.position.y - 1][pawn.position.x - 1 + 3];
                    localTable[pawn.position.y - 1][pawn.position.x - 1 + 3] = "";
                    localTable[pawn.position.y - 1][pawn.position.x - 1 + 1].position.x = xDes - 1;
                } else { // +3
                    await main.moveFigure(pawn.position.x - 4, pawn.position.y, xDes + 1, yDes, true);
                    localTable[pawn.position.y - 1][pawn.position.x - 1 - 1] = localTable[pawn.position.y - 1][pawn.position.x - 1 - 4];
                    localTable[pawn.position.y - 1][pawn.position.x - 1 - 4] = "";
                    localTable[pawn.position.y - 1][pawn.position.x - 1 - 1].position.x = xDes + 1;
                }
            }
            var temp = localTable[pawn.position.y - 1][pawn.position.x - 1];
            localTable[pawn.position.y - 1][pawn.position.x - 1] = "";
            localTable[yDes - 1][xDes - 1] = temp;
            localTable[yDes - 1][xDes - 1].position = {
                x: xDes,
                y: yDes
            };
            localTable[yDes - 1][xDes - 1].firstMove = true;
            if (pawn.type == "Pawn") {
                if (pawn.color == "white" && yDes == 8) {
                    pawn.type = "Queen";
                    localTable[yDes - 1][xDes - 1].type = "Queen";
                    main.changeModel(xDes, yDes, "Queen");
                }
                if (pawn.color == "black" && yDes == 1) {
                    pawn.type = "Queen";
                    localTable[yDes - 1][xDes - 1].type = "Queen";
                    main.changeModel(xDes, yDes, "Queen");
                }
            }
            if (enPassant == true) { if (pawn.color == "white") { main.deletePawn(xDes, yDes - 1); localTable[yDes - 1 - 1][xDes - 1] = ""; } else if (pawn.color == "black") { main.deletePawn(pawn.position.x, pawn.position.y + 1); localTable[pawn.position.y - 1 + 1][pawn.position.x - 1] = ""; } }
            pawn.firstMove = true;
            if (chosenColor == "white") chosenColor = "black"; else chosenColor = "white";
            resolve(isDeleted);
        });
    }

    function clearColors() {
        for (var i = 1; i < 9; i++) {
            for (var j = 1; j < 9; j++) {
                document.getElementById("x" + j + "_y" + i).style.backgroundColor = "";
            }
        }
        main.clearColors();
    }

    function CheckTable(pawn, table, wherecango, wherecanattack, wherecanenpassant, wherecancast, colorToCheck, checkMove) {
        if (checkMove == undefined) checkMove = false;

        if (pawn.type == "Pawn") {
            if (pawn.color == "white") {
                if (pawn.firstMove == false) {
                    if (document.getElementById("x" + (pawn.position.x) + "_y" + (pawn.position.y + 1)) != null) if (table[pawn.position.y][pawn.position.x - 1] == "") { var ch = true; if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x, pawn.position.y + 1); } if (ch == true) wherecango.push(document.getElementById("x" + (pawn.position.x) + "_y" + (pawn.position.y + 1))) };
                    if (document.getElementById("x" + (pawn.position.x) + "_y" + (pawn.position.y + 2)) != null) if (table[pawn.position.y][pawn.position.x - 1] == "" && table[pawn.position.y + 1][pawn.position.x - 1] == "") { var ch = true; if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x, pawn.position.y + 2); } if (ch == true) wherecango.push(document.getElementById("x" + (pawn.position.x) + "_y" + (pawn.position.y + 2))) };
                } else {
                    if (document.getElementById("x" + (pawn.position.x) + "_y" + (pawn.position.y + 1)) != null) if (table[pawn.position.y][pawn.position.x - 1] == "") { var ch = true; if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x, pawn.position.y + 1); } if (ch == true) wherecango.push(document.getElementById("x" + (pawn.position.x) + "_y" + (pawn.position.y + 1))) };
                }
                if (document.getElementById("x" + (pawn.position.x + 1) + "_y" + (pawn.position.y + 1)) != null) if (table[pawn.position.y][pawn.position.x] != "") if (table[pawn.position.y][pawn.position.x].color != colorToCheck) { var ch = true; if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x + 1, pawn.position.y + 1); } if (ch == true) wherecanattack.push(document.getElementById("x" + (pawn.position.x + 1) + "_y" + (pawn.position.y + 1))) };
                if (document.getElementById("x" + (pawn.position.x - 1) + "_y" + (pawn.position.y + 1)) != null) if (table[pawn.position.y][pawn.position.x - 2] != "") if (table[pawn.position.y][pawn.position.x - 2].color != colorToCheck) { var ch = true; if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x - 1, pawn.position.y + 1); } if (ch == true) wherecanattack.push(document.getElementById("x" + (pawn.position.x - 1) + "_y" + (pawn.position.y + 1))) };
                if (pawn.position.y == 5) { // en Passant
                    if (document.getElementById("x" + (pawn.position.x - 1) + "_y" + (pawn.position.y)) != null) {
                        if (table[pawn.position.y - 1][pawn.position.x - 2].color != colorToCheck) {
                            if (table[pawn.position.y - 1][pawn.position.x - 2].enPassant == true) {
                                if (table[pawn.position.y][pawn.position.x - 2] == "") {
                                    var ch = true;
                                    if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x - 1, pawn.position.y + 1); }
                                    if (ch == true) wherecanenpassant.push(document.getElementById("x" + (pawn.position.x - 1) + "_y" + (pawn.position.y + 1)));
                                }
                            }
                        }
                    }
                    if (document.getElementById("x" + (pawn.position.x + 1) + "_y" + (pawn.position.y)) != null) {
                        if (table[pawn.position.y - 1][pawn.position.x].color != colorToCheck) {
                            if (table[pawn.position.y - 1][pawn.position.x].enPassant == true) {
                                if (table[pawn.position.y][pawn.position.x] == "") {
                                    var ch = true;
                                    if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x + 1, pawn.position.y + 1); }
                                    if (ch == true) wherecanenpassant.push(document.getElementById("x" + (pawn.position.x + 1) + "_y" + (pawn.position.y + 1)));
                                }
                            }
                        }
                    }
                }
            } else if (pawn.color == "black") {
                if (pawn.firstMove == false) {
                    if (document.getElementById("x" + (pawn.position.x) + "_y" + (pawn.position.y - 1)) != null) if (table[pawn.position.y - 2][pawn.position.x - 1] == "") { var ch = true; if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x, pawn.position.y - 1); } if (ch == true) wherecango.push(document.getElementById("x" + (pawn.position.x) + "_y" + (pawn.position.y - 1))); }
                    if (document.getElementById("x" + (pawn.position.x) + "_y" + (pawn.position.y - 2)) != null) if (table[pawn.position.y - 2][pawn.position.x - 1] == "" && table[pawn.position.y - 3][pawn.position.x - 1] == "") { var ch = true; if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x, pawn.position.y - 2); } if (ch == true) wherecango.push(document.getElementById("x" + (pawn.position.x) + "_y" + (pawn.position.y - 2))); }
                } else {
                    if (document.getElementById("x" + (pawn.position.x) + "_y" + (pawn.position.y - 1)) != null) if (table[pawn.position.y - 2][pawn.position.x - 1] == "") { var ch = true; if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x, pawn.position.y - 1); } if (ch == true) wherecango.push(document.getElementById("x" + (pawn.position.x) + "_y" + (pawn.position.y - 1))); }
                }
                if (document.getElementById("x" + (pawn.position.x + 1) + "_y" + (pawn.position.y - 1)) != null) if (table[pawn.position.y - 2][pawn.position.x] != "") if (table[pawn.position.y - 2][pawn.position.x].color != colorToCheck) { var ch = true; if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x + 1, pawn.position.y - 1); } if (ch == true) wherecanattack.push(document.getElementById("x" + (pawn.position.x + 1) + "_y" + (pawn.position.y - 1))); }
                if (document.getElementById("x" + (pawn.position.x - 1) + "_y" + (pawn.position.y - 1)) != null) if (table[pawn.position.y - 2][pawn.position.x - 2] != "") if (table[pawn.position.y - 2][pawn.position.x - 2].color != colorToCheck) { var ch = true; if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x - 1, pawn.position.y - 1); } if (ch == true) wherecanattack.push(document.getElementById("x" + (pawn.position.x - 1) + "_y" + (pawn.position.y - 1))); }
                if (pawn.position.y == 4) { // en Passant
                    if (document.getElementById("x" + (pawn.position.x - 1) + "_y" + (pawn.position.y)) != null) {
                        if (table[pawn.position.y - 1][pawn.position.x - 2].color != colorToCheck) {
                            if (table[pawn.position.y - 1][pawn.position.x - 2].enPassant == true) {
                                if (table[pawn.position.y - 2][pawn.position.x - 2] == "") {
                                    var ch = true;
                                    if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x - 1, pawn.position.y - 1); }
                                    if (ch == true) wherecanenpassant.push(document.getElementById("x" + (pawn.position.x - 1) + "_y" + (pawn.position.y - 1)));
                                }
                            }
                        }
                    }
                    if (document.getElementById("x" + (pawn.position.x + 1) + "_y" + (pawn.position.y)) != null) {
                        if (table[pawn.position.y - 1][pawn.position.x].color != colorToCheck) {
                            if (table[pawn.position.y - 1][pawn.position.x].enPassant == true) {
                                if (table[pawn.position.y - 2][pawn.position.x] == "") {
                                    var ch = true;
                                    if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x + 1, pawn.position.y - 1); }
                                    if (ch == true) wherecanenpassant.push(document.getElementById("x" + (pawn.position.x + 1) + "_y" + (pawn.position.y - 1)));
                                }
                            }
                        }
                    }
                }
            }
        } else if (pawn.type == "Rook") {
            for (var i = 1; i < 8; i++) {
                if (document.getElementById("x" + (pawn.position.x) + "_y" + (pawn.position.y + i)) != null) {
                    if (table[pawn.position.y - 1 + i][pawn.position.x - 1] != "") { if (table[pawn.position.y - 1 + i][pawn.position.x - 1].color != colorToCheck) { var ch = true; if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x, pawn.position.y + i); } if (ch == true) wherecanattack.push(document.getElementById("x" + (pawn.position.x) + "_y" + (pawn.position.y + i))); } break; }
                    var ch = true;
                    if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x, pawn.position.y + i); }
                    if (ch == true) wherecango.push(document.getElementById("x" + (pawn.position.x) + "_y" + (pawn.position.y + i)));
                }
            }
            for (var i = 1; i < 8; i++) {
                if (document.getElementById("x" + (pawn.position.x) + "_y" + (pawn.position.y - i)) != null) {
                    if (table[pawn.position.y - 1 - i][pawn.position.x - 1] != "") { if (table[pawn.position.y - 1 - i][pawn.position.x - 1].color != colorToCheck) { var ch = true; if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x, pawn.position.y - i); } if (ch == true) wherecanattack.push(document.getElementById("x" + (pawn.position.x) + "_y" + (pawn.position.y - i))); } break; }
                    var ch = true;
                    if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x, pawn.position.y - i); }
                    if (ch == true) wherecango.push(document.getElementById("x" + (pawn.position.x) + "_y" + (pawn.position.y - i)));
                }
            }
            for (var i = 1; i < 8; i++) {
                if (document.getElementById("x" + (pawn.position.x + i) + "_y" + (pawn.position.y)) != null) {
                    if (table[pawn.position.y - 1][pawn.position.x - 1 + i] != "") { if (table[pawn.position.y - 1][pawn.position.x - 1 + i].color != colorToCheck) { var ch = true; if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x + i, pawn.position.y); } if (ch == true) wherecanattack.push(document.getElementById("x" + (pawn.position.x + i) + "_y" + (pawn.position.y))); } break; }
                    var ch = true;
                    if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x + i, pawn.position.y); }
                    if (ch == true) wherecango.push(document.getElementById("x" + (pawn.position.x + i) + "_y" + (pawn.position.y)));
                }
            }
            for (var i = 1; i < 8; i++) {
                if (document.getElementById("x" + (pawn.position.x - i) + "_y" + (pawn.position.y)) != null) {
                    if (table[pawn.position.y - 1][pawn.position.x - 1 - i] != "") { if (table[pawn.position.y - 1][pawn.position.x - 1 - i].color != colorToCheck) { var ch = true; if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x - i, pawn.position.y); } if (ch == true) wherecanattack.push(document.getElementById("x" + (pawn.position.x - i) + "_y" + (pawn.position.y))); } break; }
                    var ch = true;
                    if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x - i, pawn.position.y); }
                    if (ch == true) wherecango.push(document.getElementById("x" + (pawn.position.x - i) + "_y" + (pawn.position.y)));
                }
            }
        } else if (pawn.type == "Knight") {
            if (document.getElementById("x" + (pawn.position.x + 1) + "_y" + (pawn.position.y + 2)) != null) if (table[pawn.position.y - 1 + 2][pawn.position.x - 1 + 1] == "") { var ch = true; if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x + 1, pawn.position.y + 2); } if (ch == true) wherecango.push(document.getElementById("x" + (pawn.position.x + 1) + "_y" + (pawn.position.y + 2))); } else { if (table[pawn.position.y - 1 + 2][pawn.position.x - 1 + 1].color != colorToCheck) { var ch = true; if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x + 1, pawn.position.y + 2); } if (ch == true) wherecanattack.push(document.getElementById("x" + (pawn.position.x + 1) + "_y" + (pawn.position.y + 2))); } }
            if (document.getElementById("x" + (pawn.position.x + 1) + "_y" + (pawn.position.y - 2)) != null) if (table[pawn.position.y - 1 - 2][pawn.position.x - 1 + 1] == "") { var ch = true; if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x + 1, pawn.position.y - 2); } if (ch == true) wherecango.push(document.getElementById("x" + (pawn.position.x + 1) + "_y" + (pawn.position.y - 2))); } else { if (table[pawn.position.y - 1 - 2][pawn.position.x - 1 + 1].color != colorToCheck) { var ch = true; if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x + 1, pawn.position.y - 2); } if (ch == true) wherecanattack.push(document.getElementById("x" + (pawn.position.x + 1) + "_y" + (pawn.position.y - 2))); } }
            if (document.getElementById("x" + (pawn.position.x + 2) + "_y" + (pawn.position.y + 1)) != null) if (table[pawn.position.y - 1 + 1][pawn.position.x - 1 + 2] == "") { var ch = true; if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x + 2, pawn.position.y + 1); } if (ch == true) wherecango.push(document.getElementById("x" + (pawn.position.x + 2) + "_y" + (pawn.position.y + 1))); } else { if (table[pawn.position.y - 1 + 1][pawn.position.x - 1 + 2].color != colorToCheck) { var ch = true; if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x + 2, pawn.position.y + 1); } if (ch == true) wherecanattack.push(document.getElementById("x" + (pawn.position.x + 2) + "_y" + (pawn.position.y + 1))); } }
            if (document.getElementById("x" + (pawn.position.x + 2) + "_y" + (pawn.position.y - 1)) != null) if (table[pawn.position.y - 1 - 1][pawn.position.x - 1 + 2] == "") { var ch = true; if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x + 2, pawn.position.y - 1); } if (ch == true) wherecango.push(document.getElementById("x" + (pawn.position.x + 2) + "_y" + (pawn.position.y - 1))); } else { if (table[pawn.position.y - 1 - 1][pawn.position.x - 1 + 2].color != colorToCheck) { var ch = true; if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x + 2, pawn.position.y - 1); } if (ch == true) wherecanattack.push(document.getElementById("x" + (pawn.position.x + 2) + "_y" + (pawn.position.y - 1))); } }
            if (document.getElementById("x" + (pawn.position.x - 1) + "_y" + (pawn.position.y + 2)) != null) if (table[pawn.position.y - 1 + 2][pawn.position.x - 1 - 1] == "") { var ch = true; if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x - 1, pawn.position.y + 2); } if (ch == true) wherecango.push(document.getElementById("x" + (pawn.position.x - 1) + "_y" + (pawn.position.y + 2))); } else { if (table[pawn.position.y - 1 + 2][pawn.position.x - 1 - 1].color != colorToCheck) { var ch = true; if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x - 1, pawn.position.y + 2); } if (ch == true) wherecanattack.push(document.getElementById("x" + (pawn.position.x - 1) + "_y" + (pawn.position.y + 2))); } }
            if (document.getElementById("x" + (pawn.position.x - 1) + "_y" + (pawn.position.y - 2)) != null) if (table[pawn.position.y - 1 - 2][pawn.position.x - 1 - 1] == "") { var ch = true; if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x - 1, pawn.position.y - 2); } if (ch == true) wherecango.push(document.getElementById("x" + (pawn.position.x - 1) + "_y" + (pawn.position.y - 2))); } else { if (table[pawn.position.y - 1 - 2][pawn.position.x - 1 - 1].color != colorToCheck) { var ch = true; if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x - 1, pawn.position.y - 2); } if (ch == true) wherecanattack.push(document.getElementById("x" + (pawn.position.x - 1) + "_y" + (pawn.position.y - 2))); } }
            if (document.getElementById("x" + (pawn.position.x - 2) + "_y" + (pawn.position.y + 1)) != null) if (table[pawn.position.y - 1 + 1][pawn.position.x - 1 - 2] == "") { var ch = true; if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x - 2, pawn.position.y + 1); } if (ch == true) wherecango.push(document.getElementById("x" + (pawn.position.x - 2) + "_y" + (pawn.position.y + 1))); } else { if (table[pawn.position.y - 1 + 1][pawn.position.x - 1 - 2].color != colorToCheck) { var ch = true; if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x - 2, pawn.position.y + 1); } if (ch == true) wherecanattack.push(document.getElementById("x" + (pawn.position.x - 2) + "_y" + (pawn.position.y + 1))); } }
            if (document.getElementById("x" + (pawn.position.x - 2) + "_y" + (pawn.position.y - 1)) != null) if (table[pawn.position.y - 1 - 1][pawn.position.x - 1 - 2] == "") { var ch = true; if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x - 2, pawn.position.y - 1); } if (ch == true) wherecango.push(document.getElementById("x" + (pawn.position.x - 2) + "_y" + (pawn.position.y - 1))); } else { if (table[pawn.position.y - 1 - 1][pawn.position.x - 1 - 2].color != colorToCheck) { var ch = true; if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x - 2, pawn.position.y - 1); } if (ch == true) wherecanattack.push(document.getElementById("x" + (pawn.position.x - 2) + "_y" + (pawn.position.y - 1))); } }
        } else if (pawn.type == "Bishop") {
            for (var i = 1; i < 8; i++) {
                if (document.getElementById("x" + (pawn.position.x + i) + "_y" + (pawn.position.y + i)) != null) {
                    if (table[pawn.position.y - 1 + i][pawn.position.x - 1 + i] != "") { if (table[pawn.position.y - 1 + i][pawn.position.x - 1 + i].color != colorToCheck) { var ch = true; if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x + i, pawn.position.y + i); } if (ch == true) wherecanattack.push(document.getElementById("x" + (pawn.position.x + i) + "_y" + (pawn.position.y + i))); } break; }
                    var ch = true;
                    if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x + i, pawn.position.y + i); }
                    if (ch == true) wherecango.push(document.getElementById("x" + (pawn.position.x + i) + "_y" + (pawn.position.y + i)));
                }
            }
            for (var i = 1; i < 8; i++) {
                if (document.getElementById("x" + (pawn.position.x - i) + "_y" + (pawn.position.y - i)) != null) {
                    if (table[pawn.position.y - 1 - i][pawn.position.x - 1 - i] != "") { if (table[pawn.position.y - 1 - i][pawn.position.x - 1 - i].color != colorToCheck) { var ch = true; if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x - i, pawn.position.y - i); } if (ch == true) wherecanattack.push(document.getElementById("x" + (pawn.position.x - i) + "_y" + (pawn.position.y - i))); } break; }
                    var ch = true;
                    if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x - i, pawn.position.y - i); }
                    if (ch == true) wherecango.push(document.getElementById("x" + (pawn.position.x - i) + "_y" + (pawn.position.y - i)));
                }
            }
            for (var i = 1; i < 8; i++) {
                if (document.getElementById("x" + (pawn.position.x + i) + "_y" + (pawn.position.y - i)) != null) {
                    if (table[pawn.position.y - 1 - i][pawn.position.x - 1 + i] != "") { if (table[pawn.position.y - 1 - i][pawn.position.x - 1 + i].color != colorToCheck) { var ch = true; if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x + i, pawn.position.y - i); } if (ch == true) wherecanattack.push(document.getElementById("x" + (pawn.position.x + i) + "_y" + (pawn.position.y - i))); } break; }
                    var ch = true;
                    if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x + i, pawn.position.y - i); }
                    if (ch == true) wherecango.push(document.getElementById("x" + (pawn.position.x + i) + "_y" + (pawn.position.y - i)));
                }
            }
            for (var i = 1; i < 8; i++) {
                if (document.getElementById("x" + (pawn.position.x - i) + "_y" + (pawn.position.y + i)) != null) {
                    if (table[pawn.position.y - 1 + i][pawn.position.x - 1 - i] != "") { if (table[pawn.position.y - 1 + i][pawn.position.x - 1 - i].color != colorToCheck) { var ch = true; if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x - i, pawn.position.y + i); } if (ch == true) wherecanattack.push(document.getElementById("x" + (pawn.position.x - i) + "_y" + (pawn.position.y + i))); } break; }
                    var ch = true;
                    if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x - i, pawn.position.y + i); }
                    if (ch == true) wherecango.push(document.getElementById("x" + (pawn.position.x - i) + "_y" + (pawn.position.y + i)));
                }
            }
        } else if (pawn.type == "Queen") {
            for (var i = 1; i < 8; i++) {
                if (document.getElementById("x" + (pawn.position.x) + "_y" + (pawn.position.y + i)) != null) {
                    if (table[pawn.position.y - 1 + i][pawn.position.x - 1] != "") { if (table[pawn.position.y - 1 + i][pawn.position.x - 1].color != colorToCheck) { var ch = true; if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x, pawn.position.y + i); } if (ch == true) wherecanattack.push(document.getElementById("x" + (pawn.position.x) + "_y" + (pawn.position.y + i))); } break; }
                    var ch = true;
                    if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x, pawn.position.y + i); }
                    if (ch == true) wherecango.push(document.getElementById("x" + (pawn.position.x) + "_y" + (pawn.position.y + i)));
                }
            }
            for (var i = 1; i < 8; i++) {
                if (document.getElementById("x" + (pawn.position.x) + "_y" + (pawn.position.y - i)) != null) {
                    if (table[pawn.position.y - 1 - i][pawn.position.x - 1] != "") { if (table[pawn.position.y - 1 - i][pawn.position.x - 1].color != colorToCheck) { var ch = true; if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x, pawn.position.y - i); } if (ch == true) wherecanattack.push(document.getElementById("x" + (pawn.position.x) + "_y" + (pawn.position.y - i))); } break; }
                    var ch = true;
                    if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x, pawn.position.y - i); }
                    if (ch == true) wherecango.push(document.getElementById("x" + (pawn.position.x) + "_y" + (pawn.position.y - i)));
                }
            }
            for (var i = 1; i < 8; i++) {
                if (document.getElementById("x" + (pawn.position.x + i) + "_y" + (pawn.position.y)) != null) {
                    if (table[pawn.position.y - 1][pawn.position.x - 1 + i] != "") { if (table[pawn.position.y - 1][pawn.position.x - 1 + i].color != colorToCheck) { var ch = true; if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x + i, pawn.position.y); } if (ch == true) wherecanattack.push(document.getElementById("x" + (pawn.position.x + i) + "_y" + (pawn.position.y))); } break; }
                    var ch = true;
                    if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x + i, pawn.position.y); }
                    if (ch == true) wherecango.push(document.getElementById("x" + (pawn.position.x + i) + "_y" + (pawn.position.y)));
                }
            }
            for (var i = 1; i < 8; i++) {
                if (document.getElementById("x" + (pawn.position.x - i) + "_y" + (pawn.position.y)) != null) {
                    if (table[pawn.position.y - 1][pawn.position.x - 1 - i] != "") { if (table[pawn.position.y - 1][pawn.position.x - 1 - i].color != colorToCheck) { var ch = true; if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x - i, pawn.position.y); } if (ch == true) wherecanattack.push(document.getElementById("x" + (pawn.position.x - i) + "_y" + (pawn.position.y))); } break; }
                    var ch = true;
                    if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x - i, pawn.position.y); }
                    if (ch == true) wherecango.push(document.getElementById("x" + (pawn.position.x - i) + "_y" + (pawn.position.y)));
                }
            }
            for (var i = 1; i < 8; i++) {
                if (document.getElementById("x" + (pawn.position.x + i) + "_y" + (pawn.position.y + i)) != null) {
                    if (table[pawn.position.y - 1 + i][pawn.position.x - 1 + i] != "") { if (table[pawn.position.y - 1 + i][pawn.position.x - 1 + i].color != colorToCheck) { var ch = true; if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x + i, pawn.position.y + i); } if (ch == true) wherecanattack.push(document.getElementById("x" + (pawn.position.x + i) + "_y" + (pawn.position.y + i))); } break; }
                    var ch = true;
                    if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x + i, pawn.position.y + i); }
                    if (ch == true) wherecango.push(document.getElementById("x" + (pawn.position.x + i) + "_y" + (pawn.position.y + i)));
                }
            }
            for (var i = 1; i < 8; i++) {
                if (document.getElementById("x" + (pawn.position.x - i) + "_y" + (pawn.position.y - i)) != null) {
                    if (table[pawn.position.y - 1 - i][pawn.position.x - 1 - i] != "") { if (table[pawn.position.y - 1 - i][pawn.position.x - 1 - i].color != colorToCheck) { var ch = true; if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x - i, pawn.position.y - i); } if (ch == true) wherecanattack.push(document.getElementById("x" + (pawn.position.x - i) + "_y" + (pawn.position.y - i))); } break; }
                    var ch = true;
                    if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x - i, pawn.position.y - i); }
                    if (ch == true) wherecango.push(document.getElementById("x" + (pawn.position.x - i) + "_y" + (pawn.position.y - i)));
                }
            }
            for (var i = 1; i < 8; i++) {
                if (document.getElementById("x" + (pawn.position.x + i) + "_y" + (pawn.position.y - i)) != null) {
                    if (table[pawn.position.y - 1 - i][pawn.position.x - 1 + i] != "") { if (table[pawn.position.y - 1 - i][pawn.position.x - 1 + i].color != colorToCheck) { var ch = true; if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x + i, pawn.position.y - i); } if (ch == true) wherecanattack.push(document.getElementById("x" + (pawn.position.x + i) + "_y" + (pawn.position.y - i))); } break; }
                    var ch = true;
                    if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x + i, pawn.position.y - i); }
                    if (ch == true) wherecango.push(document.getElementById("x" + (pawn.position.x + i) + "_y" + (pawn.position.y - i)));
                }
            }
            for (var i = 1; i < 8; i++) {
                if (document.getElementById("x" + (pawn.position.x - i) + "_y" + (pawn.position.y + i)) != null) {
                    if (table[pawn.position.y - 1 + i][pawn.position.x - 1 - i] != "") { if (table[pawn.position.y - 1 + i][pawn.position.x - 1 - i].color != colorToCheck) { var ch = true; if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x - i, pawn.position.y + i); } if (ch == true) wherecanattack.push(document.getElementById("x" + (pawn.position.x - i) + "_y" + (pawn.position.y + i))); } break; }
                    var ch = true;
                    if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x - i, pawn.position.y + i); }
                    if (ch == true) wherecango.push(document.getElementById("x" + (pawn.position.x - i) + "_y" + (pawn.position.y + i)));
                }
            }
        } else if (pawn.type == "King") {
            if (document.getElementById("x" + (pawn.position.x) + "_y" + (pawn.position.y + 1)) != null) if (table[pawn.position.y - 1 + 1][pawn.position.x - 1] == "") { var ch = true; if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x, pawn.position.y + 1); } if (ch == true) wherecango.push(document.getElementById("x" + (pawn.position.x) + "_y" + (pawn.position.y + 1))); } else { if (table[pawn.position.y - 1 + 1][pawn.position.x - 1].color != colorToCheck) { var ch = true; if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x, pawn.position.y + 1); } if (ch == true) wherecanattack.push(document.getElementById("x" + (pawn.position.x) + "_y" + (pawn.position.y + 1))); } }
            if (document.getElementById("x" + (pawn.position.x - 1) + "_y" + (pawn.position.y + 1)) != null) if (table[pawn.position.y - 1 + 1][pawn.position.x - 1 - 1] == "") { var ch = true; if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x - 1, pawn.position.y + 1); } if (ch == true) wherecango.push(document.getElementById("x" + (pawn.position.x - 1) + "_y" + (pawn.position.y + 1))); } else { if (table[pawn.position.y - 1 + 1][pawn.position.x - 1 - 1].color != colorToCheck) { var ch = true; if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x - 1, pawn.position.y + 1); } if (ch == true) wherecanattack.push(document.getElementById("x" + (pawn.position.x - 1) + "_y" + (pawn.position.y + 1))); } }
            if (document.getElementById("x" + (pawn.position.x - 1) + "_y" + (pawn.position.y)) != null) if (table[pawn.position.y - 1][pawn.position.x - 1 - 1] == "") { var ch = true; if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x - 1, pawn.position.y); } if (ch == true) wherecango.push(document.getElementById("x" + (pawn.position.x - 1) + "_y" + (pawn.position.y))); } else { if (table[pawn.position.y - 1][pawn.position.x - 1 - 1].color != colorToCheck) { var ch = true; if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x - 1, pawn.position.y); } if (ch == true) wherecanattack.push(document.getElementById("x" + (pawn.position.x - 1) + "_y" + (pawn.position.y))); } }
            if (document.getElementById("x" + (pawn.position.x - 1) + "_y" + (pawn.position.y - 1)) != null) if (table[pawn.position.y - 1 - 1][pawn.position.x - 1 - 1] == "") { var ch = true; if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x - 1, pawn.position.y - 1); } if (ch == true) wherecango.push(document.getElementById("x" + (pawn.position.x - 1) + "_y" + (pawn.position.y - 1))); } else { if (table[pawn.position.y - 1 - 1][pawn.position.x - 1 - 1].color != colorToCheck) { var ch = true; if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x - 1, pawn.position.y - 1); } if (ch == true) wherecanattack.push(document.getElementById("x" + (pawn.position.x - 1) + "_y" + (pawn.position.y - 1))); } }
            if (document.getElementById("x" + (pawn.position.x) + "_y" + (pawn.position.y - 1)) != null) if (table[pawn.position.y - 1 - 1][pawn.position.x - 1] == "") { var ch = true; if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x, pawn.position.y - 1); } if (ch == true) wherecango.push(document.getElementById("x" + (pawn.position.x) + "_y" + (pawn.position.y - 1))); } else { if (table[pawn.position.y - 1 - 1][pawn.position.x - 1].color != colorToCheck) { var ch = true; if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x, pawn.position.y - 1); } if (ch == true) wherecanattack.push(document.getElementById("x" + (pawn.position.x) + "_y" + (pawn.position.y - 1))); } }
            if (document.getElementById("x" + (pawn.position.x + 1) + "_y" + (pawn.position.y - 1)) != null) if (table[pawn.position.y - 1 - 1][pawn.position.x - 1 + 1] == "") { var ch = true; if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x + 1, pawn.position.y - 1); } if (ch == true) wherecango.push(document.getElementById("x" + (pawn.position.x + 1) + "_y" + (pawn.position.y - 1))); } else { if (table[pawn.position.y - 1 - 1][pawn.position.x - 1 + 1].color != colorToCheck) { var ch = true; if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x + 1, pawn.position.y - 1); } if (ch == true) wherecanattack.push(document.getElementById("x" + (pawn.position.x + 1) + "_y" + (pawn.position.y - 1))); } }
            if (document.getElementById("x" + (pawn.position.x + 1) + "_y" + (pawn.position.y)) != null) if (table[pawn.position.y - 1][pawn.position.x - 1 + 1] == "") { var ch = true; if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x + 1, pawn.position.y); } if (ch == true) wherecango.push(document.getElementById("x" + (pawn.position.x + 1) + "_y" + (pawn.position.y))); } else { if (table[pawn.position.y - 1][pawn.position.x - 1 + 1].color != colorToCheck) { var ch = true; if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x + 1, pawn.position.y); } if (ch == true) wherecanattack.push(document.getElementById("x" + (pawn.position.x + 1) + "_y" + (pawn.position.y))); } }
            if (document.getElementById("x" + (pawn.position.x + 1) + "_y" + (pawn.position.y + 1)) != null) if (table[pawn.position.y - 1 + 1][pawn.position.x - 1 + 1] == "") { var ch = true; if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x + 1, pawn.position.y + 1); } if (ch == true) wherecango.push(document.getElementById("x" + (pawn.position.x + 1) + "_y" + (pawn.position.y + 1))); } else { if (table[pawn.position.y - 1 + 1][pawn.position.x - 1 + 1].color != colorToCheck) { var ch = true; if (checkMove == true) { ch = checkIfMoveIsPossible(pawn, pawn.position.x + 1, pawn.position.y + 1); } if (ch == true) wherecanattack.push(document.getElementById("x" + (pawn.position.x + 1) + "_y" + (pawn.position.y + 1))); } }
            if (pawn.firstMove == false) { // Castling
                if (document.getElementById("x" + (pawn.position.x - 4) + "_y" + (pawn.position.y)) != undefined) {
                    if (table[pawn.position.y - 1][pawn.position.x - 1 - 4] != "") {
                        if (table[pawn.position.y - 1][pawn.position.x - 1 - 4].firstMove == false && table[pawn.position.y - 1][pawn.position.x - 1 - 4].type == "Rook") {
                            if (table[pawn.position.y - 1][pawn.position.x - 1 - 1] == "" && table[pawn.position.y - 1][pawn.position.x - 1 - 2] == "" && table[pawn.position.y - 1][pawn.position.x - 1 - 3] == "") {
                                var ch = true;
                                if (checkMove == true) {
                                    ch = checkIfMoveIsPossible(pawn, pawn.position.x, pawn.position.y);
                                    if (ch == true) {
                                        ch = checkIfMoveIsPossible(pawn, pawn.position.x - 1, pawn.position.y);
                                        if (ch == true) {
                                            ch = checkIfMoveIsPossible(pawn, pawn.position.x - 2, pawn.position.y);
                                            if (ch == true) {
                                                ch = checkIfMoveIsPossible(pawn, pawn.position.x - 3, pawn.position.y);
                                            }
                                        }
                                    }
                                }
                                if (ch == true) {
                                    wherecancast.push(document.getElementById("x" + (pawn.position.x - 2) + "_y" + (pawn.position.y)));
                                }
                            }
                        }
                    }
                }
                if (document.getElementById("x" + (pawn.position.x + 3) + "_y" + (pawn.position.y)) != undefined) {
                    if (table[pawn.position.y - 1][pawn.position.x - 1 + 3] != "") {
                        if (table[pawn.position.y - 1][pawn.position.x - 1 + 3].firstMove == false && table[pawn.position.y - 1][pawn.position.x - 1 + 3].type == "Rook") {
                            if (table[pawn.position.y - 1][pawn.position.x - 1 + 1] == "" && table[pawn.position.y - 1][pawn.position.x - 1 + 2] == "") {
                                var ch = true;
                                if (checkMove == true) {
                                    ch = checkIfMoveIsPossible(pawn, pawn.position.x, pawn.position.y);
                                    if (ch == true) {
                                        ch = checkIfMoveIsPossible(pawn, pawn.position.x + 1, pawn.position.y);
                                        if (ch == true) {
                                            ch = checkIfMoveIsPossible(pawn, pawn.position.x + 2, pawn.position.y);
                                        }
                                    }
                                }
                                if (ch == true) {
                                    wherecancast.push(document.getElementById("x" + (pawn.position.x + 2) + "_y" + (pawn.position.y)));
                                }
                            }
                        }
                    }
                }
            }
        }

        var object = {
            pawn: pawn,
            table: table,
            wherecango: wherecango,
            wherecanattack: wherecanattack,
            wherecanenpassant: wherecanenpassant,
            wherecancast: wherecancast
        }
        return object;
    }

    function typeWhereToGo(pawn, check) {
        whereCanGo = [];
        whereCanAttack = [];
        whereCanEnPassant = [];
        whereCanCast = [];

        var ck = true;
        if (check == true) ck = false;

        clearColors();

        var object = CheckTable(pawn, localTable, whereCanGo, whereCanAttack, whereCanEnPassant, whereCanCast, chosenColor, ck);

        localTable = object.table;
        whereCanGo = object.wherecango;
        whereCanAttack = object.wherecanattack;
        whereCanEnPassant = object.wherecanenpassant;
        whereCanCast = object.wherecancast;

        if (pawn.color == chosenColor) {
            howManyTurns += whereCanGo.length + whereCanAttack.length + whereCanEnPassant.length + whereCanCast.length;
        }
        var queenOrKingSide = "";
        if (check == undefined) {
            for (var i = 0; i < whereCanGo.length; i++) {
                whereCanGo[i].style.backgroundColor = "lightgreen";
                var x = parseInt(whereCanGo[i].id[1])-1;
                var y = parseInt(whereCanGo[i].id[4])-1;
                main.changeColorOfPlace(x, y, "green"); 
            }
            for (var i = 0; i < whereCanAttack.length; i++) {
                whereCanAttack[i].style.backgroundColor = "red";
                var x = parseInt(whereCanAttack[i].id[1]) - 1;
                var y = parseInt(whereCanAttack[i].id[4]) - 1;
                main.changeColorOfPlace(x, y, "red");
            }
            for (var i = 0; i < whereCanEnPassant.length; i++) {
                whereCanEnPassant[i].style.backgroundColor = "purple";
                var x = parseInt(whereCanEnPassant[i].id[1]) - 1;
                var y = parseInt(whereCanEnPassant[i].id[4]) - 1;
                main.changeColorOfPlace(x, y, "purple");
            }
            for (var i = 0; i < whereCanCast.length; i++) { 
                whereCanCast[i].style.backgroundColor = "purple";
                var x = parseInt(whereCanCast[i].id[1]) - 1;
                var y = parseInt(whereCanCast[i].id[4]) - 1;
                main.changeColorOfPlace(x, y, "purple");

                if (x > 4) {
                    localTable[y][x - 2].queenSideCastlePossible = true;
                    queenOrKingSide = "queen";
                } else {
                    localTable[y][x + 2].kingSideCastlePossible = true;
                    queenOrKingSide = "king";
                }
            }
        } else if (check == true) {
            for (var i = 0; i < whereCanAttack.length; i++) {
                var x = parseInt(whereCanAttack[i].id[1]);
                var y = parseInt(whereCanAttack[i].id[4]);
                if (pawn.color != localTable[y - 1][x - 1].color && localTable[y - 1][x - 1].type == "King") {
                    kingCheck = true;
                    kingColorCheck = localTable[y - 1][x - 1].color;
                }
            }
        }
        
        if (pawn.type == "King") {
            if (whereCanCast.length == 2) queenOrKingSide = "both";
            if (queenOrKingSide == "queen") {
                localTable[pawn.position.y - 1][pawn.position.x - 1].kingSideCastlePossible = false;
            } else if (queenOrKingSide == "king") {
                localTable[pawn.position.y - 1][pawn.position.x - 1].queenSideCastlePossible = false;
            } else if (queenOrKingSide == "") {
                localTable[pawn.position.y - 1][pawn.position.x - 1].kingSideCastlePossible = false;
                localTable[pawn.position.y - 1][pawn.position.x - 1].queenSideCastlePossible = false;
            }
        }
    }

    function checkIfMoveIsPossible(pawn, xDes, yDes) {
        var tempLocalTable = [[], [], [], [], [], [], [], []];

        for (var i = 0; i < localTable.length; i++) {
            for (var j = 0; j < localTable[0].length; j++) {
                tempLocalTable[i][j] = localTable[i][j];
            }
        }

        var tempKingCheck = false;
        var tempPawn = {
            id: pawn.id,
            position: {
                x: pawn.position.x,
                y: pawn.position.y,
            },
            type: pawn.type,
            color: pawn.color,
            gameId: pawn.gameId,
            firstMove: pawn.firstMove,
            enPassant: pawn.enPassant,
        }

        tempLocalTable[tempPawn.position.y - 1][tempPawn.position.x - 1] = "";
        tempPawn.position.x = xDes;
        tempPawn.position.y = yDes;
        tempLocalTable[yDes - 1][xDes - 1] = tempPawn;

        for (var k = 0; k < tempLocalTable.length; k++) {
            for (var l = 0; l < tempLocalTable[0].length; l++) {
                if (tempLocalTable[k][l] != "") {
                    var tempWhereCanGo = [];
                    var tempWhereCanAttack = [];
                    var tempWhereCanEnPassant = [];
                    var tempWhereCanCast = [];

                    var colorek;

                    if (chosenColor == "black") colorek = "white"; else colorek = "black";

                    var object = CheckTable(tempLocalTable[k][l], tempLocalTable, tempWhereCanGo, tempWhereCanAttack, tempWhereCanAttack, tempWhereCanCast, colorek, false);
                    tempLocalTable = object.table;
                    tempWhereCanGo = object.wherecango;
                    tempWhereCanAttack = object.wherecanattack;
                    tempWhereCanEnPassant = object.wherecanenpassant;
                    tempWhereCanCast = object.wherecancast;

                    for (var i = 0; i < tempWhereCanAttack.length; i++) {
                        var x = parseInt(tempWhereCanAttack[i].id[1]);
                        var y = parseInt(tempWhereCanAttack[i].id[4]);

                        if (tempLocalTable[k][l].color != tempLocalTable[y - 1][x - 1].color && tempLocalTable[y - 1][x - 1].type == "King") {
                            tempKingCheck = true;
                        }
                    }
                }
            }
        }
        if (tempKingCheck == false) return true;
        else return false;
    }

    function checkIfCheck() {
        if (gameEnabled == true) {
            kingCheck = false;
            game.isFinishedGame = false;
            for (var k = 0; k < 2; k++) {
                if (chosenColor == "white") chosenColor = "black"; else chosenColor = "white";
                for (var i = 0; i < localTable.length; i++) {
                    for (var j = 0; j < localTable[0].length; j++) {
                        if (localTable[i][j] != "") {
                            typeWhereToGo(localTable[i][j], true);
                        }
                    }
                }
            }
            if (kingCheck == true) {
                var string = (kingColorCheck == "white") ? "Białe" : "Czarne";
                document.getElementById("check").innerHTML = "SZACH! " + string + " zagrożone.";
                net.window.danger();

                if (checkIfMateOrStalemate() == true) {
                    game.timer.stopTimer();
                    document.getElementById("check").innerHTML = "SZACH-MAT! ";
                    game.isFinishedGame = "checkmate";
                    document.getElementById("check").innerHTML += (kingColorCheck == "white") ?
                                                                    "Czarne wygrywają!" : "Białe wygrywają!";
                    var statistics = main.getStatistics();

                    if (kingColorCheck == "white") {
                        if (yourColor == "white") {
                            statistics.losses++;
                            statistics.points -= 25;
                            net.window.checkMate();
                        } else {
                            statistics.wins++;
                            statistics.points += 50;
                            net.window.win();
                        }
                        if (chessNotationCont != null) {
                            chessNotationCont.updateTable(["0-1"]);
                        }
                    } else if (kingColorCheck == "black") {
                        if (yourColor == "white") {
                            statistics.wins++;
                            statistics.points += 50;
                            net.window.win();
                        } else {
                            statistics.losses++;
                            statistics.points -= 25;
                            net.window.checkMate();
                        }
                        if (chessNotationCont != null) {
                            chessNotationCont.updateTable(["1-0"]);
                        }
                    }

                    main.setStatistics(statistics.wins, statistics.draws, statistics.losses, statistics.points);
                    net.setStatisticsForUser(main.getNick(), statistics.wins, statistics.draws, statistics.losses, statistics.points);

                    gameEnabled = false;
                    net.window.showWindow("Koniec gry");
                }

            } else {
                document.getElementById("check").innerHTML = "Twój król nie jest zagrożony.";
                net.window.safe();

                // A tutaj może być jeszcze pat

                if (checkIfMateOrStalemate() == true) {
                    game.timer.stopTimer();
                    game.isFinishedGame = "stalemate";
                    document.getElementById("check").innerHTML = "PAT! Nikt dzisiaj nie wygrał.";
                    net.window.stalemate();

                    var statistics = main.getStatistics();
                    statistics.draws++;
                    statistics.points += 25;

                    if (chessNotationCont != null) {
                        chessNotationCont.updateTable(["½-½"]);
                    }

                    main.setStatistics(statistics.wins, statistics.draws, statistics.losses, statistics.points);
                    net.setStatisticsForUser(main.getNick(), statistics.wins, statistics.draws, statistics.losses, statistics.points);

                    net.window.showWindow("Koniec gry");
                    gameEnabled = false;
                }
            }
        }
    }

    function checkIfMateOrStalemate () {
        howManyTurns = 0;
        for (var i = 0; i < localTable.length; i++) {
            for (var j = 0; j < localTable[0].length; j++) {
                if (localTable[i][j] != undefined && localTable[i][j] != "") {
                    typeWhereToGo(localTable[i][j], false);
                }
            }
        }
        // console.log(howManyTurns);

        if (howManyTurns == 0) return true;
        else return false;
    }

    this.playAIGame = (params) => {
        ai_playing = true;

        game.setGameId("with_computer");
        game.setYourColor(params.color);
        game.turnTheGameOn();
        main.createFigures();
        $("#bariera").css("display", "none");
        $("#checkChecker").css("display", "initial");
        var string;
        game.depth = params.difficulty;
        
        let white = params.color == "white" ? main.getNick() : "Komputer poz."+params.difficulty;
        let black = params.color != "white" ? main.getNick() : "Komputer poz."+params.difficulty;
        chessNotationCont = new ChessNotationContainer(white, black);
        game.surrenderGameModal = new SurrenderGameModal();
        if (yourColor == "white") {
            string = "białymi.<br/>Twój ruch.";
            net.window.safe();
            main.setCameraPosition(-600, 600, 0);
            var intervalToRemove = setInterval(() => {
                if (game.loadingFigures >= 32) {
                    this.timer = new Timer(params.timer, true);
                    clearInterval(intervalToRemove);
                }
            }, 500);
        }
        if (yourColor == "black") {
            string = "czarnymi.<br/>Ruch przeciwnika.";
            main.setCameraPosition(600, 600, 0);
            net.window.safe();
            var intervalToRemove = setInterval(() => {
                if (game.loadingFigures >= 32) {
                    this.timer = new Timer(params.timer, false);
                    net.sendDataToAI(game.depth, localTable);
                    clearInterval(intervalToRemove);
                }
            }, 500);
        }
        net.window.onlyHalfly();
        net.window.showWindow("Grasz "+string);
        $("#checkText").html($("#check").html());
    }

    function init() {
        localTable = [
            ["Ww", "Hw", "Gw", "Qw", "Kw", "Gw", "Hw", "Ww"],
            ["Pw", "Pw", "Pw", "Pw", "Pw", "Pw", "Pw", "Pw"],
            ["", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", ""],
            ["Pb", "Pb", "Pb", "Pb", "Pb", "Pb", "Pb", "Pb"],
            ["Wb", "Hb", "Gb", "Qb", "Kb", "Gb", "Hb", "Wb"]
        ];

        for (var i = 0; i < localTable.length; i++) {
            for (var j = 0; j < localTable[0].length; j++) {
                var pawn;
                if (localTable[i][j] != "") {
                    switch (localTable[i][j][0]) {
                        case 'W':
                            pawn = new Pawn(idCount, { x: j + 1, y: i + 1 }, "Rook", localTable[i][j][1], gameId);
                            break;
                        case 'H':
                            pawn = new Pawn(idCount, { x: j + 1, y: i + 1 }, "Knight", localTable[i][j][1], gameId);
                            break;
                        case 'G':
                            pawn = new Pawn(idCount, { x: j + 1, y: i + 1 }, "Bishop", localTable[i][j][1], gameId);
                            break;
                        case 'Q':
                            pawn = new Pawn(idCount, { x: j + 1, y: i + 1 }, "Queen", localTable[i][j][1], gameId);
                            break;
                        case 'K':
                            pawn = new Pawn(idCount, { x: j + 1, y: i + 1 }, "King", localTable[i][j][1], gameId);
                            break;
                        case 'P':
                            pawn = new Pawn(idCount, { x: j + 1, y: i + 1 }, "Pawn", localTable[i][j][1], gameId);
                            break;
                    }
                    localTable[i][j] = pawn.get();
                    idCount++;
                }
            }
        }
        createTable();
        readTable();
    }
    init();
}