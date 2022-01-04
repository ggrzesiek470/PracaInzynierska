class LoadingScreen {
    loadingValue = 0;
    dots = 0;
    parity = false;
    maxValue;
    backgroundCurtain;
    headerText;
    percentageText;

    constructor (maxValue) {
        this.maxValue = maxValue;

        this.backgroundCurtain = $("<div>")
                            .addClass("loading-screen-curtain");

        var loadingCircle = $("<div>")
                            .addClass("loading-screen-loader");

        this.headerText = $("<div>")
                        .addClass("loading-screen-header")
                        .html("Loading");
        
        this.percentageText = $("<div>")
                        .addClass("loading-screen-text");

        this.backgroundCurtain.append(this.headerText)
                            .append(loadingCircle)
                            .append(this.percentageText);

        $("body").append(this.backgroundCurtain);
    }

    addOneToVal () {
        this.loadingValue++;
        this.validateIfFullLoaded();
    }

    setLoadingValue (loadingValue) {
        this.loadingValue = loadingValue;
        this.validateIfFullLoaded();
    }

    setMaxValue (maxValue) {
        this.maxValue = maxValue;
        this.validateIfFullLoaded();
    }

    validateIfFullLoaded () {
        if (this.parity == false) {
            this.parity = true;
        } else {
            this.parity = false;
            this.changeLoadingDots();
        }

        var percent = parseInt((this.loadingValue / this.maxValue) * 100);
        this.percentageText.html(percent + "%");

        if (this.loadingValue >= this.maxValue) {
            this.backgroundCurtain.addClass("hide");
            
        } else {}
    }

    changeLoadingDots () {
        var text = "Loading";
        this.dots++;
        for(var i = 0; i < this.dots; i++) {
            text += ".";
        }
        this.headerText.html(text)
        if (this.dots >= 3) this.dots = 0;
    }
}