class GameModeInit {
    containerElement;
    options = {
        versus: "none",
        difficulty: 0,
        color: "none",
        timer: 0
    };
    mixed = 0;
    timerSet = false;
    screenNumber = 1;
    numberOfScreens = 4;
    difficultyLevels = [];

    constructor () {
        this.containerElement = $("<div>").addClass("choose_game_mode display_none");
        $("body").append(this.containerElement);
        
        net.getAllDiffLevels((diffLevels) => {
            this.difficultyLevels = diffLevels;
        });

        this.chooseScreen(1);
    }

    chooseScreen(number) {
        this.containerElement.html("");
        let screens;
        if (this.numberOfScreens == 4) {
            screens = [ 0,
                this.screen1.bind(this),
                this.screen2.bind(this),
                this.screen3.bind(this),
                this.screen4.bind(this)
            ];
        } else if (this.numberOfScreens == 2) {
            screens = [ 0,
                this.screen1.bind(this),
                this.screen4.bind(this)
            ];
        }

        this.screenNumber = number;
        screens[number]();
    }

    screen1 () {
        let header = $("<div>").html("Graj przeciwko:")
                    .addClass("choose_game_mode_header");
        this.gameModeButtons = this.gameModeButtonsInit();
        this.nextButton = this.createNextButton();

        this.containerElement.append(header);
        this.containerElement.append(this.gameModeButtons);
        this.containerElement.append(this.nextButton);
    }

    screen2 () {
        let header = $("<div>").html("Wybierz poziom trudności:")
                    .addClass("choose_game_mode_header");
        this.diffLevelsContainer = this.difficultyLevelsInit(this.difficultyLevels);
        let containerForButtons = $("<div>").addClass("containerForButtons");
        this.backButton = this.createBackButton();
        this.nextButton = this.createNextButton();
        containerForButtons.append(this.backButton);
        containerForButtons.append(this.nextButton);

        this.containerElement.append(header);
        this.containerElement.append(this.diffLevelsContainer);
        this.containerElement.append(containerForButtons);
    }

    screen3 () {
        let header = $("<div>")
                    .addClass("choose_game_mode_header")
                    .html("Wybierz kolor:");

        this.colorsContainer = this.chooseYourColorInit();
        let containerForButtons = $("<div>").addClass("containerForButtons");
        this.backButton = this.createBackButton();
        this.nextButton = this.createNextButton();
        containerForButtons.append(this.backButton);
        containerForButtons.append(this.nextButton);

        this.containerElement.append(header);
        this.containerElement.append(this.colorsContainer);
        this.containerElement.append(containerForButtons);
    }

    screen4 () {
        let header = $("<div>")
                    .addClass("choose_game_mode_header")
                    .html("Wybierz czas zegara (dla 1 gracza):");
        
        let containerForButtons = $("<div>").addClass("containerForButtons");

        let containerForTimerSetters = this.createContainerForTimerSetters();

        this.backButton = this.createBackButton();
        this.nextButton = this.createNextButton();
        containerForButtons.append(this.backButton);
        containerForButtons.append(this.nextButton);

        this.containerElement.append(header);
        this.containerElement.append(containerForTimerSetters);
        this.containerElement.append(containerForButtons);
    }

    gameModeButtonsInit () {
        this.gameModeButtons = $("<div>").addClass("choose_game_mode_buttons");

        let vs_player = this.gameModeButton("vs_player", "gfx/icons/profle.png", "Gracz");
        let vs_computer = this.gameModeButton("vs_computer", "gfx/icons/computer.png", "Komputer");

        vs_player.on("click", () => {
            vs_computer.removeClass("clicked");
            vs_player.addClass("clicked");
            this.options.versus = "player";
            this.numberOfScreens = 2;
        })

        vs_computer.on("click", () => {
            vs_player.removeClass("clicked");
            vs_computer.addClass("clicked");
            this.options.versus = "computer";
            this.numberOfScreens = 4;
        })

        this.gameModeButtons.append(vs_player);
        this.gameModeButtons.append(vs_computer);

        return this.gameModeButtons;
    }

    gameModeButton (className, gfxPath, text) {
        let divButton = $("<div>").addClass(className);
        var imageContainer = $("<div>").append($("<img>")
                                                    .attr("src", gfxPath)
                                                    .attr("alt", text)
                                                );
        divButton.append(imageContainer);
        divButton.append($("<span>").html(text));

        return divButton;
    }
    
    difficultyLevelsInit (diffLevels) {
        let diffLevelsContainer = $("<div>").addClass("choose_your_difficulty");
        
        diffLevels.forEach(level => {
            let levelContainer = $("<div>").addClass(level.class);

            levelContainer.on("click", (e) => {
                $(".choose_your_difficulty > div").removeClass("filled");
    
                var arr = Array.prototype.slice.call( e.target.parentElement.children )
                let difficulty = arr.indexOf(e.target) + 1;
                this.options.difficulty = difficulty;
    
                for (let i = 0; i < arr.length; i++) {
                    let arrElement = arr[i];
                    $(arrElement).addClass("filled");
                    if (arrElement == e.target) break;
                }
            })

            diffLevelsContainer.append(levelContainer);
        });

        return diffLevelsContainer;
    }

