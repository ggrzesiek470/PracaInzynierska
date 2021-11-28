class Ranking {

    constructor (width, height) {
        this.ranking = document.createElement("div");
        this.ranking.style.width = width + "%";
        this.ranking.style.height = height + "%";
        this.ranking.style.top = "0";
        this.ranking.style.right = "-" + width + "%";
        this.ranking.classList.add("ranking-component");

        let table = document.createElement("table");

        let table_data = ["Lp.", "Nick", "W", "R", "P", "Pkt"];
        let table_row = document.createElement("tr");
        table.appendChild(table_row);
        table_data.forEach(text => {
            let td = document.createElement("td");
            td.innerHTML = text;
            table_row.appendChild(td);
        });

        this.button = document.createElement("img");
        this.button.classList.add("ranking-button");
        this.button.setAttribute("src", "/gfx/hamburger-1.png");
        this.ranking.appendChild(this.button);
        this.ranking.appendChild(table);

        this.button.onclick = () => {
            this.flag ? this.hide() : this.show();
            this.flag = !this.flag;
        }

        this.width = width;
        this.flag = true;
    }

    getComponent () {
        return this.ranking;
    }

    show () {
        this.ranking.style.right = "0";
        this.button.setAttribute("src", "/gfx/hamburger-1.png");
        this.button.style.right = "10px";
        this.button.style.zIndex = "1201";
    }

    hide () {
        this.ranking.style.right = "-" + this.width + "%";
        this.button.setAttribute("src", "/gfx/hamburger-2.png");
        this.button.style.right = "calc(100% + 10px)";
        this.button.style.zIndex = "1199";
    }
}