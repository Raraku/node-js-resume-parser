const express = require("express"),
  router = express.Router(),
  parseIt = require("../utils/parseIt"),
  multer = require("multer"),
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
  const file = req.file;
  if (!file) {
    const error = new Error("Please upload a file");
    error.httpStatusCode = 400;
    return next(error);
  }
  console.log("success");
  let returnedData = await parseIt.parseResume(req.file.path, "./compiled");
  console.log(returnedData.name);
  // console.log(returnedData);
  res.status(200).json(returnedData);
  // res.status(204).end();
});

module.exports = router;
