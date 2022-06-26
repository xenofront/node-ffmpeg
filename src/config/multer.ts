import multer from "multer";
import uuid from "uuid";

global.upload = multer({
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname });
  },
  key: function (req, file, cb) {
    let key = uuid.v4();
    if (file.mimetype.indexOf("video") >= 0) {
      key += ".mp4";
    }
    cb(null, key);
  },
});
