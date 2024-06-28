import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmComponent } from '../../shared/components/confirm/confirm.component';
import { EspecificosService } from '../../shared/services/especificos.service';
import { UtilService } from '../../shared/services/util.service';
import { NewEspecificosComponent } from '../new-especificos/new-especificos.component';

@Component({
  selector: 'app-especificos',
  templateUrl: './especificos.component.html',
  styleUrls: ['./especificos.component.css']
})
export class EspecificosComponent implements OnInit{
  
  isAdmin: any;
  private especificosService = inject(EspecificosService);
  private snackBar = inject(MatSnackBar);
  public dialog = inject(MatDialog);
  private util = inject(UtilService);

  ngOnInit(): void {
    this.getEspecificoss();
    this.isAdmin = this.util.isAdmin();
  }

  displayedColumns: string[] = ['id', 'nombreespecifico', 'especificoid', 'actions'];
  dataSource = new MatTableDataSource<EspecificosElement>();

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  getEspecificoss(){
    this.especificosService.getEspecificoss()//getEspecificoss()
        .subscribe( (data:any) => {
          console.log("respuesta de especificoss: ", data);
          this.processEspecificosResponse(data);
        }, (error: any) => {
          console.log("error en especificoss: ", error);
        }) 
  }

  processEspecificosResponse(resp: any){
    const dateEspecificos: EspecificosElement[] = [];
     if( resp.metadata[0].code == "00"){
       let listCEspecificos = resp.especificosResponse.listaespecificoss;

       listCEspecificos.forEach((element: EspecificosElement) => {
         ///element.especifico = element.especifico.name;
         //element.picture = 'data:image/jpeg;base64,'+element.picture;
         dateEspecificos.push(element);
       });

       //set the datasource
       this.dataSource = new MatTableDataSource<EspecificosElement>(dateEspecificos);
       this.dataSource.paginator = this.paginator;
     }
  }

  openEspecificosDialog(){
    const dialogRef = this.dialog.open(NewEspecificosComponent , {
      width: '450px'
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      
      if( result == 1){
        this.openSnackBar("Especificos Agregado", "Éxito");
        this.getEspecificoss();
      } else if (result == 2) {
        this.openSnackBar("Se produjo un error al guardar especificos", "Error");
      }
    });
  }

  openSnackBar(message: string, action: string) : MatSnackBarRef<SimpleSnackBar>{
    return this.snackBar.open(message, action, {
      duration: 2000
    })

  }

  edit(id:number, especificoid:number, nombreespecifico:string){
    const dialogRef = this.dialog.open(NewEspecificosComponent , {
      width: '450px', 
      data: {id: id, nombreespecifico: nombreespecifico, especificoid: especificoid}
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      if( result == 1){
        this.openSnackBar("Especificos editado", "Éxito");
        this.getEspecificoss();
      } else if (result == 2) {
        this.openSnackBar("Se produjo un error al editar especificos", "Error");
      }
    });


  }

  delete(id: any){
    const dialogRef = this.dialog.open(ConfirmComponent , {
      width: '450px', 
      data: {id: id, module: "especificos"}
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      
      if( result == 1){
        this.openSnackBar("Especificos eliminado", "Exitosa");
        this.getEspecificoss();
      } else if (result == 2) {
        this.openSnackBar("Se produjo un error al eliminar especificos", "Error");
      }
    });
  }

  buscar(modelo: any){
    if ( modelo.length === 0){
      return this.getEspecificoss();
    }

    this.especificosService.getEspecificosByModelo(modelo)
        .subscribe( (resp: any) =>{
          this.processEspecificosResponse(resp);
        })
  }

  exportExcel(){

    this.especificosService.exportEspecificos()
        .subscribe( (data: any) => {
          let file = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
          let fileUrl = URL.createObjectURL(file);
          var anchor = document.createElement("a");
          anchor.download = "especificoss.xlsx";
          anchor.href = fileUrl;
          anchor.click();

          this.openSnackBar("Archivo exportado correctamente", "Exitosa");
        }, (error: any) =>{
          this.openSnackBar("No se pudo exportar el archivo", "Error");
        })

  }

}

export interface EspecificosElement {
  id: number;
  especificoid: number;  
  nombreespecifico: string;
  ///especifico: any;
}