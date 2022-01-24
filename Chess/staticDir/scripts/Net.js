function Net() {
    var client = io();
    var window = new Window();
    this.window = window;
    this.callback;

    init = () => {
        client.on("read", function (data) {
            var check = false;
            for (var i = 0; i < data.data.length; i++) {
                if (data.data[i].login == "admin") {
                    check = true;
                }
            }
            if (!check) {
                net.register("admin", "admin");
            }
        })
        client.on("getForRegister", function (data) {
            var check = false;
            if (data != undefined) {
                for (var i = 0; i < data.data.length; i++) {
                    if (data.data[i].login == document.getElementById("user_reg").value) {
                        check = true;
                    }
                }
                if (check == true) {
                    net.window.danger();
                    window.showWindow("Taki użytkownik już istnieje!");
                } else {
                    net.register(document.getElementById("user_reg").value, document.getElementById("pass_reg").value);
                }
            }
        })
        client.on("register", function (data) {
            if (data != undefined) {
                window.showWindow(data.user + " " + data.status);
            }
        })
        client.on("login", function (data) {
            if (data.status == "userAlreadyLogged") {
                net.window.danger();
                window.showWindow("Taki użytkownik jest właśnie zalogowany");
            }
            else if (data.status == "badPassword") {
                net.window.danger();
                window.showWindow("Nieprawidłowe hasło.");
            }
            else if (data.status == "userNonExistent") {
                net.window.danger();
                window.showWindow("Taki użytkownik nie istnieje.");
            }
            else if (data.user.length > 0) {
                net.window.danger();
                window.showWindow("Zalogowano.");
                main.zalogowano(data.user[0].login);
                main.setStatistics(data.ranking[0].wins, data.ranking[0].draws, data.ranking[0].losses, data.ranking[0].points);
                const menuBar = new MenuBar();
                document.body.appendChild(menuBar.getComponent());
                menuBar.hide();
                game.ranking.getComponent().remove();
                const ranking = new Ranking(data.allRanking);
                const historicalGames = new HistoricalGames(data.historicalGames);
                let statistics = main.getStatistics();
                const profile = new Profile([
                    "Nick: " + main.getNick(),
                    "Wygranych: " + statistics.wins,
                    "Remisów: " + statistics.draws,
                    "Przegranych: " + statistics.losses,
                    "Punktów: " + statistics.points,
                ]);
                menuBar.pushMenuOption(ranking);
                menuBar.pushMenuOption(historicalGames);
                menuBar.pushMenuOption(profile);

                ranking.hide();
                historicalGames.hide();
                profile.hide();

                game.ranking = ranking;
                game.historicalGames = historicalGames;
                game.profile = profile;

            } else {
                window.showWindow("Niezidentyfikowany problem. Skontaktuj się z administratorem");
            }
        })
        client.on("searchForGames", function (data) {
            if (data.data.length <= 0) { // Stwórz własną wolną grę
                net.addFreeGame(main.getNick(), data.timer);
            } else { // Dołącz do pierwszej wolnej gry
                net.joinGame(main.getNick(), data.timer);
            }
        })
        client.on("joinGame", function (data) {
            game.setGameId(data.gameId);
            game.setYourColor(data.yourColor);
            game.turnTheGameOn();
            main.createFigures();
            document.getElementById("bariera").style.display = "none";
            document.getElementById("checkChecker").style.display = "initial";
            var string;
            if (data.yourColor == "white") { string = "białymi.<br/>Twój ruch."; main.setCameraPosition(-600, 600, 0); }
            if (data.yourColor == "black") { string = "czarnymi.<br/>Ruch przeciwnika."; main.setCameraPosition(600, 600, 0); }
            window.onlyHalfly();
            window.showWindow("Grasz "+string);
            document.getElementById("checkText").innerHTML = document.getElementById("check").innerHTML;

            chessNotationCont = new ChessNotationContainer(data.whitePlayer, data.blackPlayer);
            game.surrenderGameModal = new SurrenderGameModal();
            game.stalematePreposition = new StalematePreposition();

            var chat = new Chat();
            main.chat = chat;
            client.on("getMessageByChat", chat.getMessage);

            var intervalToRemove = setInterval(() => {
                if (game.loadingFigures >= 32) {
                    game.timer = new Timer(game.timerParam, data.yourColor == "white" ? true : false);
                    clearInterval(intervalToRemove);
                }
            }, 500);
        })
        client.on("turn", function (data) {
            game.opponentMove(data.pawn, data.xDes, data.yDes, data.enPassant, data.casting);
            if (chessNotationCont != null) {
                chessNotationCont.updateTable([data.entry]);
            }
            if (game.isGameEnabled() == true) {
                var string = (game.getYourColor() == "white")
                                                            ? "białymi.<br/>Twój ruch."
                                                            : "czarnymi.<br/>Twój ruch.";
                window.showWindow("Grasz " + string);
            }
            document.getElementById("checkText").innerHTML = document.getElementById("check").innerHTML;
        })
        client.on("getAllDiffLevels", (data) => {
            if (this.callback) {
                this.callback(data);
            }
        })
        client.on("notationBack", (data) => {
            if (chessNotationCont != null) {
                chessNotationCont.updateTable([data]);
            }
        })
        client.on("surrender", (data) => {
            if (game.getGameId() == data.gameId) {
                game.timer.stopTimer();

                var statistics = main.getStatistics();
                statistics.wins++;
                statistics.points += 50;

                main.setStatistics(statistics.wins, statistics.draws, statistics.losses, statistics.points);
                net.setStatisticsForUser(main.getNick(), statistics.wins, statistics.draws, statistics.losses, statistics.points);

                game.turnTheGameOff();
                net.window.showWindow("Koniec gry");

                document.getElementById("checkText").innerHTML = "Przeciwnik poddał się! ";
                document.getElementById("checkText").innerHTML += (game.getYourColor() == "white") ? "Białe wygrywają!" : "Czarne wygrywają!";
                net.window.win();

            }
        })

        client.on("sendStalematePreposition", (data) => {
            game.stalematePreposition.gotPrepositionOfStalemate(data.nick);
        })

        client.on("sendStalematePrepositionBack", (data) => {
            console.log(data.accepted);
            if (data.accepted == true) {
                game.stalematePreposition.acceptedPreposition();
            } else {
                game.stalematePreposition.declinedPreposition();
            }
        })

        client.on("getTopRanking", (data) => {
            const ranking = new Ranking(data.allRanking);
            game.ranking = ranking;

            document.body.appendChild(ranking.getComponent());
            ranking.getComponent().style.top = "initial";
            ranking.getComponent().style.bottom = "0";
            ranking.getComponent().style.borderBottomLeftRadius = "0";
            ranking.getComponent().style.borderBottomRightRadius = "0";
            ranking.getComponent().style.borderTopLeftRadius = "15px";
            ranking.getComponent().style.borderTopRightRadius = "15px";
        })
    }

    init();

    this.getForRegister = function () {
        client.emit("getForRegister", {})
    }

    this.register = function (user, pass) {
        client.emit("register", {
            login: user,
            password: pass,
        })
    }

    this.login = function (user, pass) {
        client.emit("login", {
            login: user,
            password: pass,
        })
    }

    this.searchForGames = function (timer) {
        client.emit("searchForGames", { timer: timer });
    }

    this.addFreeGame = function (login, timer) {
        client.emit("addFreeGame", {
            login: login,
            timer: timer
        });
    }

    this.joinGame = function (login, timer) {
        client.emit("joinGame", {
            login: login,
            timer: timer,
            currentBoardState: game.getLocalTable()
        });
    }

    this.sendDataToAI = function (depth, localTable) {
        var obj = {
            depth: depth,
            computer: (game.getYourColor() == "white") ? "black" : "white",
            localTable: localTable
        };
        game.timer.stopTimer();
        client.emit("sendDataToAI", obj)
    }

    this.turn = function ({ pawn, fromX, fromY, xDes, yDes, hitPawn, enPassant, casting, color, gmid, localTable, depth, previousLocalTable, isFinishedGame }) {
        client.emit("turn", {
            pawn: pawn,
            from: {
                x: fromX,
                y: fromY
            },
            xDes: xDes,
            yDes: yDes,
            hitPawn: hitPawn,
            enPassant: enPassant,
            casting: casting,
            color: color,
            gameId: gmid,
            previousLocalTable: previousLocalTable,
            localTable: localTable,
            computer: (game.getYourColor() == "white") ? "black" : "white",
            depth: depth,
            ai_playing: game.ai_playing,
            time_of_turn: new Date(),
            timeLeft: game.timer.yourTimeShownLeft,
            isFinishedGame: isFinishedGame
        });
    }

    this.setStatisticsForUser = function (user, wins, draws, losses, points) {
        client.emit("setStatisticsForUser", {
            user: user,
            wins: wins,
            draws: draws,
            losses: losses,
            points: points,
        });
    }

    this.sendMessage = function (message, nick) {
        client.emit("sendMessageByChat", {
            message: message,
            nick: nick,
            color: game.getYourColor(),
            gameId: game.getGameId()
        })
    }

    this.getAllDiffLevels = (callback) => {
        client.emit("getAllDiffLevels", {});
        this.callback = callback;
    }

    this.surrender = () => {
        client.emit("surrender", {
            nick: main.getNick(),
            gameId: game.getGameId()
        });
    }

    this.sendStalematePreposition = () => {
        client.emit("sendStalematePreposition", {
            nick: main.getNick(),
            gameId: game.getGameId()
        });
    }

    this.acceptStalematePreposition = () => {
        client.emit("sendStalematePrepositionBack", {
            nick: main.getNick(),
            gameId: game.getGameId(),
            accepted: true
        });
    }

    this.declineStalematePreposition = () => {
        client.emit("sendStalematePrepositionBack", {
            nick: main.getNick(),
            gameId: game.getGameId(),
            accepted: false
        });
    }

    this.getTopRanking = () => {
        client.emit("getTopRanking", {});
    }

    this.changePassword = (newPassword) => {
        client.emit("changePassword", {
            nick: main.getNick(),
            newPassword: newPassword
        });
    }
}