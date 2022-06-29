import {Request, Response} from "express";

export const notFound = (req: Request, res: Response) => {
    res.json({
        success: false,
        message: `Page: ${req.url} not found`,
    });
};
