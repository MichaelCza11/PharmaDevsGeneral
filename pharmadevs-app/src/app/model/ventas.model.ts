import { Cliente } from "./cliente.model";
import { FacturaVenta } from "./factura-venta.model";


export interface Ventas{
    idVentas: number;
    Fechaventa: Date;
    Formapago: string;
    Totalventa: string;
    cliente: Cliente;
    facturaventa: FacturaVenta;

    [key: string]: any;
}