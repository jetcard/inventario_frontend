import { Component, inject, AfterViewInit, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmComponent } from '../../shared/components/confirm/confirm.component';
import { ActivoService } from '../../shared/services/activo.service';
import { UtilService } from '../../shared/services/util.service';
import { NewActivoComponent } from '../new-activo/new-activo.component';
import { ResponsableService } from '../../shared/services/responsable.service';
import { ProveedorService } from '../../shared/services/proveedor.service';
import { MatDatepicker } from '@angular/material/datepicker';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
import { CurrencyPipe } from '@angular/common';
import { DatePipe } from '@angular/common';

export interface Responsable{
  id: number;
  arearesponsable: string;
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
  styleUrls: ['./activo.component.css'],
  providers: [CurrencyPipe, DatePipe]
})
export class ActivoComponent implements OnInit, AfterViewInit{
  //myFormGroup: FormGroup;
  public myFormGroup!: FormGroup;

  @ViewChild('pickerDesde') pickerDesde!: MatDatepicker<Date>;
  @ViewChild('pickerHasta') pickerHasta!: MatDatepicker<Date>;

  private fechaActual: Date = new Date();
  private fechaMinima: Date = new Date(2024, 4, 1);

  isAdmin: any;
  private activoService = inject(ActivoService);
  private snackBar = inject(MatSnackBar);
  private util = inject(UtilService);
  private responsableService=inject(ResponsableService);
  private proveedoresService=inject(ProveedorService);
  private cdr = inject(ChangeDetectorRef);

  private formBuilder = inject(FormBuilder);
  private datePipe = inject(DatePipe);
  public dialog = inject(MatDialog);
  public currencyPipe = inject(CurrencyPipe);
  public responsables: Responsable[]=[];
  public proveedores: Proveedor[]=[];
/*
  constructor() {
    // Define los controles dentro del FormGroup
    this.myFormGroup = new FormGroup({
      desde: new FormControl(),
      hasta: new FormControl()
    });
  }*/
  
  ngOnInit(): void {
    this.myFormGroup = this.formBuilder.group({
      responsable: [''],
      proveedor: [''],
      inputModelo: [''],
      inputMarca: [''],
      codinventario: [''],
      modelo: [''],
      marca: [''],
      nroserie: [''],
      desde: [''],
      hasta: ['']      
    });
    this.getActivos();
   // this.isAdmin = this.util.isAdmin();
    this.getResponsabless();
    this.getProveedores();
    this.cdr.detectChanges();
  }

  ngAfterViewInit(): void {
    this.abrirDatepickersConFechasPorDefecto();
    //this.abrirCalendarioSiVacio();
  }

  //displayedColumns: string[] = ['id', 'tipo', 'grupo', 'articulo', 'codinventario', 'modelo', 'marca', 'nroserie', 'fechaingreso', 'moneda', 'importe', 'actions'];
  displayedColumns: string[] = ['id', 'responsable', 'proveedor', 'tipo', 'grupo', 'articulo', 'codinventario', 'modelo', 'marca', 'nroserie', 'fechaingreso', 'moneda', 'importe', 'actions'];
  dataSource = new MatTableDataSource<ActivoElement>();

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  getActivos(){
    this.activoService.getActivos()
        .subscribe( (data:any) => {
          console.log("respuesta de activos: ", data);
          this.processActivoResponse(data);
        }, (error: any) => {
          console.log("error en activos: ", error);
        }) 
  }

  processActivoResponse(resp: any){
    const dateActivo: ActivoElement[] = [];
     if( resp.metadata[0].code == "00"){
       let listCActivo = resp.activoResponse.listaactivos;
       listCActivo.forEach((element: ActivoElement) => {
         ///element.grupo = element.grupo.name;
         //element.picture = 'data:image/jpeg;base64,'+element.picture;
         dateActivo.push(element);
       });
       //set the datasource
       this.dataSource = new MatTableDataSource<ActivoElement>(dateActivo);
       this.dataSource.paginator = this.paginator;
     }
  }

