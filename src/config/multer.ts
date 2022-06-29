import multer from "multer";

export let upload;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, global.sandboxPath);
    },
    filename: function (req: any, file: any, cb: any) {
        cb(null, file.originalname);
    }
});

const fileFilter = (req: any, file: any, cb: any) => {
    const validMimeTypes = /|audio.*/i;
    const mime = file.mimetype.match(validMimeTypes);

    if (mime) {
        cb(null, true);
    } else {
        cb(new Error("Error: File not supported"), false);
    }
};

upload = multer({storage: storage, fileFilter: fileFilter});
