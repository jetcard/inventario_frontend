import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmComponent } from '../../shared/components/confirm/confirm.component';
import { AtributoService } from '../../shared/services/atributo.service';
import { UtilService } from '../../shared/services/util.service';
import { NewAtributoComponent } from '../new-atributo/new-atributo.component';
import { AtributosService } from '../../shared/services/atributos.service';

export interface Atributos {
  id: number;
  atributoid: number;  
  nombreatributo: string;
  ///atributo: any;
}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   

@Component({
  selector: 'app-atributo',
  templateUrl: './atributo.component.html',
  styleUrls: ['./atributo.component.css']
})
export class AtributoComponent implements OnInit{

  private atributosService=inject(AtributosService);
  isAdmin: any;
  private atributoService = inject(AtributoService);
  private snackBar = inject(MatSnackBar);
  public dialog = inject(MatDialog);
  private util = inject(UtilService);
  atributos: Atributos[]=[];

  ngOnInit(): void {
    this.getAtributoMaestro();
    this.isAdmin = this.util.isAdmin();
    this.getAtributos();
  }

  displayedColumns: string[] = ['id', 'responsable', 'articulo', 'atributos',  'actions'];
  
  dataSource = new MatTableDataSource<AtributoElement>();

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  getAtributoMaestro(){
    this.atributoService.getAtributos()
        .subscribe( (data:any) => {
          console.log("respuesta de maestro atributos: ", data);
          this.processAtributoResponse(data);
        }, (error: any) => {
          console.log("error en atributos: ", error);
        }) 
  }
  getAtributos(){
    this.atributosService.getAtributoss()
        .subscribe( (data: any) =>{
          console.log("respuesta de atributos varios: ", data);
          this.atributos = data.atributosResponse.listaatributos;
        }, (error: any) =>{
          console.log("error al consultar atributos");
        })
  }
  /*processAtributoResponse(response: any) {
    if (!response || !response.data) {
      console.error('La respuesta no tiene los datos esperados:', response);
      return;
    }
  
    response.data.forEach((item: any) => {
      // Asegúrate de que item y item.propiedades existen antes de usar map
      if (item && item.propiedades) {
        item.propiedades.map((propiedad: any) => {
          // Procesa cada propiedad como sea necesario
          console.log(propiedad);
        });
      } else {
        console.warn('El item o sus propiedades están undefined:', item);
      }
    });
  }*/
  
  processAtributoResponsenn(resp: any) {
    const dataAtributo: AtributoElement[] = [];
    if (resp.metadata[0].code === "00") {
        let listCAtributo = resp.atributoResponse.listaatributos;

        listCAtributo.forEach((element: any) => {
            const atributos = element.atributos.map((attr: any) => ({
                id: attr.id,
                nombreatributo: attr.nombreatributo
            }));
            
            console.log("Atributos cargados:", atributos);

            dataAtributo.push({
                id: element.id,
                responsable: element.responsable.arearesponsable,
                articulo: element.articulo.nombrearticulo,
                atributos: atributos
            });
        });

        this.dataSource = new MatTableDataSource<AtributoElement>(dataAtributo);
        this.dataSource.paginator = this.paginator;
    }
}

  processAtributoResponsexxxx(resp: any) {
    const dataAtributo: AtributoElement[] = [];
    if (resp.metadata[0].code == "00") {
        let listCAtributo = resp.atributoResponse.listaatributos;

        listCAtributo.forEach((element: any) => {
            const atributos = element.atributos.map((attr: any) => ({
                id: attr.id,
                nombreatributo: attr.nombreatributo
            }));
            
            console.log("Atributos cargados:", atributos);

            dataAtributo.push({
                id: element.id,
                responsable: element.responsable.arearesponsable,
                articulo: element.articulo.nombrearticulo,
                atributos: atributos
            });
        });

        this.dataSource = new MatTableDataSource<AtributoElement>(dataAtributo);
        this.dataSource.paginator = this.paginator;
    }
  }


