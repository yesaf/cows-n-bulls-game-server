import { NextFunction, Request, Response } from 'express';

export default function (getData: (req: Request, res: Response, next: NextFunction) => any) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const data = await getData(req, res, next);
        res.status(200).json(data);
    };
}