    chooseYourColorInit () {
        let container = $("<div>").addClass("choose_your_color");
        let whiteButton = this.yourColorButton("white", "White color").on("click", (e) => {
            $(".choose_your_color > div").removeClass("clicked");
            whiteButton.addClass("clicked");
            this.options.color = "white";
            this.mixed = 0;
        });

        let randomButton = this.yourColorButton("mixed", "Random color").on("click", (e) => {
            $(".choose_your_color > div").removeClass("clicked");
            randomButton.addClass("clicked");
            this.options.color = Math.floor(Math.random() * 2) == 0 ? "black" : "white";
            this.mixed = 1;
        });

        let blackButton = this.yourColorButton("black", "Black color").on("click", (e) => {
            $(".choose_your_color > div").removeClass("clicked");
            blackButton.addClass("clicked");
            this.options.color = "black";
            this.mixed = 0;
        });

        container.append(whiteButton);
        container.append(randomButton);
        container.append(blackButton);
        return container;
    }

    yourColorButton (colorName, altText) {
        let div = $("<div>").addClass(colorName);
        let img = $("<img>").attr("src", `gfx/icons/${colorName}.png`)
                            .attr("alt", altText);
        div.append(img);

        return div;
    }

    createBackButton () {
        let backButton = $("<div>").addClass("finalButton").html("< Wróć")
        .on("click", () => {
            this.chooseScreen(this.screenNumber-1);
            this.checkIfAlreadyFilled();
        });

        return backButton;
    }

    createNextButton () {
        let nextButton = $("<div>").addClass("finalButton")
        .on("click", () => {
            if (this.screenNumber == this.numberOfScreens) {
                if (this.options.versus == "player") {
                    $("#szukajGracza").css("display", "none");
                    $("#close").css("display", "none");
                    this.hide();
                    game.timerParam = this.options.timer;
                    net.window.showWindow("Czekaj na gracza...");
                    net.searchForGames(this.options.timer);
                } else if (this.options.versus == "computer") {
                    if (this.options.difficulty != 0) {
                        if (this.options.color != "none") {
                            this.hide();
                            game.ai_playing = true;
                            game.playAIGame(this.options);
                            $("#close").css("display", "none");
                        } else {
                            net.window.showWindow("Wybierz kolor swoich pionków!");
                        }
                    }
                }
            } else {
                let validatedAndWell = true;
                if (this.screenNumber == 1) {
                    if (this.options.versus != "player" && this.options.versus != "computer") {
                        net.window.showWindow("Wybierz opcję przeciwko komu grasz!");
                        validatedAndWell = false;
                    }
                } else if (this.screenNumber == 2) {
                    if (this.options.difficulty == 0) {
                        net.window.showWindow("Wybierz poziom trudności z graczem AI!");
                        validatedAndWell = false;
                    }
                }

                if (validatedAndWell == true) {
                    this.chooseScreen(this.screenNumber+1);
                    this.checkIfAlreadyFilled();
                }
            }
        });

        if (this.screenNumber == this.numberOfScreens) {
            nextButton.html("Graj!");
        } else {
            nextButton.html("Dalej >");
        }

        return nextButton;
    }

    checkIfAlreadyFilled () {
        if (this.screenNumber == 1) {
            if (this.options.versus == "computer") {
                $(".vs_computer").click();
            } else if (this.options.versus == "player") {
                $(".vs_player").click();
            }
        } else if (this.screenNumber == 2) {
            if (this.options.difficulty != 0) {
                $(`.choose_your_difficulty > div:nth-child(${this.options.difficulty})`).click();
            }
            if (this.numberOfScreens == 2) {
                if (this.timerSet == true) {
                    $(".timerSetterContainer[time="+this.options.timer+"]").click();
                }
            }
        } else if (this.screenNumber == 3) {
            if (this.mixed == 0) {
                if (this.options.color == "white") {
                    $(".choose_your_color > .white").click();
                } else if (this.options.color == "black") {
                    $(".choose_your_color > .black").click();
                }
            } else if (this.mixed == 1) {
                $(".choose_your_color > .mixed").click();
            }
        } else if (this.screenNumber == 4) {
            if (this.timerSet == true) {
                $(".timerSetterContainer[time="+this.options.timer+"]").click();
            }
        }
    }

    createContainerForTimerSetters () {
        let containerForTimerSetters = $("<div>").addClass("containerForTimerSetters");

        let times = [10, 20, 30, 0];

        times.forEach(time => {
            let timerSetter = this.createTimerSetter(time);
            timerSetter.attr("time", ""+time);

            timerSetter.on("click", () => {
                this.options.timer = time;
                $(".timerSetterContainer").removeClass("timerSetterContainerWhitened");
                timerSetter.addClass("timerSetterContainerWhitened");
                this.timerSet = true;
            })

            containerForTimerSetters.append(timerSetter);
        });

        return containerForTimerSetters;
    }

    createTimerSetter(time) {
        let timerSetter = $("<div>").addClass("timerSetterContainer")
        if (time > 10) {
            timerSetter.css("padding-left", "1.2vw");
        }
        
        let timeStr = `${time}:00`;
        if (time > 0) {
            for (let i = 0; i < timeStr.length; i++) {
                let digit = timeStr[i] == ":" ? "colon" : timeStr[i];
                let img = $("<img>").attr("src", `gfx/digits/${digit}.png`)
                        .attr("alt", digit)
                        .addClass("timerDigit");
                if (digit == "colon") {
                    img.css("width", "6px");
                }
                timerSetter.append(img);
            }
        } else {
            let text = $("<span>").html("Brak zegara").addClass("timerDigit");

            timerSetter.append(text);
        }

        return timerSetter;
    }

    show () {
        this.containerElement.removeClass("display_none");
    }
    
    hide () {
        this.containerElement.addClass("display_none");
    }
}