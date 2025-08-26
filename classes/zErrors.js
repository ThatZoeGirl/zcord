const { colors } = require('../scripts/color.js');
const { EmbedBuilder } = require('discord.js');
const util = require('util');

class zError {
    code = undefined;
    title = undefined;
    message = undefined;

    /**
     * Constructor
     * Make the error and compose the message
     * @param {...any} args 
     */
    constructor(...args){
        this.message = util.format(this.message, args);
    }

    /**
     * Return the error in embed form.
     * @returns
     */
    toEmbed(){
        const embed = new EmbedBuilder()
            .setTitle(`Error`)
            .setDescription(`## **${this.code}: ${this.title}**\n**${this.message}**`)
            .setColor(zColor.colors.error)
            .setTimestamp(Date.now()/10000);
        
        return embed;
    }

    /**
     * Trigger
     */
    trigger(){
        console.error(`[Error${this.code}] ${this.title}: ${this.message}`);
        throw new (() => {
            const error = new Error();
                error.name = this.title;
                error.message = this.message;
            return error;
        })();
    }
}

exports.zError400 = class zError400 extends zError {
    code = 400;
    title = 'Bad Request';
    message = 'Invalid request message';
}

exports.zError401 = class zError401 extends zError {
    code = 401;
    title = 'Unauthorized';
    message = 'You must authenticate yourself in order to use this action';
}

exports.zError403 = class zError403 extends zError {
    code = 403;
    title = 'Forbidden';
    message = 'You do not have propper clearance for this action';
}

exports.zError404 = class zError404 extends zError {
    code = 404;
    title = 'Not Found';
    message = 'The content has not been found';
}

exports.zError406 = class zError406 extends zError {
    code = 406;
    title = 'Not Acceptable';
    message = 'The arguments do not meet the criteria';
}

exports.zError418 = class zError418 extends zError {
    code = 418;
    title = 'I\'m A Teapot';
    message = 'The server refuses to attempt to brew coffee with a teapot';
}

exports.zError500 = class zError500 extends zError {
    code = 500;
    title = 'Internal server error';
    message = 'The server encountered an error trying to process your request';
}

exports.zError501 = class zError501 extends zError {
    code = 501;
    title = 'Not Implemented';
    message = 'This feature has not been implemented';
}
