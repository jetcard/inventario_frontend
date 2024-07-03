import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmComponent } from '../../shared/components/confirm/confirm.component';
import { ActivoService } from '../../shared/services/activo.service';
import { CustodioService } from '../../shared/services/custodio.service';
import { UtilService } from '../../shared/services/util.service';
import { NewActivoComponent } from '../new-activo/new-activo.component';
import { ProveedorService } from '../../shared/services/proveedor.service';

export interface Custodio{
  id: number;
  areacustodio: string;
  nombresyapellidos: string;
}

export interface Proveedor{
  id: number;
  ruc: string;
  razonsocial: string;
}

@Component({
  selector: 'app-activo',
  templateUrl: './activo.component.html',
  styleUrls: ['./activo.component.css']
})
export class ActivoComponent implements OnInit {

  isAdmin: any;
  especificaciones: any[] = [];
  ///activoForm: FormGroup;
  public custodios: Custodio[]=[];
  public proveedores: Proveedor[]=[];
  //public myFormGroup!: FormGroup;
  //myFormGroup: FormGroup;
  //private formBuilder = inject(FormBuilder);///
  //private fb = inject(FormBuilder);
  private activoService = inject(ActivoService);
  private util = inject(UtilService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private custodioService=inject(CustodioService);
  private proveedorService=inject(ProveedorService);
  /*
  constructor(
    private fb: FormBuilder,
    private especificacioneservice: Especificacioneservice,
    private util: UtilService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.activoForm = this.fb.group({
      especificaciones: new FormControl(''),
      custodio: [''],
      articulo: [''],      
    });
  }*/

  ngOnInit(): void {
    /*this.activoForm = this.fb.group({
      custodio: [''],
      articulo: [''],
    });*/
    this.isAdmin = this.util.isAdmin();
    this.muestraTabla();
    this.muestraComboCustodio();
    this.muestraComboProveedores();
  }

  //displayedColumns: string[] = ['id', 'custodio', 'articulo', 'tipo', 'categoria', 'especificaciones', 'actions'];
  displayedColumns: string[] = ['id', 'custodio', 
    //'proveedor', 
    'tipo', 'categoria', 'articulo', 'codinventario', 
    'modelo', 'marca', 'nroserie', 
    'fechaingresostr', 
    'moneda', 'importe', 'actions'];
    
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  muestraTabla() {
    this.activoService.getActivos()
      .subscribe(
        (data: any) => {
          console.log("respuesta de activos: ", data);
          this.processActivoResponse(data);
        },
        (error: any) => {
          console.log("error en activos: ", error);
        }
      );
  }

  processActivoResponse(resp: any){
    const dateActivo: ActivoElement[] = [];
     if( resp.metadata[0].code == "00"){
       let listCActivo = resp.activoResponse.listaactivos;
       listCActivo.forEach((element: ActivoElement) => {
         ///element.categoria = element.categoria.name;
         //element.picture = 'data:image/jpeg;base64,'+element.picture;
         dateActivo.push(element);
       });
       //set the datasource
       this.dataSource = new MatTableDataSource<ActivoElement>(dateActivo);
       this.dataSource.paginator = this.paginator;
     }
  }

/*
  processEspecificoResponseSB(resp: any) {
    if (resp.metadata[0].code == "00") {
      const dataEspecifico = resp.especificoResponse.listaespecificaciones.map((element: any) => ({
        id: element.id,
        custodio: element.custodio.areacustodio,
        articulo: element.articulo.nombrearticulo,
        especificaciones: element.especificaciones.map((attr: any) => ({
          id: attr.id,
          nombreatributo: attr.nombreatributo
        }))
      }));

      this.especificaciones = dataEspecifico;
      this.dataSource.data = dataEspecifico;
      this.dataSource.paginator = this.paginator;
    }
  }*/

  openActivoDialog(): void {
    const dialogRef = this.dialog.open(NewActivoComponent, {
      width: '900px'
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result === 1) {
        this.openSnackBar("Activo agregado", "Éxito");
        this.muestraTabla();
      } else if (result === 2) {
        //this.openSnackBar("Se produjo un error al guardar activo", "Error");
        this.openSnackBar("Activo agregado", "Éxito");
        this.muestraTabla();        
      }
    });
  }

