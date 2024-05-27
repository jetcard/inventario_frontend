import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ResponsableService } from '../../shared/services/responsable.service';
import { GrupoService } from '../../shared/services/grupo.service';
import { ArticuloService } from '../../shared/services/articulo.service';
import { TipoBienService } from '../../shared/services/tipobien.service';
import { ActivoService } from '../../shared/services/activo.service';
import { MatDatepickerIntl } from '@angular/material/datepicker';

///import * as moment from 'moment';

// Clase para personalizar el formato de fecha del datepicker
export class CustomMatDatepickerIntl extends MatDatepickerIntl {
  // Sobrescribe el método para establecer el formato deseado
  // en este caso, dd/MM/yyyy
  getDateFormat(): string {
    //return 'yyyy-MM-dd';
    return 'dd/MM/yyyy';
  }
}

export interface Responsable{
  nombresyapellidos: string;
  id: number;
  arearesponsable: string;
}
export interface Grupo{
  descripgrupo: string;
  id: number;
  nombregrupo: string;
}
export interface TipoBien{
  descriptipo: string;
  id: number;
  nombretipo: string;
}
export interface Articulo{
  descriparticulo: string;
  id: number;
  nombrearticulo: string;
}
@Component({
  selector: 'app-new-activo',
  templateUrl: './new-activo.component.html',
  styleUrls: ['./new-activo.component.css'],
  providers: [
    { provide: MatDatepickerIntl, useClass: CustomMatDatepickerIntl }
  ]  
})
export class NewActivoComponent implements OnInit{

  private responsableService=inject(ResponsableService);
  private grupoService= inject(GrupoService);
  private tipoService=inject(TipoBienService);
  private articuloService=inject(ArticuloService);
  
///  private dialogRef = inject(MatDialogRef<NewActivoComponent>);
  
  responsables: Responsable[]=[];
  grupos: Grupo[]=[];
  tipos: TipoBien[]=[];
  articulos: Articulo[]=[];
  //selectedFile: any;
  //nameImg: string ="";
  public activoForm!: FormGroup;
  private fb = inject(FormBuilder);
  private activoService = inject(ActivoService);
  private dialogRef= inject(MatDialogRef);
  public data = inject(MAT_DIALOG_DATA);
  estadoFormulario: string = "";
  idAlfanumerico: string = "";

  ngOnInit(): void {
    this.initializeForm();

    /*this.getResponsabless();
    this.getCategories();
    this.getTiposs();
    this.getArticuloss();*/
    
    ///this.estadoFormulario = this.data ? "Actualizar" : "Agregar";
    ///this.initForm();

    /*this.estadoFormulario = "Agregar";
    this.activoForm = this.fb.group( {
      codinventario: ['', Validators.required],
      modelo: ['', Validators.required],
      marca: ['', Validators.required],
      nroserie: ['', Validators.required],
      fechaingreso: ['', Validators.required],
      importe: ['', Validators.required],
      moneda: ['', Validators.required],
      responsable: ['', Validators.required],
      grupo: ['', Validators.required],
      tipo: ['', Validators.required],
      articulo:['', Validators.required]
      //picture: ['', Validators.required]
    })*/

    /*if (this.data != null ){
      this.updateForm(this.data);
      this.estadoFormulario = "Actualizar";
    }*/
    /*if (this.data) {
      this.updateForm(this.data);
    }*/

    

    if (this.data != null) {
      this.updateForm(this.data);
      this.estadoFormulario = "Actualizar";
    } else {
      this.estadoFormulario = "Agregar";
      // Generate the alphanumeric ID for new records
      this.generateNewIdAlfanumerico();
    }    
  }

  async generateNewIdAlfanumerico() {
    this.activoService.getActivos().subscribe((response: any) => {
      if (response.metadata[0].code === "00") {
        const listGrupo = response.activoResponse.listaactivos;
        const newId = listGrupo.length + 1;
        this.idAlfanumerico = `ACT${newId}`;
        this.activoForm.get('idAlfanumerico')?.setValue(this.idAlfanumerico);
      } else {
        console.error('Error fetching groups to generate ID');
        this.idAlfanumerico = 'ACT1';
        this.activoForm.get('idAlfanumerico')?.setValue(this.idAlfanumerico);
      }
    }, error => {
      console.error('Error fetching groups to generate ID', error);
      this.idAlfanumerico = 'ACT1';
      this.activoForm.get('idAlfanumerico')?.setValue(this.idAlfanumerico);
    });
  }    