  processAtributoResponseYYY(resp: any) {
    const dataAtributo: AtributoElement[] = [];
    if (resp.metadata[0].code == "00") {
      let listCAtributo = resp.atributoResponse.listaatributos;

      listCAtributo.forEach((element: any) => {
        const atributos = element.atributos.map((attr: any) => ({
          id: attr.id,
          nombreatributo: attr.nombreatributo
        }));

        dataAtributo.push({
          id: element.id,
          responsable: element.responsable.arearesponsable,
          articulo: element.articulo.nombrearticulo,
          atributos: atributos
        });
      });

      this.dataSource = new MatTableDataSource<AtributoElement>(dataAtributo);
      this.dataSource.paginator = this.paginator;
    }
  }  
/** */
  processAtributoResponse(resp: any){
    const dataAtributo: AtributoElement[] = [];
     if( resp.metadata[0].code == "00"){
       let listCAtributo = resp.atributoResponse.listaatributos;

       listCAtributo.forEach((element: AtributoElement) => {
        element.responsable = element.responsable.arearesponsable
        element.articulo = element.articulo.nombrearticulo
        ///element.atributos = element.atributos;
        //element.atributos = element.atributos
         dataAtributo.push(element);
       });
       this.dataSource = new MatTableDataSource<AtributoElement>(dataAtributo);
       this.dataSource.paginator = this.paginator;
     }
  }
/**/
  openAtributoDialog(){
    const dialogRef = this.dialog.open(NewAtributoComponent , {
      width: '450px'
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      
      if( result == 1){
        this.openSnackBar("Atributo Agregado", "Éxito");
        this.getAtributoMaestro();
      } else if (result == 2) {
        this.openSnackBar("Se produjo un error al guardar atributo", "Error");
      }
    });
  }

  openSnackBar(message: string, action: string) : MatSnackBarRef<SimpleSnackBar>{
    return this.snackBar.open(message, action, {
      duration: 2000
    })

  }

  edit(id:number, responsable: any, articulo: any, atributos: any){
    const dialogRef = this.dialog.open(NewAtributoComponent , {
      width: '450px', 
      data: {id: id, responsable: responsable, articulo: articulo, atributos: atributos}
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      if( result == 1){
        this.openSnackBar("Atributo editado", "Éxito");
        this.getAtributoMaestro();
      } else if (result == 2) {
        this.openSnackBar("Se produjo un error al editar atributo", "Error");
      }
    });


  }

  delete(id: any){
    const dialogRef = this.dialog.open(ConfirmComponent , {
      width: '450px', 
      data: {id: id, module: "atributo"}
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      
      if( result == 1){
        this.openSnackBar("Atributo eliminado", "Exitosa");
        this.getAtributoMaestro();
      } else if (result == 2) {
        this.openSnackBar("Se produjo un error al eliminar atributo", "Error");
      }
    });
  }

  buscar(modelo: any){
    if ( modelo.length === 0){
      return this.getAtributoMaestro();
    }

    this.atributoService.getAtributoByModelo(modelo)
        .subscribe( (resp: any) =>{
          this.processAtributoResponse(resp);
        })
  }

  exportExcel(){

    this.atributoService.exportAtributo()
        .subscribe( (data: any) => {
          let file = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
          let fileUrl = URL.createObjectURL(file);
          var anchor = document.createElement("a");
          anchor.download = "atributos.xlsx";
          anchor.href = fileUrl;
          anchor.click();

          this.openSnackBar("Archivo exportado correctamente", "Exitosa");
        }, (error: any) =>{
          this.openSnackBar("No se pudo exportar el archivo", "Error");
        })

  }
/*
  onAtributoChange(newAtributo: number, element: AtributoElement) {
    element.atributos = element.atributos.map(attr => attr.id === newAtributo ? { ...attr, id: newAtributo } : attr);
    // servicio para actualizar el atributo en el backend si es necesario
  }*/
  
  onAtributoChange(newAtributo: number, element: AtributoElement) {
    // Encuentra el atributo correspondiente y actualiza su ID
    const atributo = this.atributos.find(attr => attr.id === newAtributo);
    if (atributo) {
      element.atributos = [{
        id: atributo.id,
        nombreatributo: atributo.nombreatributo
      }];
      console.log("Atributo actualizado:", element);
      // Aquí puedes hacer una llamada al servicio para actualizar el atributo en el backend si es necesario
      /*this.atributoService.updateAtributo(element).subscribe(
        response => {
          this.openSnackBar("Atributo actualizado con éxito", "Éxito");
        },
        error => {
          this.openSnackBar("Error al actualizar el atributo", "Error");
        }
      );*/
    }
  }
 
}

export interface AtributoElement {
  id: number;
  responsable: any;
  articulo: any;
  atributos: any;
  //atributos: { id: number; nombreatributo: string }[];
}
