import {Request,Response,NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../../config/config';


export interface TokenPay{
    id:number;
    email:string;
    rol:string;
}

export const autenticar = (req:Request, res:Response,next:NextFunction): void =>{
    const authHeader =req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer')){
        res.status(401).json({mensaje: 'Token no proporcionado'});
        return;
    }
const token = authHeader.split(' ')[1];
try{
    const payload= jwt.verify(token, config.jwt.secret) as TokenPay;
    (req as any).usuario=payload;
    next();
    } catch{
        res.status(401).json({mensaje: 'Token expirado o invalido'})
    }




}