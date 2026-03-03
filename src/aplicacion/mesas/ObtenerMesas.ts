import { InterfazMesa } from "../../dominio/Puertos/InterfazMesa";
import { Mesa } from "../../dominio/entidades/Mesa";

export class ObtenerMesas {
    constructor(readonly repoMesa: InterfazMesa){}

    async ejecutar(): Promise <Mesa[]>{
        return await this.repoMesa.obtenerMesas();
    }


}