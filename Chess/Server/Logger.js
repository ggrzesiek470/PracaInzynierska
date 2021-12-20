import fs from 'fs';

export default class Logger {

    static type = {
        INFO: "INFO",
        WARNING: "WARN",
        ERROR: "ERR",
        CRITICAL: "CRIT_ERR",
    };

    static error_occured = false;

    static print (text, validity, event) {

        if (this.error_occured != true) {
            let date = new Date();
            let message = date.toLocaleString() + " --- " + validity + ": " + event + " --- " + text;
            console.log(message);

            let fileName = date.getFullYear() + "_" + (date.getMonth()+1) + "_" + date.getDate() + "_logs.txt";
            let path = "./Logs/";

            if (validity == Logger.type.CRITICAL) {
                this.error_occured = true;
            }

            fs.appendFile(path + fileName, message + "\n", function (err) {
                if (err) throw err;
                if (validity == Logger.type.CRITICAL) {
                    process.exit(1);
                }
            });
        }
    }
}