  edit(id: number, custodio: any, articulo: any, tipo: any, categoria:any, 
    codinventario:string, 
    modelo:string, 
    marca:string, 
    nroserie:string, 
    fechaingresostr:string, moneda: string, importe:number, especificaciones: any): void {
    const dialogRef = this.dialog.open(NewActivoComponent, {
      width: '900px',
      data: { 
        id: id, 
        custodio: custodio, 
        articulo: articulo,
        tipo: tipo, 
        categoria:categoria,
        codinventario: codinventario, 
        modelo: modelo, 
        marca: marca, 
        nroserie: nroserie, 
        fechaingresostr: fechaingresostr, 
        moneda: moneda, 
        importe: importe,     
        especificaciones: especificaciones }
    });
  
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result === 1) {
        this.openSnackBar("Activo editado", "Éxito");
        this.muestraTabla();
      } else if (result === 2) {
        this.openSnackBar("Se produjo un error al editar activo", "Error");
      }
    });
  }
  
  openSnackBar(message: string, action: string): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 2000
    });
  }
  /*
  edit(id: number, custodio: any, articulo: any, especificaciones: any) {
    const dialogRef = this.dialog.open(NewEspecificoComponent, {
      width: '450px',
      data: { id: id, custodio: custodio, articulo: articulo, especificaciones: especificaciones }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 1) {
        this.openSnackBar("Especifico editado", "Éxito");
        this.getEspecificoMaestro();
      } else if (result == 2) {
        this.openSnackBar("Se produjo un error al editar especifico", "Error");
      }
    });
  }*/

  delete(id: any) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '450px',
      data: { id: id, module: "activo" }
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 1) {
        this.openSnackBar("Activo eliminado", "Exito");
        this.muestraTabla();
      } else if (result == 2) {
        this.openSnackBar("Se produjo un error al eliminar activo", "Error");
      }
    });
  }

  buscar(modelo: any) {
    if (modelo.length === 0) {
      return this.muestraTabla();
    }

    this.activoService.getActivoByModelo(modelo)
      .subscribe(
        (resp: any) => {
          this.processActivoResponse(resp);
        },
        (error: any) => {
          console.error("Error al buscar activo por modelo", error);
        }
      );
  }

  exportExcel() {
    this.activoService.exportActivo()
      .subscribe(
        (data: any) => {
          let file = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          let fileUrl = URL.createObjectURL(file);
          var anchor = document.createElement("a");
          anchor.download = "especificaciones.xlsx";
          anchor.href = fileUrl;
          anchor.click();
          this.openSnackBar("Archivo exportado correctamente", "Exitosa");
        },
        (error: any) => {
          this.openSnackBar("No se pudo exportar el archivo", "Error");
        }
      );
  }

  /*onEspecificoChange(newEspecifico: number, element: any) {
    // Implementar servicio para actualizar el especifico en el backend si es necesario
  }*/

    muestraComboCustodio(){
      this.custodioService.getResponsables()
          .subscribe( (data: any) =>{
            this.custodios = data.custodioResponse.listacustodios;
          }, (error: any) =>{
            console.log("error al consultar custodios");
          })
    }    

    muestraComboProveedores(){
      this.proveedorService.getProveedores()
        .subscribe((data: any)=>{
          this.proveedores = data.proveedorResponse.listaproveedores;
        }, (error: any)=>{
          console.log("error al consultar proveedores");
        })
    }

}
export interface ActivoElement {
  id: number;
  custodio: any;
  articulo: any;
  tipo: any;
  categoria: any;
  proveedor:any,
  codinventario: string,
  modelo: string;
  marca: string;
  nroserie: string;
  fechaingresostr: string;
  fechaingreso: Date;
  importe: number;  
  moneda: string;  
  especificaciones: any;//especificaciones: any;
  }
