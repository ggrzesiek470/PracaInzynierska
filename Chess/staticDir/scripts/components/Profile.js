class Profile {
    static width = 35;
    static height = 70;
    table;

    lp = 1;

    constructor (data) {
        this.profile = this.createComponent();

        this.table = document.createElement("table");
        this.addRow(["Dane użytkownika"]);
        this.profile.appendChild(this.table);

        this.button.onclick = () => {
            this.flag ? this.hide() : this.show();
        }

        new Tooltip(this.button, "Mój profil", "left");

        this.flag = false;
        this.updateTable(data);
    }

    updateTable (data) {
        this.lp = 1;
        this.table.innerHTML = "";
        this.addRow(["Dane użytkownika"]);
        data.forEach(profileData => {
            this.addRow([profileData]);
        });
        this.addRow([""]);
        this.addResetPasswordButton();
    }

    addRow (table_data) {
        let table_row = document.createElement("tr");
        this.table.appendChild(table_row);
        table_data.forEach(text => {
            let td = document.createElement("td");
            td.style.padding = "10px";
            if (table_data[0] != "Dane użytkownika") {
                td.style.fontSize = "28px";
            }
            if (this.lp == 3) {
                td.style.backgroundColor = "rgba(0, 240, 0, 0.4)";
            } else if (this.lp == 4) {
                td.style.backgroundColor = "rgba(240, 0, 240, 0.4)";
            } else if (this.lp == 5) {
                td.style.backgroundColor = "rgba(240, 0, 0, 0.7)";
            }
            td.innerHTML = text;
            table_row.appendChild(td);
        });
        this.lp++;
    }

    addResetPasswordButton () {
        let table_row1 = document.createElement("tr");
        this.table.appendChild(table_row1);
        let td1 = document.createElement("td");
        let input = document.createElement("input");
        input.setAttribute("type", "password");
        input.classList.add("password-change");
        td1.appendChild(input);
        td1.style.backgroundColor = "white";
        td1.style.fontSize = "32px";
        td1.style.padding = "10px";
        td1.style.position = "relative";
        table_row1.appendChild(td1);

        let table_row2 = document.createElement("tr");
        this.table.appendChild(table_row2);
        let td2 = document.createElement("td");
        td2.innerHTML = "Zmień hasło";
        td2.style.cursor = "pointer";
        td2.style.backgroundColor = "rgba(244, 81, 30, 0.7)";
        td2.style.fontSize = "28px";
        td2.style.padding = "5px";
        table_row2.appendChild(td2);

        table_row2.onclick = () => {
            if (input.value != "" && input.value != null) {
                net.window.showWindow("Zmieniono hasło.");
                net.changePassword(input.value);

                this.hide();
                input.value = "";
            } else {
                net.window.showWindow("Wprowadziłeś puste hasło!");
            }
        }
    }

    show () {
        game.ranking.hide();
        game.historicalGames.hide();
        this.profile.style.top = "0";
        this.button.setAttribute("src", "/gfx/icons/profle.png");
        this.button.style.zIndex = "1201";
        this.flag = true;
    }

    hide () {
        this.profile.style.top = "-" + Profile.height + "%";
        this.button.setAttribute("src", "/gfx/icons/profile_colors.png");
        this.button.style.zIndex = "1199";
        this.flag = false;
    }

    createComponent () {
        let profile = document.createElement("div");
        profile.style.width = Profile.width + "%";
        profile.style.height = Profile.height + "%";
        profile.style.top = "-" + Profile.height + "%";
        profile.classList.add("ranking-component");

        this.button = this.createButtonIcon();
        profile.appendChild(this.button);

        return profile;
    }

    createButtonIcon () {
        let button = document.createElement("img");
        button.classList.add("ranking-button");
        button.setAttribute("src", "/gfx/icons/profile_colors.png");

        return button;
    }

    getComponent () {
        return this.profile;
    }
}