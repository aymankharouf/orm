import { NextFunction, Request, Response } from "express";

const trim = (req: Request, res: Response, next: NextFunction) => {
  Object.keys(req.body).forEach(key => {
		req.body[key] = req.body[key].trim()
	})
	next()
}

export default trim