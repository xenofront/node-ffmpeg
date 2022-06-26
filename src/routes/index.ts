import { HomeController } from "../controllers";
import { Router } from "express";

const route = Router();

route.get("/", HomeController.welcome);

// route.post("/upload", upload.single("file"), HomeController.upload);

route.get("**", HomeController.notFound);

export default route;
