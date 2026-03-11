import { Router } from "express";
import { ReporteController } from "../controllers/ReporteController";
import { autenticar } from "../middleware/autenticacion.middleware";
import { autorizar } from "../middleware/autorizacion.middleware";

export const crearReportesRouter = (controller: ReporteController): Router => {
    const router = Router();

    
    router.get(
        "/ocupacion",
        autenticar,           
        autorizar("gerente"), 
        controller.ocupacion  
    );

    return router;
};