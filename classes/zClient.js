/* discord.js */
const {Client, Routes} = require('discord.js');

class zClient extends Client {
    /**
     * Construct a new zClient
     * @param {Map} packages 
     */
    constructor(packages){
        const intents = [];
        const partials = [];

        packages.forEach((pack, key) => {
            intents.concat(pack.intents);
            partials.concat(pack.partials);
        })

        super({intents:intents, partials:partials});
        this.packages = packages;
        return this;
    }

    /**
     * initiate all commands
     * @param {boolean} del
     */
    initCommands(del) {
        if(!this.packages){throw new Error('No packages in client')};

        const rest = this.rest;
        const commands = [];

        if(!del){
            this.packages.forEach((pack, key) => {
                for(const [name, command] of Object.entries(pack.commands)){
                    commands.push(command.file.data.toJSON());
                }
            });
        }

        (async () => {
            try{
                console.log(`[Info] pushing ${commands.length} command(s)`);
                const data = await rest.put(Routes.applicationCommands(this.user.id), {body: commands});
                console.log(`[Info] succesfully pushed ${data.length} command(s)`);
            } catch(err) {
                console.log(err);
            }
        })();
    }

    /**
     * initiate all events
     */
    initEvents() {
        console.log(this.packages);
        if(!this.packages){throw new Error('No packages in client')};
        this.packages.forEach((pack, key) => {
            if(Object.keys(pack.events).length > 0){
                for(const [name, event] of Object.entries(pack.events)){
                    console.log(`[Info] Registering ${key}@${name}`);
                    if(event.once){
                        this.once(name, (...args) => event.file.execute(...args));
                    } else {
                        this.on(name, (...args) => event.file.execute(...args));
                    }
                    console.log(`[Info] Registered ${key}@${name}${(event.once) ? ' once' : ''}`);
                }
            }
        });
    }
}

exports.zClient = zClient;