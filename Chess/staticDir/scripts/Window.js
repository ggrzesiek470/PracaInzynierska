function Window() {
    document.getElementById("close").addEventListener("click", function () {
        hideWindow();
    })

    var onlyHalf = false;

    hideWindow = function () {
        document.getElementById("window").style.top = "-18vh";
    }

    this.hideWindow = hideWindow;

    this.onlyHalfly = function () {
        document.getElementById("window").style.top = "-9vh";
        document.getElementById("text").style.top = "11vh";
        onlyHalf = true;
    }

    this.showWindow = function (text) {
        if (text != undefined) document.getElementById("text").innerHTML = text;
        if (onlyHalf == false) document.getElementById("window").style.top = "0";
        else { document.getElementById("window").style.top = "-9vh"; document.getElementById("text").style.top = "11vh"; }
    }

    this.surrender = function () {
        document.getElementById("checkChecker").style.backgroundColor = "rgba(240, 240, 240, 0.5)";
        document.getElementById("window").style.backgroundColor = "rgba(240, 240, 240, 0.5)";
    }

    this.checkMate = function () {
        document.getElementById("checkChecker").style.backgroundColor = "rgba(240,0, 0, 0.7)";
        document.getElementById("window").style.backgroundColor = "rgba(240,0, 0, 0.7)";
    }

    this.stalemate = function () {
        document.getElementById("checkChecker").style.backgroundColor = "rgba(240, 0, 240, 0.5)";
        document.getElementById("window").style.backgroundColor = "rgba(240, 0, 240, 0.5)";
    }

    this.danger = function () {
        document.getElementById("checkChecker").style.backgroundColor = "rgba(255, 216, 0, 0.7)";
        document.getElementById("window").style.backgroundColor = "rgba(255, 216, 0, 0.7)";
    }

    this.safe = function () {
        document.getElementById("checkChecker").style.backgroundColor = "rgba(40, 150, 240, 0.5)";
        document.getElementById("window").style.backgroundColor = "rgba(40, 150, 240, 0.5)";
    }

    this.win = function () {
        document.getElementById("checkChecker").style.backgroundColor = "rgba(0, 240, 0, 0.5)";
        document.getElementById("window").style.backgroundColor = "rgba(0, 240, 0, 0.5)";
    }
}

function checkChecker() {
    this.showWindow = function (text) {
        if (text != undefined) document.getElementById("text").innerHTML = text;
    }
}