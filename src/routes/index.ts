import {Request, Response, Router} from "express";
import Ffmpeg from "fluent-ffmpeg";
import * as fs from "fs";
import path from "path";


const route = Router();

route.post("/convertToMp3", (req: any, res: Response) => {

    const files = req.body?.files as { value: any, name: string }[];

    try {
        const convertedFiles: { value: any, name: string }[] = [];

        new Promise(async resolve => {

            for (const file of files) {
                const sandboxPath = `${global.sandboxPath}/${file.name}`;
                const newConvertedFile = sandboxPath;

                const fileBuffer = Buffer.from(file.value, "base64");

                fs.writeFileSync(sandboxPath, fileBuffer);

                await convertFile(sandboxPath, newConvertedFile);

                const buffer = fs.readFileSync(newConvertedFile);

                convertedFiles.push({value: buffer.toString("base64"), name: file.name});
            }

            resolve(convertedFiles);
        }).then(newFiles => {
            res.json({success: true, files: newFiles});
            res.end();

            fs.readdir(global.sandboxPath, (err, files) => {
                if (err) throw err;

                for (const file of files) {
                    fs.unlink(path.join(global.sandboxPath, file), err => {
                        if (err) throw err;
                    });
                }
            });

        });
    } catch (err) {
        res.json({success: false, message: err});
    }
});

route.all("**", (req: Request, res: Response) => {
    res.json({
        success: false,
        message: `Page: ${req.url} not found`,
    });
});

function convertFile(filePath: string, output: string) {
    return new Promise<void>((resolve, reject) => {

        Ffmpeg(`${filePath}`)
            .on("end", () => {
                resolve();
            })
            .on("error", (e) => {
                console.log("error: ", e);
                reject(e);
            })
            .output(output)
            .run();

    });
}

export default route;
