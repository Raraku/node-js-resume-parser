const express = require("express"),
  router = express.Router(),
  parseIt = require("../utils/parseIt"),
  multer = require("multer"),
  { exec } = require("child_process"),
  crypto = require("crypto"),
  mime = require("mime"),
  upload = multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, "./uploads/");
      },
      filename: function (req, file, cb) {
        crypto.pseudoRandomBytes(16, function (err, raw) {
          cb(
            null,
            raw.toString("hex") +
              Date.now() +
              "." +
              mime.extension(file.mimetype)
          );
        });
      },
    }),
  });

/* GET home page. */
router.get("/", function (req, res, next) {
  res.json({ data: "soon" });
  // res.render('index', {title: 'Express'});
});

router.post("/", upload.single("file"), async function (req, res, next) {
  try {
    const file = req.file;
    if (!file) {
      const error = new Error("Please upload a file");
      error.httpStatusCode = 400;
      return next(error);
    }
    console.log("success");
    console.log(req.file.path);

    let data = await AIParse(req);
    console.log(data);
    // let returnedData = await parseIt.parseResume(req.file.path, "./compiled");

    // console.log(returnedData);
    res.status(200).json({
      parser1: data,
      parser2: await parseIt.parseResume(req.file.path, "./compiled"),
    });
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

async function AIParse(req) {
  let data;
  return new Promise(function (resolve) {
    exec(`pyresparser -f ${req.file.path}`, (error, stdout, stderr) => {
      let result = { data: {}, error: null };
      if (error) {
        result.error = error;
        console.log(error);
      }
      resolve(JSON.parse(stdout));
      console.log(data);
      // let data = stdout
      //   .substring(stdout.indexOf(".pdf") + 4)
      //   .replace("[00m", "")
      //   .replace(/\n/g, "")
      //   .split("  ")
      //   .join("");
    });
  });
  console.log("ha");
  return data;
}

module.exports = router;