  /*initializeForm() {
    this.activoForm = this.fb.group({
      idAlfanumerico: [{ value: '', disabled: true }],
      codinventario: ['', Validators.required],
      modelo: ['', Validators.required],
      marca: ['', Validators.required],
      nroserie: ['', Validators.required],
      fechaingreso: ['', Validators.required],
      importe: ['', Validators.required],
      moneda: ['', Validators.required],
      responsable: ['', Validators.required],
      grupo: ['', Validators.required],
      tipo: ['', Validators.required],
      articulo: ['', Validators.required]
    });
  }*/

  initializeForm() {
    this.activoForm = this.fb.group({
      idAlfanumerico: [{ value: '', disabled: true }],
      codinventario: ['', Validators.required],
      modelo: ['', Validators.required],
      marca: ['', Validators.required],
      nroserie: ['', Validators.required],
      fechaingreso: ['', Validators.required],
      importe: ['', Validators.required],
      moneda: ['', Validators.required],
      responsable: ['', Validators.required], // Aquí se define el control 'responsable'
      grupo: ['', Validators.required],
      tipo: ['', Validators.required],
      articulo: ['', Validators.required]
    });
  }  

  onSave(){
    let fechaingreso = this.activoForm.get('fechaingreso')?.value;
    if (fechaingreso) {
      //fechaingreso = moment(fechaingreso).format('YYYY-MM-DD');
      fechaingreso = fechaingreso.toISOString().substring(0, 10);
    } else {
      fechaingreso = null;
    }   
    let data = {
      codinventario: this.activoForm.get('codinventario')?.value,
      modelo: this.activoForm.get('modelo')?.value,
      marca: this.activoForm.get('marca')?.value,
      nroserie: this.activoForm.get('nroserie')?.value,
      //fechaingreso: moment(this.activoForm.get('fechaingreso')?.value).format('YYYY-MM-DD'),
      fechaingreso: fechaingreso,
      importe: this.activoForm.get('importe')?.value,
      moneda: this.activoForm.get('moneda')?.value,
      responsableId: this.activoForm.get('responsable')?.value,
      grupoId: this.activoForm.get('grupo')?.value,
      tipoId: this.activoForm.get('tipo')?.value,
      articuloId: this.activoForm.get('articulo')?.value
      ///grupo: this.activoForm.get('grupo')?.value
      //picture: this.selectedFile
    }
    
/*
    const uploadImageData = new FormData();
    //uploadImageData.append('picture', data.picture, data.picture.name);
    uploadImageData.append('modelo', data.modelo);
    uploadImageData.append('marca', data.marca);
    uploadImageData.append('nroserie', data.nroserie);
    uploadImageData.append('fechaingreso', data.fechaingreso);
    uploadImageData.append('importe', data.importe);
    uploadImageData.append('moneda', data.moneda);
    uploadImageData.append('grupoId', data.grupo);

    if (this.data != null){
      //update the activo
      this.activoService.updateActivo(uploadImageData, this.data.id)
                .subscribe( (data: any) =>{
                  this.dialogRef.close(1);
                }, (error: any) => {
                  this.dialogRef.close(2);
                })
    } else {
      //call the service to save a activo
      this.activoService.saveActivo(uploadImageData)
              .subscribe( (data: any) =>{
                this.dialogRef.close(1);
              }, (error: any) => {
                this.dialogRef.close(2);
              })
    }*/
    //if (this.data) {
    if (this.data != null) {
      // Actualizar el activo
      this.activoService.updateActivo(data, this.data.id).subscribe(
        (data: any) => {
          this.dialogRef.close(1);
        },
        (error: any) => {
          this.dialogRef.close(2);
        }
      )
    } else {
      // Guardar un nuevo activo
      this.activoService.saveActivo(data).subscribe(
        (data: any) => {
          this.dialogRef.close(1);
        },
        (error: any) => {
          this.dialogRef.close(2);
        }
      )
    } 
    ///this.logJsonValue();   
  }
/*
  logJsonValue() {
    console.log(this.getJsonValue());
  }
*/
  onCancel(){
    this.dialogRef.close(3);
  }

