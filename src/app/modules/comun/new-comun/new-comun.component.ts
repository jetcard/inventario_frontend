import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ResponsableService } from '../../shared/services/responsable.service';
import { GrupoService } from '../../shared/services/grupo.service';
import { TipoBienService } from '../../shared/services/tipobien.service';
import { ComunService } from '../../shared/services/comun.service';

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
  selector: 'app-new-comun',
  templateUrl:'./new-comun.component.html',
  styleUrls: ['./new-comun.component.css']
})
export class NewComunComponent implements OnInit{
  
  public comunForm!: FormGroup;
  private fb = inject(FormBuilder);
  private comunService = inject(ComunService);
  private responsableService=inject(ResponsableService);
  private grupoService= inject(GrupoService);
  private tipoService=inject(TipoBienService);
  
  private dialogRef= inject(MatDialogRef);
  public data = inject(MAT_DIALOG_DATA);

  responsables: Responsable[]=[];
  tipos: TipoBien[]=[];
  grupos: Grupo[]=[];

  estadoFormulario: string = "";
  idAlfanumerico: string = "";

  ngOnInit(): void {    
    if (this.data != null) {
      this.updateForm(this.data);
      this.estadoFormulario = "Actualizar";
    } else {
      this.generateNewIdAlfanumerico();
      this.estadoFormulario = "Agregar";
    }
    this.getResponsabless();
    this.getCategories();
    this.getTiposs();
    this.initializeForm();
  }

  initializeForm() {
    this.comunForm = this.fb.group( {
      idAlfanumerico: [{ value: '', disabled: true }],
      responsable: ['', Validators.required],
      tipo: ['', Validators.required],
      grupo: ['', Validators.required],
      descripcomun: ['', Validators.required],
      descripcortacomun: ['', Validators.required]
    });
  }

  async generateNewIdAlfanumerico() {
    this.comunService.getComunes().subscribe((response: any) => {
      if (response.metadata[0].code === "00") {
        const listComun = response.comunResponse.listacomunes;
        const newId = listComun.length + 1;
        this.idAlfanumerico = `COM${newId}`;
        this.comunForm.get('idAlfanumerico')?.setValue(this.idAlfanumerico);
      } else {
        console.error('Error fetching comunes to generate ID');
        this.idAlfanumerico = 'COM1';
        this.comunForm.get('idAlfanumerico')?.setValue(this.idAlfanumerico);
      }
    }, error => {
      console.error('Error fetching comunes to generate ID', error);
      this.idAlfanumerico = 'COM1';
      this.comunForm.get('idAlfanumerico')?.setValue(this.idAlfanumerico);
    });
  }

  onSave(){
    let data = {
      responsableId: this.comunForm.get('responsable')?.value,
      tipoId: this.comunForm.get('tipo')?.value,
      grupoId: this.comunForm.get('grupo')?.value,
      descripcomun: this.comunForm.get('descripcomun')?.value,
      descripcortacomun: this.comunForm.get('descripcortacomun')?.value
    }
    if (this.data != null ){
      this.comunService.updateComun(data, this.data.id)
              .subscribe( (data: any) =>{
                this.dialogRef.close(1);
              }, (error:any) =>{
                this.dialogRef.close(2);
              })
    } else {
      //create new registry
      this.comunService.saveComun(data)
          .subscribe( (data : any) => {
            console.log(data);
            this.dialogRef.close(1);
          }, (error: any) => {
            this.dialogRef.close(2);
          })
    }
  }  

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


  /*onFileChanged(event: any){

    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile);

    this.nameImg = event.target.files[0].name;


  }*/
/*
  updateForm(data: any){
    this.comunForm = this.fb.group( {
      responsable: [data.responsable.id, Validators.required],
      tipo: [data.tipo.id, Validators.required],
      grupo: [data.grupo.id, Validators.required],
      descripcomun: [data.descripcomun.id, Validators.required],
      descripcortacomun: [data.descripcortacomun.id, Validators.required]
      //picture: ['', Validators.required]
    })
  }*/

  updateForm(data: any) {
    this.idAlfanumerico = `GRU${data.id}`;
    this.comunForm.setValue({
      idAlfanumerico: this.idAlfanumerico,
      responsable: [data.responsable.id, Validators.required],
      tipo: [data.tipo.id, Validators.required],      
      grupo: [data.grupo.id, Validators.required],
      descripcomun: data.descripcomun,
      descripcortacomun: data.descripcortacomun
    });
  }  

}
