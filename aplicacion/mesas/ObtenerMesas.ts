import { InterfazMesa } from "../../dominio/Puertos/InterfazMesa";
import { Mesa } from "../../dominio/entidades/Mesa";

export class ObtenerMesas {
    constructor(private repoMesa: InterfazMesa){}

    async ejecutar(): Promise <Mesa>{
        return await this.repoMesa.obtenerMesas();
    }


}