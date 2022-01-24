class ChessNotationContainer {
    static width = 20;
    static height = 50;

    lastTd;
    fulfilledRow = true;
    lp = 1;

    constructor (white, black) {
        this.chessNotationCont = this.createComponent();
        this.button = this.createButtonIcon();

        this.table = document.createElement("table");
        this.addRow([white, "", black]);
        this.chessNotationCont.appendChild(this.table);

        this.button.onclick = () => {
            this.flag ? this.hide() : this.show();
            this.flag = !this.flag;
        }

        this.flag = false;

        document.body.appendChild(this.button);
        document.body.appendChild(this.chessNotationCont);
    }

    updateTable (data) {
        data.forEach(entry => {
            if (this.fulfilledRow == true) {
                this.addRow([entry, this.lp++, ""]);
                this.fulfilledRow = false;
            } else {
                this.lastTd.innerHTML = entry;
                this.fulfilledRow = true;
            }
        });
    }

    addRow (table_data) {
        let table_row = document.createElement("tr");
        this.table.appendChild(table_row);
        table_data.forEach(text => {
            let td = document.createElement("td");
            if (text == "") {
                this.lastTd = td;
            }
            td.innerHTML = text;
            table_row.appendChild(td);
        });
    }

    show () {
        if (main.chat != undefined && main.chat.opened == true) {
            main.chat.openOrHideChat();
        }

        this.button.style.zIndex = "1206";
        this.chessNotationCont.style.right = "0";
        this.button.setAttribute("src", "/gfx/icons/clipboard.png");
    }

    hide () {
        this.button.style.zIndex = "1199";
        this.chessNotationCont.style.right = "-" + ChessNotationContainer.width + "%";
        this.button.setAttribute("src", "/gfx/icons/clipboard_no_colours.png");
    }

    createComponent () {
        let chessNotationCont = document.createElement("div");
        chessNotationCont.style.width = ChessNotationContainer.width + "%";
        chessNotationCont.style.height = ChessNotationContainer.height + "%";
        chessNotationCont.style.right = "-" + ChessNotationContainer.width + "%";
        chessNotationCont.classList.add("chess-notation-container");

        return chessNotationCont;
    }

    createButtonIcon () {
        let button = document.createElement("img");
        button.classList.add("chess-notation-button");
        button.setAttribute("src", "/gfx/icons/clipboard_no_colours.png");

        return button;
    }

    getComponent () {
        return this.chessNotationCont;
    }
}