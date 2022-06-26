import { Request, Response } from "express";

export const welcome = (req: Request, res: Response) => {
  res.json({
    success: true,
  });
};

// const upload = (req, res) => {
//   res.json({
//     success: true,
//     message: `File uploaded successfully`,
//     data: req.file,
//   });
// };

export const notFound = (req: Request, res: Response) => {
  res.json({
    success: false,
    message: `Page: ${req.url} not found`,
  });
};
