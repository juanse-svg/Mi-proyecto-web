import { Request,Response } from "express";
import { Registrarusaurio } from "../../../aplicacion/auth/RegistrarUsuario";
import {LoginUsuario}from "../../../aplicacion/auth/LoginUsuario";
import {LogoutUsuario}from "../../../aplicacion/auth/LogoutUsuario";


export class AuthController {
    constructor(
        private registrarUsuario: Registrarusaurio,
        private loginUsuario: LoginUsuario,
        private logoutUsuario:LogoutUsuario
    ){}


    registrar = async (req:Request, res:Response): Promise <void>=> {
        try{
            const usuario =await this.registrarUsuario.ejecutar(req.body);
            res.status(201).json({mensaje: 'Usuario resgistrado correctamente',usuario});
        } catch (error:any){
            res.status(400).json({mensaje: error.mensaje})
        }
    };

login =async (req:Request, res:Response): Promise <void> => {
    try{
        const resultado =await this.loginUsuario.ejecutar(req.body);
        res.status(200).json(resultado);
    }catch (error:any){
        res.status(401).json({mensaje: error.mensaje});
    }
    
}

logout =  (req: Request, res:Response): void => {
    const resultado = this.logoutUsuario.ejecutar();
    res.status(200).json(resultado);
}


}