  openActivoDialog(){
    const dialogRef = this.dialog.open(NewActivoComponent , {
      width: '850px'
    });
    dialogRef.afterClosed().subscribe((result:any) => {
      if( result == 1){
        this.openSnackBar("Activo Agregado", "Éxito");
        this.getActivos();
      } else if (result == 2) {
        this.openSnackBar("Se produjo un error al guardar activo", "Error");
      }
    });
  }

  openSnackBar(message: string, action: string) : MatSnackBarRef<SimpleSnackBar>{
    return this.snackBar.open(message, action, {
      duration: 2000
    })

  }

  edit(id:number, responsable:any, proveedor:any, tipo: any, grupo:any, articulo: any, codinventario:string, modelo:string, 
    marca:string, 
    nroserie:string, 
    fechaingreso:Date, moneda: string, importe:number){
    const dialogRef = this.dialog.open(NewActivoComponent , {
      width: '850px', 
      data: {id: id, 
        responsable:responsable, 
        proveedor:proveedor, 
        tipo: tipo, 
        grupo:grupo, 
        articulo: articulo, 
        codinventario: codinventario, 
        modelo: modelo, 
        marca: marca, 
        nroserie: nroserie, 
        fechaingreso: fechaingreso, moneda: moneda, importe: importe}
    });
    dialogRef.afterClosed().subscribe((result:any) => {
      if( result == 1){
        this.openSnackBar("Activo editado", "Éxito");
        this.getActivos();
      } else if (result == 2) {
        this.openSnackBar("Se produjo un error al editar activo", "Error");
      }
    });


  }

  delete(id: any){
    const dialogRef = this.dialog.open(ConfirmComponent , {
      width: '450px', 
      data: {id: id, module: "activo"}
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      
      if( result == 1){
        this.openSnackBar("Activo eliminado", "Exitosa");
        this.getActivos();
      } else if (result == 2) {
        this.openSnackBar("Se produjo un error al eliminar activo", "Error");
      }
    });
  }

// En tu componente
buscar(
  responsable: string, 
  proveedor: string, 
  codinventario: string, 
  modelo: string, 
  marca: string, 
  nroserie: string, 
  fechaingresoDesde: string, 
  fechaingresoHasta: string
) {
  this.cdr.detectChanges();

  // Validar y limpiar los valores de los parámetros
  responsable = responsable ? responsable.trim() : '';
  proveedor = proveedor ? proveedor.trim() : '';
  codinventario = codinventario ? codinventario.trim() : '';
  modelo = modelo ? modelo.trim() : '';
  marca = marca ? marca.trim() : '';
  nroserie = nroserie ? nroserie.trim() : '';

  // Si todos los campos están vacíos, recuperar todos los activos
  if (!responsable && !proveedor && !codinventario && !modelo && !marca && !nroserie && !fechaingresoDesde && !fechaingresoHasta) {
    return this.getActivos();
  }

  let fechaDesdeFormatted: string | null = null;
  let fechaHastaFormatted: string | null = null;

  // Formatear fechas si están presentes
  if (fechaingresoDesde) {
    const fechaDesdeDate = new Date(fechaingresoDesde);
    if (!isNaN(fechaDesdeDate.getTime())) {
      fechaDesdeFormatted = formatDate(fechaDesdeDate, 'yyyy-MM-dd', 'en-US');
    }
  }
  if (fechaingresoHasta) {
    const fechaHastaDate = new Date(fechaingresoHasta);
    if (!isNaN(fechaHastaDate.getTime())) {
      fechaHastaFormatted = formatDate(fechaHastaDate, 'yyyy-MM-dd', 'en-US');
    }
  }

  // Llamar al servicio para realizar la búsqueda
  this.activoService.getActivoBusqueda(responsable, proveedor, codinventario, modelo, marca, nroserie, fechaDesdeFormatted, fechaHastaFormatted)
    .subscribe((resp: any) => {
      this.processActivoResponse(resp);
    });
}


