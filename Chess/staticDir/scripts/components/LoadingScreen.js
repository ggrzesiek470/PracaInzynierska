function LoadingScreen (maxValue) {
    this.loadingValue = 0;
    this.dots = 0;
    this.parity = false;
    this.maxValue = maxValue;
    this.backgroundCurtain;
    this.headerText;
    this.percentageText;

    this.init = () => {
        this.backgroundCurtain = $("<div>");
        this.backgroundCurtain.addClass("loading-screen-curtain");

        var loadingCircle = $("<div>");
        loadingCircle.addClass("loading-screen-loader");

        this.headerText = $("<div>");
        this.headerText.addClass("loading-screen-header");
        this.headerText.html("Loading");
        
        this.percentageText = $("<div>");
        this.percentageText.addClass("loading-screen-text");

        this.backgroundCurtain.append(this.headerText);
        this.backgroundCurtain.append(loadingCircle);
        this.backgroundCurtain.append(this.percentageText);

        $("body").append(this.backgroundCurtain);
    }

    this.addOneToVal = () => {
        this.loadingValue++;
        this.validateIfFullLoaded();
    }

    this.setLoadingValue = (loadingValue) => {
        this.loadingValue = loadingValue;
        this.validateIfFullLoaded();
    }

    this.setMaxValue = (maxValue) => {
        this.maxValue = maxValue;
        this.validateIfFullLoaded();
    }

    this.validateIfFullLoaded = () => {
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

    this.changeLoadingDots = () => {
        var text = "Loading";
        this.dots++;
        for(var i = 0; i < this.dots; i++) {
            text += ".";
        }
        this.headerText.html(text)
        if (this.dots >= 3) this.dots = 0;
    }

    this.init();
    return this;
}