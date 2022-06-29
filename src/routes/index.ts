import {Request, Response, Router} from "express";
import Ffmpeg from "fluent-ffmpeg";
import * as fs from "fs";
import path from "path";


const route = Router();

route.post("/convertToMp3", (req: any, res: Response) => {

    const files = req.body?.files as { value: any, name: string }[];

    fs.existsSync(global.sandboxPath) || fs.mkdirSync(global.sandboxPath);
    fs.existsSync(`${global.sandboxPath}/uploads`) || fs.mkdirSync(`${global.sandboxPath}/uploads`);
    fs.existsSync(`${global.sandboxPath}/converted`) || fs.mkdirSync(`${global.sandboxPath}/converted`);

    try {
        const convertedFiles: { value: any, name: string }[] = [];

        new Promise(async resolve => {

            for (const file of files) {
                const sandboxUploadsPath = `${global.sandboxPath}/uploads/${file.name}`;
                const newConvertedFile = `${global.sandboxPath}/converted/${file.name}`;

                const fileBuffer = Buffer.from(file.value, "base64");

                fs.writeFileSync(sandboxUploadsPath, fileBuffer);

                await convertFile(sandboxUploadsPath, newConvertedFile);

                const buffer = fs.readFileSync(newConvertedFile);

                convertedFiles.push({value: buffer.toString("base64"), name: file.name});
                fs.unlinkSync(sandboxUploadsPath);
                fs.unlinkSync(newConvertedFile);
            }

            resolve(convertedFiles);
        }).then(newFiles => {
            res.json({success: true, files: newFiles});
            res.end();
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