  /*buscar(id: any){
    if ( id.length === 0){
      return this.getActivos();
    }
    this.activoService.getActivoByModelo(id)
        .subscribe( (resp: any) =>{
          this.processActivoResponse(resp);
        })
  }*/

 /* buscar(codinventario: string, modelo: string, marca: string, nroserie: string, fechaingresoDesde: string, fechaingresoHasta: string) {
    if (!codinventario && !modelo && !marca && !nroserie && !fechaingresoDesde && !fechaingresoHasta) {
      return this.getActivos();
    }
  
    const fechaDesdeDate = fechaingresoDesde ? new Date(fechaingresoDesde) : null;
    const fechaHastaDate = fechaingresoHasta ? new Date(fechaingresoHasta) : null;
  
    this.activoService.getActivoBusqueda(codinventario, modelo, marca, nroserie, fechaDesdeDate, fechaHastaDate)
      .subscribe((resp: any) => {
        this.processActivoResponse(resp);
      });
  }  */

  /*buscar(codinventario: string, modelo: string, marca: string, nroserie: string, fechaingresoDesde: string, fechaingresoHasta: string) {
    this.cdr.detectChanges();
    codinventario = codinventario.trim(); // Eliminar espacios en blanco
    modelo = modelo.trim();
    marca = marca.trim();
    nroserie = nroserie.trim();
  
    if (!codinventario && !modelo && !marca && !nroserie && !fechaingresoDesde && !fechaingresoHasta) {
      return this.getActivos();
    }
  
    const fechaDesdeDate = fechaingresoDesde ? new Date(fechaingresoDesde) : null;
    const fechaHastaDate = fechaingresoHasta ? new Date(fechaingresoHasta) : null;
  
    if (isNaN(fechaDesdeDate?.getTime() || 0) || isNaN(fechaHastaDate?.getTime() || 0)) {
      this.openSnackBar("Fechas inválidas", "Error");
      return;
    }

    this.activoService.getActivoBusqueda(codinventario, modelo, marca, nroserie, fechaDesdeDate, fechaHastaDate)
      .subscribe((resp: any) => {
        this.processActivoResponse(resp);
      });
  }*/
/*
  buscar() {
    const formValues = this.myFormGroup.value;
  
    const responsable = formValues.responsable ? formValues.responsable.trim() : '';
    const proveedor = formValues.proveedor ? formValues.proveedor.trim() : '';
    const codinventario = formValues.codinventario ? formValues.codinventario.trim() : '';
    const modelo = formValues.modelo ? formValues.modelo.trim() : '';
    const marca = formValues.marca ? formValues.marca.trim() : '';
    const nroserie = formValues.nroserie ? formValues.nroserie.trim() : '';
    const fechaingresoDesde = formValues.desde ? this.datePipe.transform(formValues.desde, 'dd-MM-yyyy') : null;
    const fechaingresoHasta = formValues.hasta ? this.datePipe.transform(formValues.hasta, 'dd-MM-yyyy') : null;
    
  
    if (!responsable && !proveedor && !codinventario && !modelo && !marca && !nroserie && !fechaingresoDesde && !fechaingresoHasta) {
      return this.getActivos();
    }
  
    this.activoService.getActivoBusqueda(responsable, proveedor, codinventario, modelo, marca, nroserie, fechaingresoDesde, fechaingresoHasta)
      .subscribe((resp: any) => {
        this.processActivoResponse(resp);
      });
  }*/
/*
  buscar(responsable: string, proveedor: string, codinventario: string, modelo: string, marca: string, nroserie: string, fechaingresoDesde: string, fechaingresoHasta: string) {
    this.cdr.detectChanges();
    
    // Validar y limpiar los valores de los parámetros
    responsable = responsable ? responsable.trim() : '';
    proveedor = proveedor ? proveedor.trim() : '';
    codinventario = codinventario ? codinventario.trim() : '';
    modelo = modelo ? modelo.trim() : '';
    marca = marca ? marca.trim() : '';
    nroserie = nroserie ? nroserie.trim() : '';
  
    // Si todos los campos están vacíos, recuperar todos los activos
    if (!responsable && !proveedor && !codinventario && !modelo && !marca && !nroserie && !fechaingresoDesde && !fechaingresoHasta) {
        return this.getActivos();
    }
  
    let fechaDesdeFormatted: string | null = null;
    let fechaHastaFormatted: string | null = null;
  
    // Formatear fechas si están presentes
    if (fechaingresoDesde) {
        const fechaDesdeDate = new Date(fechaingresoDesde);
        if (!isNaN(fechaDesdeDate.getTime())) {
            fechaDesdeFormatted = formatDate(fechaDesdeDate, 'dd-MM-yyyy', 'en-US');
        }
    }
    if (fechaingresoHasta) {
        const fechaHastaDate = new Date(fechaingresoHasta);
        if (!isNaN(fechaHastaDate.getTime())) {
            fechaHastaFormatted = formatDate(fechaHastaDate, 'dd-MM-yyyy', 'en-US');
        }
    }
    // Llamar al servicio para realizar la búsqueda
    this.activoService.getActivoBusqueda(responsable, proveedor, codinventario, modelo, marca, nroserie, fechaDesdeFormatted, fechaHastaFormatted)
      .subscribe((resp: any) => {
          this.processActivoResponse(resp);
      });
  }*/

