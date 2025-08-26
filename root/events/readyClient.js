const { zClient } = require('@zoe01/zcord/classes/zClient');
const { Events } = require('discord.js');

module.exports = {
    name:Events.ClientReady,
    once:true,
    /**
     * @param {zClient} readyClient
     */
    async execute(readyClient) { 
        console.log(`[Client] logged in client ${readyClient.user.tag}`);
        if(parseInt(process.env.PUSH_COMMANDS) >= 3){
            readyClient.initCommands(true);
        } else if(parseInt(process.env.PUSH_COMMANDS) >= 2){
            readyClient.initCommands(true);
            readyClient.initCommands(false);
        } else if (parseInt(process.env.PUSH_COMMANDS) >= 1){
            readyClient.initCommands(false);
        }
    }
}