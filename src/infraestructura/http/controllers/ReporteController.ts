import { Request, Response } from "express";
import { GenerarReporte } from "../../../aplicacion/reportes/GenerarReporte";

export class ReporteController {
    constructor(readonly generarReporteOcupacion: GenerarReporte) {}

    ocupacion = async (req: Request, res: Response): Promise<void> => {
        try {
            const { fecha_inicio, fecha_fin } = req.query;

            // VALIDAR QUE LLEGUEN LOS PARÁMETROS
            if (!fecha_inicio || !fecha_fin) {
                res.status(400).json({
                    mensaje: "Se requieren fecha_inicio y fecha_fin como parámetros (YYYY-MM-DD)",
                });
                return;
            }

            // GENERAR REPORTE
            const reporte = await this.generarReporteOcupacion.ejecutar(
                fecha_inicio as string,
                fecha_fin as string
            );

            res.status(200).json({
                mensaje: "Reporte de ocupación generado exitosamente",
                reporte,
            });
        } catch (error: any) {
            res.status(400).json({ mensaje: error.message });
        }
    };
}