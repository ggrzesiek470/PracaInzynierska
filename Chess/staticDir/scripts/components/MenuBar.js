class MenuBar {
    static width = 60; // "px"
    static height = 50; // "%"
    numberOfElements = 0;

    constructor () {
        this.menuBar = this.createComponent();
        
        this.button.onclick = () => {
            this.flag ? this.hide() : this.show();
            this.flag = !this.flag;
        }

        this.flag = false;
    }

    pushMenuOption (option) {
        document.body.appendChild(option.getComponent());
        this.menuBar.appendChild(option.button);
        this.numberOfElements++;
        option.button.style.marginTop = "5px";
        option.button.style.top = (this.numberOfElements*20) + "%";
    }

    show () {
        this.menuBar.style.right = "0";
        this.button.setAttribute("src", "/gfx/icons/hamburger_no_colours.png");
        this.button.style.right = "9px";
        this.button.style.zIndex = "1201";
    }

    hide () {
        this.menuBar.style.right = "-" + MenuBar.width + "px";
        this.button.setAttribute("src", "/gfx/icons/hamburger.png");
        this.button.style.right = "calc(100% + 9px)";
        this.button.style.zIndex = "1199";
    }

    createComponent () {
        let menuBar = document.createElement("div");
        menuBar.style.width = MenuBar.width + "px";
        menuBar.style.height = MenuBar.height + "%";
        menuBar.style.top = "0";
        menuBar.style.right = "-" + MenuBar.width + "px";
        menuBar.classList.add("menuBar-component");

        this.button = this.createButtonIcon();
        menuBar.appendChild(this.button);

        return menuBar;
    }

    createButtonIcon () {
        let button = document.createElement("img");
        button.classList.add("menuBar-button");
        button.setAttribute("src", "/gfx/icons/hamburger_no_colours.png");

        return button;
    }

    getComponent () {
        return this.menuBar;
    }
}