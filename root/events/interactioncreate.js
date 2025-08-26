const { Events, BaseInteraction, SortOrderType } = require('discord.js');
const { zError404 } = require('@zoe01/zcord/classes/zErrors.js');

module.exports = {
    name: Events.InteractionCreate,
    /**
     * @param {BaseInteraction} interaction 
     */
    async execute(interaction){
        if(interaction.isChatInputCommand()){
            const commandName = interaction.commandName;
            const packageArray = [...interaction.client.packages];

            try{
                packageArray.find(p => p[1].commands[commandName] !== undefined)[1].commands[commandName].file.execute(interaction);
            } catch(err) {
                if(interaction.deferred || interaction.replied){
                    interaction.followUp({content:err.message,embeds:[new zError404().toEmbed()]});
                } else {
                    interaction.reply({content:err.message,embeds:[new zError404().toEmbed()]});
                }
            }
            
        } else if(interaction.isMessageComponent() || interaction.isModalSubmit() || interaction.isButton()){
            let uniqueName = interaction.component.customId;
            //let uniqueName = 'hellooo';
            const sourceType = (uniqueName.startsWith('#')) ? 'commands': (uniqueName.startsWith('@')) ? 'events': undefined; if (sourceType === undefined) return;
            uniqueName = uniqueName.substring(1); // removes the special character
            uniqueName = uniqueName.replaceAll('$', '');
            
            const address = uniqueName.split('/', 2);

            try {
                const sourceFolder = interaction.client.packages.get(address[0])[sourceType];
                const key = Object.keys(sourceFolder).find(k => sourceFolder[k].file[address[1]]);
                sourceFolder[key].file[address[1]](interaction);
            } catch {
                console.warn(`[Warning] Failed to call function ${uniqueName}`);
            }
        }
    }
}
