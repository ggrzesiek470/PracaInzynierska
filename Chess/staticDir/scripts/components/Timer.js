class Timer {
    secondsLeft;

    yourTimeShownLeft;
    oppTimeShownLeft;
    lastBeginningDate;
    interval;

    timerDiv;
    stopped = false;
    disabled = false;

    constructor (minutes, launched) {
        this.secondsLeft = minutes*60;
        if (this.secondsLeft > 0) {
            this.timerDiv = $("<div>").addClass("timerDiv");

            if (launched) {
                this.startTimer();
            } else {
                this.lastBeginningDate = new Date();
                let nextDate = new Date();
                this.yourTimeShownLeft = Math.ceil((this.secondsLeft*1000 - (nextDate - this.lastBeginningDate))/1000);
                this.evaluateTime();
                this.visuallyShowStopping();
                this.stopped = true;
            }

            $("body").append(this.timerDiv);
        } else {
            this.disabled = true;
        }
    }

    evaluateTime () {
        if (this.disabled == false) {
            if (this.yourTimeShownLeft <= 0) this.yourTimeShownLeft = 0;
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
    }

    stopTimer () {
        if (this.disabled == false) {
            this.stopped = true;
            let nextDate = new Date();
            this.yourTimeShownLeft = Math.ceil((this.secondsLeft*1000 - (nextDate - this.lastBeginningDate))/1000);
            this.secondsLeft = (this.secondsLeft*1000 - (nextDate - this.lastBeginningDate))/1000;
            clearInterval(this.interval);
            this.visuallyShowStopping();
        }
    }

    startTimer () {
        if (this.disabled == false) {
            this.stopped = false;
            this.lastBeginningDate = new Date();
            this.visuallyShowStarting();
            this.interval = setInterval(() => {
                let nextDate = new Date();
                this.yourTimeShownLeft = Math.ceil((this.secondsLeft*1000 - (nextDate - this.lastBeginningDate))/1000);
                this.evaluateTime();
            }, 20);
        }
    }

    visuallyShowStopping () {
        if (this.disabled == false) {
            var span = $("<span>").addClass("timerInfo").html("Czas zatrzymany.");
            this.timerDiv.append(span);
            $(".timerDiv > .digit").addClass("digitHighlighted");
        }
    }

    visuallyShowStarting () {
        if (this.disabled == false) {
            $(".timerInfo").remove();
            $(".timerDiv > .digit").removeClass("digitHighlighted");
        }
    }
}