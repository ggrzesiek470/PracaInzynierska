class HistoricalGames {
    static width = 35;
    static height = 70;
    table;

    constructor (data) {
        this.historicalGames = this.createComponent();

        this.table = document.createElement("table");
        this.addRow(["Lp.", "Biały", "Czarny", "Czas gry [min.]", "Wynik", "Mat po .. ruchu"]);
        this.historicalGames.appendChild(this.table);

        this.button.onclick = () => {
            this.flag ? this.hide() : this.show();
        }

        new Tooltip(this.button, "Historyczne rozgrywki", "left");

        this.flag = false;
        this.updateTable(data);
    }

    updateTable (data) {
        let lp = 1;
        data.forEach(historyRow => {
            let result = (historyRow.whitePlayerPointsGain == 50) ? "Białe" : "Czarne";
            result = (historyRow.whitePlayerPointsGain == 25) ? "Pat" : result;
            
            let color;

            if ((historyRow.whitePlayer == main.getNick() && result == "Białe") ||
                (historyRow.blackPlayer == main.getNick() && result == "Czarne")) {
                color = "rgba(0, 240, 0, 0.6)";
            } else if (result == "Pat") {
                color = "rgba(240, 0, 240, 0.6)";
            } else {
                color = "rgba(240, 0, 0, 0.6)";
            }            

            let finalGameTime = Math.round((historyRow.finalGameTime / 60)*100)/100;

            if (isNaN(finalGameTime)) {
                finalGameTime = "brak danych";
            }

            this.addRow([lp++, historyRow.whitePlayer,
                                historyRow.blackPlayer,
                                finalGameTime,
                                result,
                                historyRow.winInMoves], color);
        });
    }

    addRow (table_data, color) {
        let table_row = document.createElement("tr");
        table_row.style.cursor = "pointer";
        this.table.appendChild(table_row);
        table_data.forEach(text => {
            let td = document.createElement("td");
            if (color != undefined) {
                td.style.backgroundColor = color;
            }
            td.innerHTML = text;
            table_row.appendChild(td);
        });
    }

    show () {
        game.ranking.hide();
        game.profile.hide();
        this.historicalGames.style.top = "0";
        this.button.setAttribute("src", "/gfx/icons/history_no_colours.png");
        this.button.style.zIndex = "1201";
        this.flag = true;
    }

    hide () {
        this.historicalGames.style.top = "-" + HistoricalGames.height + "%";
        this.button.setAttribute("src", "/gfx/icons/history.png");
        this.button.style.zIndex = "1199";
        this.flag = false;
    }

    createComponent () {
        let historicalGames = document.createElement("div");
        historicalGames.style.width = HistoricalGames.width + "%";
        historicalGames.style.height = HistoricalGames.height + "%";
        historicalGames.style.top = "-" + HistoricalGames.height + "%";
        historicalGames.classList.add("ranking-component");

        this.button = this.createButtonIcon();
        historicalGames.appendChild(this.button);

        return historicalGames;
    }

    createButtonIcon () {
        let button = document.createElement("img");
        button.classList.add("ranking-button");
        button.setAttribute("src", "/gfx/icons/history.png");

        return button;
    }

    getComponent () {
        return this.historicalGames;
    }
}