  getResponsabless(){
    this.responsableService.getResponsables()
        .subscribe( (data: any) =>{
          this.responsables = data.responsableResponse.listaresponsables;
        }, (error: any) =>{
          console.log("error al consultar responsables");
        })
  }  

  getCategories(){
    this.grupoService.getGrupos()
        .subscribe( (data: any) =>{
          this.grupos = data.grupoResponse.listagrupos;
        }, (error: any) =>{
          console.log("error al consultar grupos");
        })
  }

  getTiposs(){
    this.tipoService.getTipoBienes()
        .subscribe( (data: any) =>{
          this.tipos = data.tipoResponse.listatipos;
        }, (error: any) =>{
          console.log("error al consultar tipos");
        })
  }    

  getArticuloss(){
    this.articuloService.getArticulos()
        .subscribe( (data: any) =>{
          this.articulos = data.articuloResponse.listaarticulos;
        }, (error: any) =>{
          console.log("error al consultar articulos");
        })
  }  

  /*updateForm(data: any) {
    if (data && data.responsable && data.responsable.id &&
        data.grupo && data.grupo.id && data.articulo && data.articulo.id) {
      this.activoForm = this.fb.group({
        modelo: [data.modelo, Validators.required],
        marca: [data.marca, Validators.required],
        nroserie: [data.nroserie, Validators.required],
        fechaingreso: [data.fechaingreso, Validators.required],
        importe: [data.importe, Validators.required],
        moneda: [data.moneda, Validators.required],
        responsable: [data.responsable.id, Validators.required],
        grupo: [data.grupo.id, Validators.required],
        tipo: [data.tipo.id, Validators.required],
        articulo: [data.articulo.id, Validators.required]
      });
    } else {
      console.error("El objeto 'data' no tiene la estructura esperada.");
    }
  }*/
  
  
  updateForm(data: any) {
    this.idAlfanumerico = `ACT${data.id}`;
    this.activoForm.setValue({
      idAlfanumerico: this.idAlfanumerico,
      codinventario: data.codinventario,
      modelo: data.modelo,
      marca: data.marca,
      nroserie: data.nroserie,
      fechaingreso: data.fechaingreso,
      importe: data.importe,
      moneda: data.moneda,
      responsable: data.responsable,
      grupo: data.grupo,
      tipo: data.tipo,
      articulo: data.articulo
    });    
  }  

  /*onFileChanged(event: any){

    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile);

    this.nameImg = event.target.files[0].name;


  }*/

  /*updateForm(data: any){

    this.activoForm = this.fb.group( {
      modelo: [data.modelo, Validators.required],
      marca: [data.marca, Validators.required],
      nroserie: [data.nroserie, Validators.required],
      fechaingreso: [data.fechaingreso, Validators.required],
      importe: [data.importe, Validators.required],
      moneda: [data.moneda, Validators.required],
      responsable: [data.responsable.id, Validators.required],
      grupo: [data.grupo.id, Validators.required],
      tipo: [data.tipo.id, Validators.required],
      articulo: [data.articulo.id, Validators.required]
      //picture: ['', Validators.required]
    })
  }*/

/*  getJsonValue() {
    return {
      modelo: this.activoForm.get('modelo')?.value,
      marca: this.activoForm.get('marca')?.value,
      nroserie: this.activoForm.get('nroserie')?.value,
      //fechaingreso: moment(this.activoForm.get('fechaingreso')?.value),
      fechaingreso: this.activoForm.get('fechaingreso')?.value,
      importe: this.activoForm.get('importe')?.value,
      moneda: this.activoForm.get('moneda')?.value,
      responsableId: this.activoForm.get('responsable')?.value,
      grupoId: this.activoForm.get('grupo')?.value,
      tipoId: this.activoForm.get('tipo')?.value,
      articuloId: this.activoForm.get('articulo')?.value
    };
  }  */

}
