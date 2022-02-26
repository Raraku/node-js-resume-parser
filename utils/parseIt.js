var ParseBoy = require("../src/ParseBoy");
var processing = require("../src/libs/processing");
var _ = require("underscore");
var logger = require("tracer").colorConsole();

var parser = {
  parseResume: async function (file, savePath) {
    var objParseBoy = new ParseBoy(),
      savedFiles = 0;

    var onFileReady = async function (preppedFile) {
      return await objParseBoy.parseFile(preppedFile, function (Resume) {
        logger.trace(
          "I got Resume for " + preppedFile.name + ", now saving..."
        );
        return objParseBoy.storeResume(
          preppedFile,
          Resume,
          savePath,
          function (err) {
            if (err) {
              return logger.error(
                "Resume " + preppedFile.name + " errored",
                err
              );
            }
            logger.trace("Resume " + preppedFile.name + " saved");
          }
        );
      });
    };
    console.log("here");
    let data = await processing.run(file, onFileReady);
    // console.log(data);
    return data;
    // console.log(data);
  },
};
module.exports = parser;
