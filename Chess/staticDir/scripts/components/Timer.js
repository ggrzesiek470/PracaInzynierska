class Timer {
    secondsLeft;

    yourTimeShownLeft;
    oppTimeShownLeft;
    lastBeginningDate;
    interval;

    timerDiv;

    constructor (minutes) {
        this.secondsLeft = minutes*60;
        if (this.secondsLeft > 0) {
            this.timerDiv = $("<div>").addClass("timerDiv");

            this.startTimer();

            $("body").append(this.timerDiv);
        }
    }

    evaluateTime () {
        let minutesLeft = Math.floor(this.yourTimeShownLeft / 60);
        minutesLeft = minutesLeft >= 10 ? minutesLeft : "0" + minutesLeft;
        let secondsLeft = this.yourTimeShownLeft - minutesLeft*60;
        secondsLeft = secondsLeft >= 10 ? secondsLeft : "0" + secondsLeft;
        let timeShown = minutesLeft + ":" + secondsLeft;

        this.timerDiv.html("");
        for (let i = 0; i < timeShown.length; i++) {
            let digit = timeShown[i] == ":" ? "colon" : timeShown[i];
            let img = $("<img>").attr("src", `gfx/digits/${digit}.png`)
                    .attr("alt", digit)
                    .addClass("digit");
            if (digit == "colon") {
                img.css("width", "6px");
            }
            this.timerDiv.append(img);
        }
    }

    stopTimer () {
        let nextDate = new Date();
        this.yourTimeShownLeft = Math.ceil((this.secondsLeft*1000 - (nextDate - this.lastBeginningDate))/1000);
        this.secondsLeft = (this.secondsLeft*1000 - (nextDate - this.lastBeginningDate))/1000;
        clearInterval(this.interval);
    }

    startTimer () {
        this.lastBeginningDate = new Date();
        this.interval = setInterval(() => {
            let nextDate = new Date();
            this.yourTimeShownLeft = Math.ceil((this.secondsLeft*1000 - (nextDate - this.lastBeginningDate))/1000);
            this.evaluateTime();
        }, 20);
    }

}