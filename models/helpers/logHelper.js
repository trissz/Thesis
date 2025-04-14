class LogHelper
{
    static MESSAGES = "messages";
    static WARNINGS = "warnings";
    static ERRORS = "errors";
    static CONFIRMATIONS = "confirmations";

    static messages = [];
    static warnings = [];
    static errors = [];
    static confirmations = [];

    static addMessage(input)
    {
        this.messages.push(input);
    }

    static getMessages()
    {
        return this.messages;
    }

    static addWarning(input)
    {
        this.warnings.push(input);
    }

    static getWarnings()
    {
        return this.warnings;
    }

    static addError(input)
    {
        this.errors.push(input);
    }

    static getErrors()
    {
        return this.errors;
    }

    static addConfirmation(input)
    {
        this.confirmations.push(input);
    }

    static getConfirmations()
    {
        return this.confirmations;
    }

    static addLog(type, input)
    {
        switch ( type )
        {
            case this.MESSAGES:
                this.addMessage(input);
                break;
            case this.WARNINGS:
                this.addWarning(input);
                break;
            case this.ERRORS:
                this.addError(input);
                break;
            case this.CONFIRMATIONS:
                this.addConfirmation(input);
                break;
            default:
                throw new Error(`Invalid log type: ${type}`);
        }
    }

    static getLogs()
    {
        return {
            [this.MESSAGES]: this.getMessages(),
            [this.WARNINGS]: this.getWarnings(),
            [this.ERRORS]: this.getErrors(),
            [this.CONFIRMATIONS]: this.getConfirmations(),
        };
    }

    static clearLogs()
    {
        this.messages = [];
        this.warnings = [];
        this.errors = [];
        this.confirmations = [];
    }

    static toHtml()
    {
        const logs = this.getLogs();
        let htmlContent = "";

        for ( const [key, entries] of Object.entries(logs) )
        {
            if ( entries.length > 0 )
            {
                htmlContent += `<h3>${key.charAt(0).toUpperCase() + key.slice(1)}</h3><div>`;

                entries.forEach((entry) => {
                    htmlContent += `<div class="log_entry ${key}">${entry}</div>`;
                });

                htmlContent += "</div>";
            }
        }

        return htmlContent;
    }
}

module.exports = LogHelper;