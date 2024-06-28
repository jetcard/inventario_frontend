import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EspecificoService } from '../../shared/services/especifico.service';
import { EspecificosService } from '../../shared/services/especificos.service';

export interface Especifico{
  especificoid: string;
  id: number;
  nombreespecifico: string;
}

@Component({
  selector: 'app-new-especificos',
  templateUrl: './new-especificos.component.html',
  styleUrls: ['./new-especificos.component.css']
})
export class NewEspecificosComponent implements OnInit{
  
  private fb = inject(FormBuilder);
  private especificoService= inject(EspecificoService);
  
  private dialogRef= inject(MatDialogRef);
  public data = inject(MAT_DIALOG_DATA);

  private especificosService = inject(EspecificosService);

  public especificosForm!: FormGroup;

  estadoFormulario: string = "";

  especificos: Especifico[]=[];

  //selectedFile: any;
  //nameImg: string ="";

  ngOnInit(): void {
    this.getCategories();

    this.estadoFormulario = "Agregar";
    this.especificosForm = this.fb.group( {
      nombreespecifico: ['', Validators.required],
      especificoid: ['', Validators.required],
      especifico: ['', Validators.required]
      //picture: ['', Validators.required]
    })

    if (this.data != null ){
      this.updateForm(this.data);
      this.estadoFormulario = "Actualizar";
    }
  }

  onSave(){
    let data = {
      nombreespecifico: this.especificosForm.get('nombreespecifico')?.value,
      especificoid: this.especificosForm.get('especificoid')?.value,
      especificoId: this.especificosForm.get('especifico')?.value









      
      ///especifico: this.especificosForm.get('especifico')?.value
      ///especifico: this.especificosForm.get('especifico')?.value
      //picture: this.selectedFile
    }
/*
    const uploadImageData = new FormData();
    //uploadImageData.append('picture', data.picture, data.picture.name);
    uploadImageData.append('modelo', data.modelo);
    uploadImageData.append('marca', data.marca);
    uploadImageData.append('nroserie', data.nroserie);
    uploadImageData.append('nombreespecifico', data.nombreespecifico);
    uploadImageData.append('especificoid', data.especificoid);
    uploadImageData.append('moneda', data.moneda);
    uploadImageData.append('especificoId', data.especifico);

    if (this.data != null){
      //update the especificos
      this.especificosService.updateEspecificos(uploadImageData, this.data.id)
                .subscribe( (data: any) =>{
                  this.dialogRef.close(1);
                }, (error: any) => {
                  this.dialogRef.close(2);
                })
    } else {
      //call the service to save a especificos
      this.especificosService.saveEspecificos(uploadImageData)
              .subscribe( (data: any) =>{
                this.dialogRef.close(1);
              }, (error: any) => {
                this.dialogRef.close(2);
              })
    }*/
    if (this.data != null) {
      // Actualizar el especificos
      this.especificosService.updateEspecificos(data, this.data.id).subscribe(
        (data: any) => {
          this.dialogRef.close(1);
        },
        (error: any) => {
          this.dialogRef.close(2);
        }
      );
    } else {
      // Guardar un nuevo especificos
      this.especificosService.saveEspecificos(data).subscribe(
        (data: any) => {
          this.dialogRef.close(1);
        },
        (error: any) => {
          this.dialogRef.close(2);
        }
      );
    }    

  }

  onCancel(){
    this.dialogRef.close(3);
  }
 

  getCategories(){
    this.especificoService.getEspecificos()
        .subscribe( (data: any) =>{
          this.especificos = data.especificoResponse.listaespecificos;
        }, (error: any) =>{
          console.log("error al consultar especificos");
        })
  }


  /*onFileChanged(event: any){

    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile);

    this.nameImg = event.target.files[0].name;


  }*/

  updateForm(data: any){

    this.especificosForm = this.fb.group( {
      nombreespecifico: [data.nombreespecifico, Validators.required],
      especificoid: [data.especificoid, Validators.required],
      especifico: [data.especifico.id, Validators.required]
      //picture: ['', Validators.required]
    })
  }

}