class SurrenderGameModal {
    clicked = false;

    constructor (white, black) {
        this.surrenderModal = this.createComponent();
        this.button = this.createButtonIcon();

        this.button.onmouseover = () => {
            this.button.setAttribute("src", "/gfx/icons/white_flag.png");
        }

        this.button.onmouseleave = () => {
            if (this.clicked == false) {
                this.button.setAttribute("src", "/gfx/icons/flag.png");
            }
        }

        this.button.onclick = () => {
            this.flag ? this.hide() : this.show();
            this.flag = !this.flag;
        }

        this.flag = false;

        document.body.appendChild(this.button);
        document.body.appendChild(this.surrenderModal);
    }

    show () {
        if (game.timer.stopped == false && game.isGameEnabled() != false) {
            this.surrenderModal.style.display = "block";
            this.surrenderModal.style.opacity = "1";
            this.button.setAttribute("src", "/gfx/icons/white_flag.png");
            this.button.style.zIndex = "1201";
            this.clicked = true;
        }
    }

    hide () {
        this.surrenderModal.style.display = "none";
        this.surrenderModal.style.opacity = "0";
        this.button.setAttribute("src", "/gfx/icons/flag.png");
        this.button.style.zIndex = "1199";
        this.clicked = false;
    }

    createComponent () {
        let surrenderModal = document.createElement("div");
        surrenderModal.style.opacity = "0";
        surrenderModal.classList.add("surrender-modal");

        let internalContainer = document.createElement("div");
        internalContainer.classList.add("internal-container");
        surrenderModal.appendChild(internalContainer);

        let surrender_yes = document.createElement("div");
        surrender_yes.classList.add("surrender-yes");
        surrender_yes.innerHTML = "Poddaj się";
        let flag = document.createElement("img");
        flag.setAttribute("src", "/gfx/icons/white_flag_background.png");
        flag.style.width = "30px";
        flag.style.height = "30px";
        surrender_yes.appendChild(flag);
        let surrender_no = document.createElement("div");
        surrender_no.classList.add("surrender-no");
        surrender_no.innerHTML = "Wróć do gry";
        internalContainer.appendChild(surrender_yes);
        internalContainer.appendChild(surrender_no);

        surrender_yes.onclick = () => {
            game.timer.stopTimer();

            var statistics = main.getStatistics();

            statistics.losses++;
            statistics.points -= 25;

            main.setStatistics(statistics.wins, statistics.draws, statistics.losses, statistics.points);
            net.setStatisticsForUser(main.getNick(), statistics.wins, statistics.draws, statistics.losses, statistics.points);

            game.turnTheGameOff();
            net.window.showWindow("Koniec gry");

            document.getElementById("checkText").innerHTML = "Poddałeś się! ";
            document.getElementById("checkText").innerHTML += (game.getYourColor() == "white") ? "Czarne wygrywają!" : "Białe wygrywają!";
            net.window.surrender();

            if (game.ai_playing == false) {
                net.surrender();
            }
            this.hide();
        }

        surrender_no.onclick = () => {
            this.hide();
        }

        return surrenderModal;
    }

    createButtonIcon () {
        let button = document.createElement("img");
        button.classList.add("surrender-button");
        button.setAttribute("src", "/gfx/icons/flag.png");

        return button;
    }

    getComponent () {
        return this.surrenderModal;
    }
}