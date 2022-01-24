class Ranking {
    static width = 35;
    static height = 70;
    table;

    constructor (data) {
        this.ranking = this.createComponent();

        this.table = document.createElement("table");
        this.addRow(["Lp.", "Nick", "W", "R", "P", "Pkt"]);
        this.ranking.appendChild(this.table);

        this.button.onclick = () => {
            this.flag ? this.hide() : this.show();
        }

        new Tooltip(this.button, "Ranking", "left");

        this.flag = false;
        this.updateTable(data);
    }

    updateTable (data) {
        let lp = 1;
        data.forEach(rankRow => {
            this.addRow([lp++, rankRow.username, rankRow.wins, rankRow.draws, rankRow.losses, rankRow.points]);
        });
    }

    addRow (table_data) {
        let table_row = document.createElement("tr");
        this.table.appendChild(table_row);
        table_data.forEach(text => {
            let td = document.createElement("td");
            if (table_data[1] == main.getNick()) {
                td.style.backgroundColor = "rgba(0, 240, 0, 0.6)";
            }
            td.innerHTML = text;
            table_row.appendChild(td);
        });
    }

    show () {
        game.historicalGames.hide();
        game.profile.hide();
        this.ranking.style.top = "0";
        this.button.setAttribute("src", "/gfx/icons/trophy_no_colours.png");
        this.button.style.zIndex = "1201";
        this.flag = true;
    }

    hide () {
        this.ranking.style.top = "-" + Ranking.height + "%";
        this.button.setAttribute("src", "/gfx/icons/trophy.png");
        this.button.style.zIndex = "1199";
        this.flag = false;
    }

    createComponent () {
        let ranking = document.createElement("div");
        ranking.style.width = Ranking.width + "%";
        ranking.style.height = Ranking.height + "%";
        ranking.style.top = "-" + Ranking.height + "%";
        ranking.classList.add("ranking-component");

        this.button = this.createButtonIcon();
        ranking.appendChild(this.button);

        return ranking;
    }

    createButtonIcon () {
        let button = document.createElement("img");
        button.classList.add("ranking-button");
        button.setAttribute("src", "/gfx/icons/trophy_no_colours.png");

        return button;
    }

    getComponent () {
        return this.ranking;
    }
}