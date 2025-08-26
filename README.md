# zCord

An opensource extention to discord.js for easy setup and component creation

## Install:

Installation of this package is as easy as any other: `npm install @zoe01/zcord`

After that use `const zCord = require('@zoe01/zcord');` to include it in your module.

## Features
- Package based composition
- Embed presets
- Easy modals
- Easy components
- Easy buttons

## How to use
### Scope for packages in a folder of your choosing
```js
const { scopePackages } = require('@zoe01/zcord');
const packs = scopePackages(path/to/folder);
```
This looks for all packages in a folder.

### Edit the packages (ooptional)
Between scoping and making a client you can edit the packages as you have everything in a Map object. You can remove, edit or replace packages or their functions.

### Make a client
zcord has it's own client that extends the discord.js client; zClient.
added features are:
- packages attribute
- initEvents() function
- initCommands() function

note that initEvents() must be ran before logging in with the client as initCommands() requires the clients rest object. initCommands must not be called manually as it gets called in the root's readyClient event - Which befhavior changes depending on the environment variable `PUSH_COMMANDS`:
- =0 does nothing
- =1 pushes commands without deleting anything
- =2 pushes commands but first deletes all commands
- =3 deletes all commands

A zClient is made using `new zClient(packs)`.
It takes the package map as argument to construct the client. All intents and partials are gathered from the packages so each package can be easilly transfered as everything is and stays in the folder.

## Extras
### zErrors
zcord has some predefined errors that you can use to respond. They are more or less all HTTP status codes but you can make new ones with messages of your choosing.
The base zError is message- and codeless. it only holds the functions every error has:
- constructor()
- toEmbed()
- invoke()

#### constructor(...args)
The constructor can take multiple arguments that will be added to the base message with utils.format(this.message, ...args). The same system as `console.log('number: %i', 6)` -> `number: 6`

#### toEmbed()
This function returns an embed with the zError's info.

#### invoke()
This function throws an error with the zError's info; Which you can catch with
```js
try{
    zError.invoke();
} catch(err) {
    console.error(err);
}
```

### colors
zcord has a color schema with predifined keys that correspond to a color. It's used for embeds to have a uniform color pallete, you can set this:
```js
const { zColor } = require('@zoe01/zcord');
zColor.setPallete(Object)
```
The function iterates over all existing colors in the pallete and looks for a corresponding name in the given pallete. If it exists it replaces the color, if it doesn't it keeps the old color.

You can read the colors with:
```js
const { zColor } = require('@zoe01/zcord');
zColor.colors[key];
```
