var path = require('path');
var dotenv = require('dotenv'); //exposing env variables

dotenv.config({path: './.env'}); // not used

var config = {};
config.import = {};
config.export = {};

console.log("Environment:" + process.env.ENV)


//Dbx - BCH - using env
config.import.accessTokenDropBox = process.env.DROPBOX_ACCESS_TOKEN
config.import.rootfoldernamepath_DropBox = process.env.DROPBOX_ROOT_FOLDER_FOR_DOWNLOAD

//Dbx - BCH - direct
//config.import.accessTokenDropBox = 
// config.import.rootfoldernamepath_DropBox = 

config.import.dropboxDownloadToLocal_folderName = 'download-history/dropbox'

// console.log(JSON.stringify(config));

    
module.exports = config;