  abrirDatepickersConFechasPorDefecto(): void {
    const fechaDesde = new Date();
    const fechaHasta = new Date();
  ///  this.myFormGroup.controls['desde'].setValue(fechaDesde);
  ///  this.myFormGroup.controls['hasta'].setValue(fechaHasta);
    this.cdr.detectChanges(); 
    ///this.pickerDesde.select(this.fechaMinima);
    ///this.pickerHasta.select(this.fechaActual);    
    (this.pickerDesde as any).select(this.fechaMinima);
    (this.pickerHasta as any).select(this.fechaActual); 
  }
  
  limpiarCampos() {
    this.myFormGroup.reset();
  }
  
  limpiarCamposC(codinventario: string, modelo: string, marca: string, nroserie: string, fechaingresoDesde: string, fechaingresoHasta: string) {
    codinventario = '';
    modelo = '';
    marca = '';
    nroserie = '';
}
 

  exportExcel(){

    this.activoService.exportActivo()
        .subscribe( (data: any) => {
          let file = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
          let fileUrl = URL.createObjectURL(file);
          var anchor = document.createElement("a");
          anchor.download = "activos.xlsx";
          anchor.href = fileUrl;
          anchor.click();

          this.openSnackBar("Archivo exportado correctamente", "Exitosa");
        }, (error: any) =>{
          this.openSnackBar("No se pudo exportar el archivo", "Error");
        })

  }

  getResponsabless(){
    this.responsableService.getResponsables()
        .subscribe( (data: any) =>{
          this.responsables = data.responsableResponse.listaresponsables;
        }, (error: any) =>{
          console.log("error al consultar responsables");
        })
  }

  getProveedores(){
    this.proveedoresService.getProveedores()
      .subscribe((data: any)=>{
        this.proveedores = data.proveedorResponse.listaproveedores;
      }, (error: any)=>{
        console.log("error al consultar proveedores");
      })
  }

}

export interface ActivoElement {
  id: number;
  responsable: any,
  proveedor:any,
  codinventario: string,
  modelo: string;
  marca: string;
  nroserie: string;
  fechaingreso: Date;
  importe: number;  
  moneda: string;
  grupo: any;
  articulo: any;
  //picture: any;
}
