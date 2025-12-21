import type { Request, Response } from 'express';

export const createProduct = async (req: Request, res: Response) => {
     return res.status(200).send({
                message: "hello, its not done yet! its a test endpoint",
            });
}