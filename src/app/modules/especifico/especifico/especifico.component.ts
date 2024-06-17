import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmComponent } from '../../shared/components/confirm/confirm.component';
import { EspecificoService } from '../../shared/services/especifico.service';
import { UtilService } from '../../shared/services/util.service';
import { NewEspecificoComponent } from '../new-especifico/new-especifico.component';
import { ProveedorService } from '../../shared/services/proveedor.service';

export interface Proveedor{
  id: number;
  ruc: string;
  razonsocial: string;
}

@Component({
  selector: 'app-especifico',
  templateUrl: './especifico.component.html',
  styleUrls: ['./especifico.component.css']
})
export class EspecificoComponent implements OnInit {

  isAdmin: any;
  especificos: any[] = [];
  ///especificoForm: FormGroup;
  public proveedores: Proveedor[]=[];
  //public myFormGroup!: FormGroup;
  //myFormGroup: FormGroup;
  private formBuilder = inject(FormBuilder);///
  private fb = inject(FormBuilder);
  private especificoService = inject(EspecificoService);
  private util = inject(UtilService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private proveedorService=inject(ProveedorService);
  /*
  constructor(
    private fb: FormBuilder,
    private especificoService: EspecificoService,
    private util: UtilService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.especificoForm = this.fb.group({
      especificos: new FormControl(''),
      responsable: [''],
      articulo: [''],      
    });
  }*/

  ngOnInit(): void {
    /*this.especificoForm = this.fb.group({
      responsable: [''],
      articulo: [''],
    });*/
    this.isAdmin = this.util.isAdmin();
    this.muestraTabla();
    this.muestraComboProveedores();
  }

  //displayedColumns: string[] = ['id', 'responsable', 'articulo', 'tipo', 'grupo', 'especificos', 'actions'];
  displayedColumns: string[] = ['id', 'responsable', 
    //'proveedor', 
    'tipo', 'grupo', 'articulo', 'codinventario', 
    'modelo', 'marca', 'nroserie', 
    'fechaingresostr', 
    'moneda', 'importe', 'actions'];
    
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  muestraTabla() {
    this.especificoService.getEspecificos()
      .subscribe(
        (data: any) => {
          console.log("respuesta de especificos: ", data);
          this.processEspecificoResponse(data);
        },
        (error: any) => {
          console.log("error en especificos: ", error);
        }
      );
  }

  processEspecificoResponse(resp: any){
    const dateEspecifico: EspecificoElement[] = [];
     if( resp.metadata[0].code == "00"){
       let listCActivo = resp.especificoResponse.listaespecificos;
       listCActivo.forEach((element: EspecificoElement) => {
         ///element.grupo = element.grupo.name;
         //element.picture = 'data:image/jpeg;base64,'+element.picture;
         dateEspecifico.push(element);
       });
       //set the datasource
       this.dataSource = new MatTableDataSource<EspecificoElement>(dateEspecifico);
       this.dataSource.paginator = this.paginator;
     }
  }

/*
  processEspecificoResponseSB(resp: any) {
    if (resp.metadata[0].code == "00") {
      const dataEspecifico = resp.especificoResponse.listaespecificos.map((element: any) => ({
        id: element.id,
        responsable: element.responsable.arearesponsable,
        articulo: element.articulo.nombrearticulo,
        especificos: element.especificos.map((attr: any) => ({
          id: attr.id,
          nombreespecifico: attr.nombreespecifico
        }))
      }));

      this.especificos = dataEspecifico;
      this.dataSource.data = dataEspecifico;
      this.dataSource.paginator = this.paginator;
    }
  }*/

  openEspecificoDialog(): void {
    const dialogRef = this.dialog.open(NewEspecificoComponent, {
      width: '850px'
    });
  
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result === 1) {
        this.openSnackBar("Especifico Agregado", "Éxito");
        this.muestraTabla();
      } else if (result === 2) {
        this.openSnackBar("Se produjo un error al guardar especifico", "Error");
      }
    });
  }
  
  edit(id: number, responsable: any, articulo: any, tipo: any, grupo:any, especificos: any): void {
    const dialogRef = this.dialog.open(NewEspecificoComponent, {
      width: '450px',
      data: { id: id, 
        responsable: responsable, 
        articulo: articulo,
        tipo: tipo, 
        grupo:grupo, 
        especificos: especificos }
    });
  
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result === 1) {
        this.openSnackBar("Especifico editado", "Éxito");
        this.muestraTabla();
      } else if (result === 2) {
        this.openSnackBar("Se produjo un error al editar especifico", "Error");
      }
    });
  }
  
  openSnackBar(message: string, action: string): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 2000
    });
  }
  /*
  edit(id: number, responsable: any, articulo: any, especificos: any) {
    const dialogRef = this.dialog.open(NewEspecificoComponent, {
      width: '450px',
      data: { id: id, responsable: responsable, articulo: articulo, especificos: especificos }
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
      data: { id: id, module: "especifico" }
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 1) {
        this.openSnackBar("Especifico eliminado", "Exitosa");
        this.muestraTabla();
      } else if (result == 2) {
        this.openSnackBar("Se produjo un error al eliminar especifico", "Error");
      }
    });
  }

  buscar(modelo: any) {
    if (modelo.length === 0) {
      return this.muestraTabla();
    }

    this.especificoService.getEspecificoByModelo(modelo)
      .subscribe(
        (resp: any) => {
          this.processEspecificoResponse(resp);
        },
        (error: any) => {
          console.error("Error al buscar especifico por modelo", error);
        }
      );
  }

  exportExcel() {
    this.especificoService.exportEspecifico()
      .subscribe(
        (data: any) => {
          let file = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          let fileUrl = URL.createObjectURL(file);
          var anchor = document.createElement("a");
          anchor.download = "especificos.xlsx";
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

    muestraComboProveedores(){
      this.proveedorService.getProveedores()
        .subscribe((data: any)=>{
          this.proveedores = data.proveedorResponse.listaproveedores;
        }, (error: any)=>{
          console.log("error al consultar proveedores");
        })
    }

}
export interface EspecificoElement {
  id: number;
  responsable: any;
  articulo: any;
  tipo: any;
  grupo: any;
  proveedor:any,
  codinventario: string,
  modelo: string;
  marca: string;
  nroserie: string;
  fechaingresostr: string;
  fechaingreso: Date;
  importe: number;  
  moneda: string;  
  especificos: any;
  }
