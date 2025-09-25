/* node */
const fs = require('node:fs');
const path = require('node:path');

/* scope */
/**
 * Scope the package folder to collect all the atoms
 * @param {PathLike} scopePath
 * @returns
 */
exports.scopePackages = ((scopePath) => {
    try{
        fs.openSync(scopePath); // just checking if the path exists

        /* vars */
        const packageMap = new Map();
        const commands = new Map();

        const packages = fs.readdirSync(scopePath);
        for(const packageFold of packages){
            const packagePath = path.join(scopePath, packageFold);
            packageMap.set(packageFold, packagePath);
        }

        packageMap.set('root', path.join(__dirname, '../root'));

        packageMap.forEach((packagePath, package) => {
            try{
                const packageObject = {
                    index:null,
                    commands:null,
                    events:null
                };

                const packageIndex = require(path.join(packagePath, 'index.js'));
                if(!('name' in packageIndex)){
                    throw new Error('invalid config');
                }
                if(!('intents' in packageIndex)){
                    packageIndex.intents = [];
                }
                if(!('partials' in packageIndex)){
                    packageIndex.partials = [];
                }
                if(!('init' in packageIndex)){
                    packageIndex.init = (() => {return;});
                }

                packageObject.index = packageIndex;
                packageObject.events = {};
                packageObject.commands = {};

                let commandsPath;
				let packageCommands;
				try{
                	commandsPath = path.join(packagePath, 'commands');
                	packageCommands = fs.readdirSync(commandsPath).filter(p => p.endsWith('.js'));
				} catch {
					packageCommands = [];
				}
				
				let eventsPath;
				let packageEvents;
				try{
                	eventsPath = path.join(packagePath, 'events');
                	packageEvents = fs.readdirSync(eventsPath).filter(p => p.endsWith('.js'));
				} catch {
					packageEvents = [];
				}

                for(const commandFile of packageCommands){
                    try{
                        const command = require(path.join(commandsPath, commandFile));
                        if('data' in command && 'execute' in command){
                            if(commands.get(command.data.name)){
                                console.error(`[Error] Multiple commands called '${command.data.name}' exist; ${commands.get(command.data.name)}, ${path.join(commandsPath, commandFile)}`);
                                throw new Error('Conflicting commands');
                            }
                            commands.set(command.data.name, path.join(commandsPath, commandFile));
                            packageObject['commands'][command.data.name] = {
                                name:command.data.name,
                                author:(command.author) ? command.author : (packageIndex.author) ? packageIndex.author : 'unknown',
                                version:(command.version) ? command.version : 'unknown',

                                file:command
                            }
                        } else {
                            throw new Error('invalid config');
                        }
                    } catch {
                        console.warn(`[Warning] Failed to load #${commandFile}`);
                    };
                };

                for(const eventFile of packageEvents){
                    try{
                        const event = require(path.join(eventsPath, eventFile));
                        if('name' in event && 'execute' in event){
                            packageObject['events'][event.name] = {
                                name:event.name,
                                author:(event.author) ? event.author : (packageIndex.author) ? packageIndex.author : 'unknown',
                                version:(event.version) ? event.version : 'unknown',

                                once:(event.once) ? event.once : false,
                                file:event
                            }
                        } else {
                            throw new Error('invalid config');
                        }
                    } catch {
                        console.warn(`[Warning] Failed to load @${eventFile}`);
                    }
                };

                if(Object.keys(packageObject).length > 0){
                    packageMap.set(package, packageObject);
                } else {
                    packageMap.delete(package);
                    throw new Error();
                };
            } catch {
                packageMap.delete(package);
                console.warn(`[Warning] Failed to load package ${package}`);
            };
        });

        return packageMap;

    } catch(err) {
        switch(err.code){
            case('ENOENT'):
                return null;
            default:
                throw err;
        }
    }
});