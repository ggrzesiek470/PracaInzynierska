class StalematePreposition {
    clicked = false;
    sentPrepositionAlready = false;

    constructor () {
        this.stalematePreposition = this.createComponent();
        this.button = this.createButtonIcon();

        this.button.onmouseover = () => {
            this.button.setAttribute("src", "/gfx/icons/draw.png");
        }

        this.button.onmouseleave = () => {
            if (this.clicked == false) {
                this.button.setAttribute("src", "/gfx/icons/draw_white.png");
            }
        }

        this.button.onclick = () => {
            this.flag ? this.hide() : this.show();
            this.flag = !this.flag;
        }

        this.flag = false;

        document.body.appendChild(this.button);
        document.body.appendChild(this.stalematePreposition);
    }

    show (withoutPermissions) {
        if ((game.timer.stopped == false && game.isGameEnabled() != false
            && this.sentPrepositionAlready == false) || (withoutPermissions == true)) {
            this.stalematePreposition.style.display = "block";
            this.stalematePreposition.style.opacity = "1";
            this.button.setAttribute("src", "/gfx/icons/draw.png");
            this.button.style.zIndex = "1201";
            this.clicked = true;
        }
    }

    hide () {
        this.stalematePreposition.style.display = "none";
        this.stalematePreposition.style.opacity = "0";
        this.button.setAttribute("src", "/gfx/icons/draw_white.png");
        this.button.style.zIndex = "1199";
        this.clicked = false;
        this.stalemate_yes.innerHTML = "Zaproponuj remis";
        this.stalemate_yes.classList.remove("gotPreposition");
        this.stalemate_no.innerHTML = "Wróć do gry";
        this.stalemate_no.classList.remove("gotPreposition");
        this.header.innerHTML = "Czy chcesz zaproponować remis?";

        this.stalemate_yes.onclick = () => {
            this.sentPrepositionAlready = true;
            net.window.showWindow("Wysłano propozycję remisu");
            this.hide();
            net.sendStalematePreposition();
        }

        this.stalemate_no.onclick = () => {
            this.hide();
        }
    }

    gotPrepositionOfStalemate (nick) {
        this.show(true);
        this.stalemate_yes.innerHTML = "Akceptuj";
        this.stalemate_yes.classList.add("gotPreposition");
        this.stalemate_no.innerHTML = "Odmów";
        this.stalemate_no.classList.add("gotPreposition");
        this.header.innerHTML = `${nick} zaproponował/a remis.`;

        this.stalemate_yes.onclick = () => {
            this.hide();
            this.acceptedPreposition();
            net.acceptStalematePreposition();
        }

        this.stalemate_no.onclick = () => {
            this.hide();
            net.declineStalematePreposition();
        }
    }

    acceptedPreposition () {
        game.timer.stopTimer();

        var statistics = main.getStatistics();
        statistics.draws++;
        statistics.points += 25;

        main.setStatistics(statistics.wins, statistics.draws, statistics.losses, statistics.points);
        net.setStatisticsForUser(main.getNick(), statistics.wins, statistics.draws, statistics.losses, statistics.points);

        game.turnTheGameOff();
        net.window.showWindow("Koniec gry");

        net.window.showWindow("Remis został przyjęty.");
        net.window.stalemate();
    }

    declinedPreposition () {
        net.window.showWindow("Remis nie został przyjęty.");
        this.sentPrepositionAlready = false;
    }

    createComponent () {
        let stalematePreposition = document.createElement("div");
        stalematePreposition.style.opacity = "0";
        stalematePreposition.classList.add("stalemate-preposition");

        let internalContainer = document.createElement("div");
        internalContainer.classList.add("internal-container");
        stalematePreposition.appendChild(internalContainer);

        let header = document.createElement("h1");
        header.classList.add("header");
        header.innerHTML = "Czy chcesz zaproponować remis?";
        this.header = header;

        let stalemate_yes = document.createElement("div");
        stalemate_yes.classList.add("stalemate-yes");
        stalemate_yes.innerHTML = "Zaproponuj remis";
        this.stalemate_yes = stalemate_yes;
        let drawImg = document.createElement("img");
        drawImg.setAttribute("src", "/gfx/icons/draw_white.png");
        drawImg.style.width = "30px";
        drawImg.style.height = "30px";
        drawImg.style.borderRadius = "15px";
        drawImg.style.marginLeft = "10px";
        stalemate_yes.appendChild(drawImg);
        let stalemate_no = document.createElement("div");
        stalemate_no.classList.add("stalemate-no");
        stalemate_no.innerHTML = "Wróć do gry";
        this.stalemate_no = stalemate_no;
        internalContainer.appendChild(header);
        internalContainer.appendChild(stalemate_yes);
        internalContainer.appendChild(stalemate_no);

        this.stalemate_yes.onclick = () => {
            this.sentPrepositionAlready = true;
            net.window.showWindow("Wysłano propozycję remisu");
            this.hide();
            net.sendStalematePreposition();
        }

        this.stalemate_no.onclick = () => {
            this.hide();
        }

        return stalematePreposition;
    }

    createButtonIcon () {
        let button = document.createElement("img");
        button.classList.add("stalemate-button");
        button.setAttribute("src", "/gfx/icons/draw_white.png");

        return button;
    }

    getComponent () {
        return this.stalematePreposition;
    }
}