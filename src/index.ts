import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import http from "http";
import routes from "./routes";

import "dotenv/config";
import path from "path";

global.ServerRoot = path.resolve(__dirname);
global.sandboxPath = path.resolve(`${__dirname}/../sandbox`);

const app = express();

const server = http.createServer(app);

app.use(cors());

app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({extended: true}));

// app.use("/public", express.static("public"));

app.use(routes);

server.listen(process.env.PORT, () => {
    console.log(`Server listening at http://localhost:${process.env.PORT}`);
});
