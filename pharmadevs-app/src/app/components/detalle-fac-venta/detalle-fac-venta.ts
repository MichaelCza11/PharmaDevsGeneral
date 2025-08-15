import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Producto } from '../../model/producto.model';
import { FacturaVenta } from '../../model/factura-venta.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DetalleFacVentaService } from '../../services/detalle-fac-venta';
import { ProductoService } from '../../services/producto';
import { FacturaVentaService } from '../../services/factura-venta';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { DetalleFacVenta } from '../../model/detalle-fac-venta.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-detalle-fac-venta',
  standalone: false,
  templateUrl: './detalle-fac-venta.html',
  styleUrl: './detalle-fac-venta.css'
})
export class DetalleFacVentaComponent implements OnInit {
  detalleVentas: DetalleFacVenta[]=[]
  productos: Producto[] = [];
  facturaventas: FacturaVenta[] = [];
  detalleVenta: DetalleFacVenta = {} as DetalleFacVenta;
  editar: boolean = false;
  idEditar: number | null = null;
  dataSource!: MatTableDataSource<DetalleFacVenta>;
  selectedFile!: File;
  imagenPreview: string = "";
  DetalleVentaSeleccionada: DetalleFacVenta | null = null;

  mostrarColumnas: String[] = ['detalles','idDetalleVenta','cantidad','preciounitario','iva','subtotal','producto','facturaventa','acciones']

  @ViewChild('formularioDetalleVenta') formularioDetalleVenta!: ElementRef;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('modalDetalleVenta') modalDetalleVenta!: TemplateRef<any>;
  @ViewChild('modalDetalles') modalDetalles!: TemplateRef<any>;


  constructor(
    private detalleVentaService: DetalleFacVentaService,
    private productoService: ProductoService,
    private facturaVentaService: FacturaVentaService,
    private dialog: MatDialog,
    private http: HttpClient
  ){}

  ngOnInit(): void {
    this.findAll();
    this.cargarProductos();
    this.cargarFacturas();
  }

  findAll(): void {
    this.detalleVentaService.findAll().subscribe(data=>{
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  cargarProductos(): void{
    this.productoService.findAll().subscribe(data=>{
      this.productos = data;
    });
  }

  cargarFacturas(): void{
    this.facturaVentaService.findAll().subscribe(data=>{
      this.facturaventas = data;
    });
  }

  save(): void{
    this.detalleVentaService.save(this.detalleVenta).subscribe(data=>{
      this.detalleVenta = {} as DetalleFacVenta;
      this.findAll();
    });
  }

  update(): void{
    if(this.idEditar !== null){
      this.detalleVentaService.update(this.idEditar, this.detalleVenta).subscribe(()=>{
        this.detalleVenta = {} as DetalleFacVenta;
        this.editar = false;
        this.idEditar = null;
        this.findAll();
      });
    }
  }

  delete(): void{
    Swal.fire({
      title: '¿desea eliminar el libro?',
      text: 'Esta accion no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      if (result.isConfirmed) {
        this.detalleVentaService.delete(this.detalleVenta.idDetalleVenta).subscribe(() => {
          this.findAll();
          this.detalleVenta = {} as DetalleFacVenta;
          Swal.fire('Eliminado', 'El detalle ha sido eliminado', 'success')
        });
      }else{
        this.detalleVenta = {} as DetalleFacVenta;
      }
    });
  }


  editarDetalleVenta(detalleVenta : DetalleFacVenta): void{
    this.detalleVenta = {...detalleVenta}
    this.idEditar = detalleVenta.idDetalleVenta;
    this.editar = true;
    setTimeout(() =>{
      this.formularioDetalleVenta.nativeElement.scrollIntoView({behavior: 'smooth', block: 'start'})
    }),100;
  }

  editarDetalleVentaCancelar(form: NgForm): void{
    this.detalleVenta = {} as DetalleFacVenta;
    this.idEditar = null;
    this.editar = false;
    form.resetForm();
  }

  guardarDetalle(): void{
    if(this.editar && this.idEditar!== null){
      this.update();
    }else{
      this.save();
    }
    this.dialog.closeAll();
  }

  filtroDetalleVenta(event: Event): void{
    const filtro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filtro.trim().toLowerCase();
  }

  nombreProducto(producto: Producto): string{
    return `${producto.nombre}`;
  }
  
  //Llamada a la factura formato pdf
  Factura(facturaVenta: FacturaVenta): string{
    return `${facturaVenta.facventa}`;
  }

  abrirModal(detalleVenta?: DetalleFacVenta): void{
    if(detalleVenta){
      this.detalleVenta = {...detalleVenta};
      this.editar = true;
      this.idEditar = detalleVenta.idDetalleVenta;
  }else{
    this.detalleVenta = {} as DetalleFacVenta;
    this.editar = false;
    this.idEditar= null;
  }
  this.dialog.open(this.modalDetalleVenta, {
    width: '800px',
    disableClose: true
  });
}

compararProductos(p1: Producto, p2: Producto): boolean{
  return p1 && p2 ? p1.idProducto === p2.idProducto : p1 === p2;
}

compararfacturas(f1: FacturaVenta, f2: FacturaVenta): boolean{
  return f1 && f2 ? f1.idFacturaventa === f2.idFacturaventa : f1 === f2;
}

onFileSelected(event: any){
  this.selectedFile = event.target.files[0];
}

/*subirImagen(): void{
  const formData = new FormData
  formData.append("file", this.selectedFile);

  if(this.libro.portada){
    formData.append("oldImage", this.libro.portada);
  }

  this.http.post<{ruta: string}>('http://localhost:8080/api/upload-portada', formData)
    .subscribe(res => {
      this.libro.portada = res.ruta;
      this.imagenPreview = res.ruta;
    });
}*/

abrirModalDetalles(detalleVenta: DetalleFacVenta): void {
  this.DetalleVentaSeleccionada = detalleVenta;
  this.dialog.open(this.modalDetalles, {
    width: '500px'
  });
}

cerrarModal(): void{
  this.dialog.closeAll();
  this.DetalleVentaSeleccionada = null;
}
}