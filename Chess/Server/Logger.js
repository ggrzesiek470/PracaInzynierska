import fs from 'fs';

export default class Logger {

    static type = {
        INFO: "INFO",
        WARNING: "WARN",
        ERROR: "ERR",
        CRITICAL: "CRIT_ERR",
    };

    static print (text, validity, event) {
        let message = validity + ": " + event + " --- ";
        message += new Date().toISOString() + " --- " + text;
        
        console.log(message);
    }
}

