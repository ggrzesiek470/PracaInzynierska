function Chat() {
    this.sendMessage;
    this.getMessage;
    this.opened = false;
    this.containerForMessages;

    console.log("gdzie jest czat")

    this.init = () => {
        var wholeChat = $("<div>");
        wholeChat.addClass("chat-container");
        wholeChat.addClass("hidden-chat");
        
        var containerForMessages = $("<div>");
        containerForMessages.addClass("chat-messages-container");
        this.containerForMessages = containerForMessages;

        var inputSender = $("<input>");
        inputSender.addClass("chat-input-sender");
        inputSender.attr("placeholder", "Napisz swoją wiadomość.");

        var buttonSender = $("<button>");
        buttonSender.addClass("chat-button-sender");
        buttonSender.html("Wyślij");

        var chatOpener = $("<img>");
        chatOpener.attr("src", "/gfx/icons/chat_no_colours.png");
        chatOpener.attr("alt", "Open Chat");
        chatOpener.addClass("chat-open-button");
        chatOpener.addClass("hidden-chat");

        wholeChat.append(containerForMessages);
        wholeChat.append(inputSender);
        wholeChat.append(buttonSender);

        $("body").append(wholeChat);
        $("body").append(chatOpener);

        chatOpener.on("click", (event) => {
            chatOpener.toggleClass("hidden-chat");
            wholeChat.toggleClass("hidden-chat");
            this.opened = !this.opened;
            if (this.opened == true) {
                chatOpener.attr("src", "/gfx/icons/chat_coloured.png");
            } else {
                chatOpener.attr("src", "/gfx/icons/chat_no_colours.png");
            }
        })

        inputSender.on("keydown", (event) => {
            if (event.keyCode == 13) {
                var message = inputSender.val();
                inputSender.val("");
                this.sendMessage(message, main.getNick());
            }
        });

        buttonSender.on("click", (event) => {
            var message = inputSender.val();
            inputSender.val("");
            this.sendMessage(message, main.getNick());
        })
    }

    this.sendMessage = (message, nick) => {
        this.getMessage({ color: game.getYourColor(), message: message, nick: nick });
        net.sendMessage(message, nick);
    }

    this.getMessage = (data) => {
        var messageDiv = $("<div>");
        messageDiv.addClass("chat-message-div");

        if (data.color == "white") {
            messageDiv.addClass("color-white");
        } else {
            messageDiv.addClass("color-black");
        }
        messageDiv.html("<b>" + data.nick + "</b>: " + data.message);
        this.containerForMessages.append(messageDiv);
        this.containerForMessages.scrollTop(this.containerForMessages[0].scrollHeight);
    }

    this.init();
    return this;
}