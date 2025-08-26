/* components */
const zClient = require('@zoe01/zcord/classes/zClient').zClient;
const scopePackages = require('@zoe01/zcord/scripts/scopePackages').scopePackages;
const zErrors = require('@zoe01/zcord/classes/zErrors.js');
const color = require('@zoe01/zcord/scripts/color.js')

/* export */
module.exports = {
    zClient:zClient,
    scopePackages:scopePackages,
    zErrors:zErrors,
    zColor:color
}