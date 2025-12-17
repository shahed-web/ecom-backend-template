import {type Request, type Response} from 'express';

export const login = async (req: Request, res: Response) => {

    res.status(200).json({message: 'Login successful', data: req.body});    
    res.end()
}