
var fetch = require('isomorphic-fetch'); // or another library of choice.
var Dropbox = require('dropbox').Dropbox;
var dropBoxConfig = require('../config/myStoryConfigDB')
var logger = require('../common/logger')(__filename);
const moment = require('moment');
const fs = require('fs');
const unzipper = require('unzipper');
const path = require("path");
var AWS = require("aws-sdk");
var ACCESS_TOKEN = dropBoxConfig.import.accessTokenDropBox;
var dropBoxRootFolderPath = dropBoxConfig.import.rootfoldernamepath_DropBox;
var downloadRootdir = dropBoxConfig.import.dropboxDownloadToLocal_folderName;
const basePath = path.basename(__filename);
logger.info("basePath:" + basePath);
//NOT USING AWS HERE...
//IF USING, NEED TO PASS PARAMS THROUGH ENV
// var awsAccessKey = dropBoxConfig.export.aws_access_key;
// var awsSecKey = dropBoxConfig.export.aws_access_secret;
// AWS.config.update({ accessKeyId: dropBoxConfig.export.aws_access_key, secretAccessKey: dropBoxConfig.export.aws_access_secret })
// const awsBucketName = dropBoxConfig.export.aws_s3_bucket;

var downloadDirLocalPath = path.join(__filename, '../../../', downloadRootdir)
logger.info("downloadDirLocalPath:" + downloadDirLocalPath);
if (!fs.existsSync(downloadDirLocalPath)) {
  fs.mkdirSync(downloadDirLocalPath);
}

/*********************************************************************
* To RUN:
* Open terminal
* cd ~node-app
* > npx node ./services/dropBoxToS3Service.js 
***********************************************************************/
// logger.info("accessToken:" + accessToken);
logger.info("dropBoxRootFolderPath:" + dropBoxRootFolderPath);


var self = module.exports = {

  run() {

    var now = moment().format();
    var today = moment(now).format('YYYY-MM-DD');
    var todaysZipFileName = today + ".zip"
    var downloadRootdirPathForToday = path.join(__filename, '../../../', downloadRootdir, today);
    console.log("downloadRootdirPathForToday:" + downloadRootdirPathForToday)

    return new Promise((resolve, reject) => {

      logger.info(">>>>>>>>>>>>>>>> Downloading content at:" + new Date());

      self.startDownloadingFromDpx(downloadRootdirPathForToday, todaysZipFileName)
        .then((results) => {

          // resolve(results)
          // var distFolderPath = path.join(__filename, '../../../..', downloadRootdir, today, 'MyStory_1');
          // console.log("***distFolderPath:" + distFolderPath);

          //NOT USING TO UPLOAD TO S3 here...
          //USING AWS CLI FOR THIS
          // resolve(self.uploadToS3(distFolderPath));

        })
        .catch((error) => {
          logger.error("error:" + error.stack);
          reject({ "error": "Unable to upload to S3 " + error.stack });
        });
    });
  },

  // uploadToS3(distFolderPath) {

  //   logger.info("===========================================================")
  //   logger.info("uploadToS3()");
  //   logger.info("===========================================================")


  //   return new Promise((resolve, reject) => {

  //     //TODO

  //     //Using AWS CLI

  //     resolve("")

  //   });
  // },

  startDownloadingFromDpx(downloadRootdirPathForToday, todaysZipFileName) {

    logger.info("===========================================================")
    logger.info("In startDownloadingFromDpx()");
    logger.info("===========================================================")

    try {

      //Create the new dir for today
      if (!fs.existsSync(downloadRootdirPathForToday)) {
        fs.mkdirSync(downloadRootdirPathForToday);
      }


      
      return new Promise((resolve, reject) => {

          var dbx = new Dropbox({ accessToken: ACCESS_TOKEN, fetch: fetch });

          //   dbx
          //   .filesListFolder({ path: '/myhospitalstory.org/peabody/Peabody Audiology Visit/boy/' })
          //     .then((response) => {
          //     // .then(console.log, console.error);
          //     resolve(response)
          // });

          dbx.filesDownloadZip({ path: dropBoxRootFolderPath })
            .then((response) => {
              //1. Fetch from DropBox
              logger.info("1.Downloading to..." + downloadRootdirPathForToday)
              fs.writeFile(downloadRootdirPathForToday + '/' + todaysZipFileName, response.fileBinary, 'binary', (err) => {

                //2. Extract zip archive
                var pathToZipFile = path.join(downloadRootdirPathForToday, todaysZipFileName);
                logger.info("Extracting to..." + downloadRootdirPathForToday)

                fs.createReadStream(pathToZipFile)
                  .pipe(unzipper.Extract({ path: downloadRootdirPathForToday })
                    .on('finish', function () {  // finished
                      logger.info("Extraction completed")

                      resolve("Extraction completed.")
                      //3. Push to S3 
                      // logger.info("Pushing to S3")

                    })
                    .on('error', function (err) {

                      logger.error(err);
                      throw err;

                    }))

              }) //close fs.writeFile
            })

        });


    }
    catch (err) {
      logger.error("error:" + err.stack);
      throw new Error("Error downloading zip" + err);
    }

  },



}


self.run().catch(logger.info);

