import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmComponent } from '../../shared/components/confirm/confirm.component';
import { AtributoService } from '../../shared/services/atributo.service';
import { UtilService } from '../../shared/services/util.service';
import { NewAtributoComponent } from '../new-atributo/new-atributo.component';

@Component({
  selector: 'app-atributo',
  templateUrl: './atributo.component.html',
  styleUrls: ['./atributo.component.css']
})
export class AtributoComponent implements OnInit {

  isAdmin: any;
  atributos: any[] = [];
  atributoForm: FormGroup;

  //public myFormGroup!: FormGroup;
  //myFormGroup: FormGroup;
  private formBuilder = inject(FormBuilder);///
  
  constructor(
    private fb: FormBuilder,
    private atributoService: AtributoService,
    private util: UtilService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.atributoForm = this.fb.group({
      atributos: new FormControl(''),
      responsable: [''],
      articulo: [''],      
    });
  }

  ngOnInit(): void {
    /*this.atributoForm = this.fb.group({
      responsable: [''],
      articulo: [''],
    });*/
    this.isAdmin = this.util.isAdmin();
    this.muestraTabla();
  }

  displayedColumns: string[] = ['id', 'responsable', 'articulo', 'atributos', 'actions'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  muestraTabla() {
    this.atributoService.getAtributos()
      .subscribe(
        (data: any) => {
          console.log("respuesta de atributos: ", data);
          this.processAtributoResponse(data);
        },
        (error: any) => {
          console.log("error en atributos: ", error);
        }
      );
  }

  
  processAtributoResponse(resp: any){
    const dateAtributo: AtributoElement[] = [];
     if( resp.metadata[0].code == "00"){
       let listCActivo = resp.atributoResponse.listaatributos;
       listCActivo.forEach((element: AtributoElement) => {
         ///element.grupo = element.grupo.name;
         //element.picture = 'data:image/jpeg;base64,'+element.picture;
         dateAtributo.push(element);
       });
       //set the datasource
       this.dataSource = new MatTableDataSource<AtributoElement>(dateAtributo);
       this.dataSource.paginator = this.paginator;
     }
  }


  processAtributoResponseSB(resp: any) {
    if (resp.metadata[0].code == "00") {
      const dataAtributo = resp.atributoResponse.listaatributos.map((element: any) => ({
        id: element.id,
        responsable: element.responsable.arearesponsable,
        articulo: element.articulo.nombrearticulo,
        atributos: element.atributos.map((attr: any) => ({
          id: attr.id,
          nombreatributo: attr.nombreatributo
        }))
      }));

      this.atributos = dataAtributo;
      this.dataSource.data = dataAtributo;
      this.dataSource.paginator = this.paginator;
    }
  }

  openAtributoDialog(): void {
    const dialogRef = this.dialog.open(NewAtributoComponent, {
      width: '450px'
    });
  
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result === 1) {
        this.openSnackBar("Atributo Agregado", "Éxito");
        this.muestraTabla();
      } else if (result === 2) {
        this.openSnackBar("Se produjo un error al guardar atributo", "Error");
      }
    });
  }
  
  edit(id: number, responsable: any, articulo: any, atributos: any): void {
    const dialogRef = this.dialog.open(NewAtributoComponent, {
      width: '450px',
      data: { id: id, responsable: responsable, articulo: articulo, atributos: atributos }
    });
  
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result === 1) {
        this.openSnackBar("Atributo editado", "Éxito");
        this.muestraTabla();
      } else if (result === 2) {
        this.openSnackBar("Se produjo un error al editar atributo", "Error");
      }
    });
  }
  
  openSnackBar(message: string, action: string): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 2000
    });
  }
  /*
  edit(id: number, responsable: any, articulo: any, atributos: any) {
    const dialogRef = this.dialog.open(NewAtributoComponent, {
      width: '450px',
      data: { id: id, responsable: responsable, articulo: articulo, atributos: atributos }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 1) {
        this.openSnackBar("Atributo editado", "Éxito");
        this.getAtributoMaestro();
      } else if (result == 2) {
        this.openSnackBar("Se produjo un error al editar atributo", "Error");
      }
    });
  }*/

  delete(id: any) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '450px',
      data: { id: id, module: "atributo" }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 1) {
        this.openSnackBar("Atributo eliminado", "Exitosa");
        this.muestraTabla();
      } else if (result == 2) {
        this.openSnackBar("Se produjo un error al eliminar atributo", "Error");
      }
    });
  }

  buscar(modelo: any) {
    if (modelo.length === 0) {
      return this.muestraTabla();
    }

    this.atributoService.getAtributoByModelo(modelo)
      .subscribe(
        (resp: any) => {
          this.processAtributoResponse(resp);
        },
        (error: any) => {
          console.error("Error al buscar atributo por modelo", error);
        }
      );
  }

  exportExcel() {
    this.atributoService.exportAtributo()
      .subscribe(
        (data: any) => {
          let file = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          let fileUrl = URL.createObjectURL(file);
          var anchor = document.createElement("a");
          anchor.download = "atributos.xlsx";
          anchor.href = fileUrl;
          anchor.click();
          this.openSnackBar("Archivo exportado correctamente", "Exitosa");
        },
        (error: any) => {
          this.openSnackBar("No se pudo exportar el archivo", "Error");
        }
      );
  }

  /*onAtributoChange(newAtributo: number, element: any) {
    // Implementar servicio para actualizar el atributo en el backend si es necesario
  }*/

}
export interface AtributoElement {
  id: number;
  responsable: any;
  articulo: any;
  atributos: any;
  }
