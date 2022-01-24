class Tooltip {
    static tooltips = [];

    constructor (element, text, direction) {
        let tooltip = $("<div>").addClass("small-tooltip");
        tooltip.html(text);
        if (direction == undefined) direction = "left";

        element.onmouseover = () => {
            Tooltip.tooltips.forEach(t => {
                t.hide();
            });

            tooltip.css("display", "block");

            let top = $(element).offset().top;
            let left = $(element).offset().left;
            let width = parseInt(tooltip.css("width"));
            let height = parseInt(tooltip.css("height"));
            if (direction == "left") {
                tooltip.css("transition-duration", "0s");
                tooltip.css("left", left - width);
                tooltip.css("opacity", 0);
                tooltip.css("top", top + parseInt($(element).css("height"))/2 - (height / 2));
                setTimeout(() => {
                    tooltip.css("transition-duration", "0.6s");
                    tooltip.css("left", left - width - 15);
                    tooltip.css("opacity", 1);
                    tooltip.css("z-index", "1500");
                }, 20);
            } else if (direction == "top") {
                tooltip.css("transition-duration", "0s");
                tooltip.css("left", left - width/2);
                tooltip.css("opacity", 0);
                tooltip.css("top", top - parseInt($(element).css("height")));
                setTimeout(() => {
                    tooltip.css("transition-duration", "0.6s");
                    tooltip.css("top", top - parseInt($(element).css("height") - 15));
                    tooltip.css("opacity", 1);
                    tooltip.css("z-index", "1500");
                }, 20);
            }
        }

        element.onmouseleave = () => {
            this.hide();
        }

        $("body").append(tooltip);
        this.tooltip = tooltip;
        Tooltip.tooltips.push(tooltip);
    }

    hide () {
        this.tooltip.css("opacity", 0);
        this.tooltip.css("z-index", "-50");
    }

    remove () {
        let index = -1;
        for(var i = 0; i < Tooltip.tooltips.length; i++) {
            if (Tooltip.tooltips[i] == this.tooltip) {
                index = i;
            }
        }
        if (index != -1) {
            Tooltip.tooltips.splice(index, 1);
        }
        this.getComponent().remove();

    }

    getComponent () {
        return this.tooltip;
    }
}