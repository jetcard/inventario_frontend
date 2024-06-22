import { Component, Inject, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ArticuloService } from 'src/app/modules/shared/services/articulo.service';

@Component({
  selector: 'app-new-articulo',
  templateUrl: './new-articulo.component.html',
  styleUrls: ['./new-articulo.component.css']
})
export class NewArticuloComponent implements OnInit{

  public articuloForm!: FormGroup;
  private fb = inject(FormBuilder);
  private articuloService= inject(ArticuloService);
  private dialogRef= inject(MatDialogRef);
  public data = inject(MAT_DIALOG_DATA);
  estadoFormulario: string = "";
  idAlfanumerico: string = "";
  public isLoading = false;

  ngOnInit(): void {
    this.initializeForm();
    if (this.data != null ){
      this.updateForm(this.data);
      this.estadoFormulario = "Actualizar";
    } else {
      this.generateNewIdAlfanumerico();
      this.estadoFormulario = "Agregar";
    }
  }

  initializeForm() {
    this.articuloForm = this.fb.group({
      idAlfanumerico: [{ value: '', disabled: true }],
      nombrearticulo: ['', Validators.required],
      descriparticulo: ['', Validators.required]
    });
  }

  async generateNewIdAlfanumerico() {
    this.isLoading = true;//this.toggleLoader(true);
    this.articuloService.getArticulos().subscribe((response: any) => {
      if (response.metadata[0].code === "00") {
        const listArticulo = response.articuloResponse.listaarticulos;
        const newId = listArticulo.length + 1;
        this.idAlfanumerico = `ART${newId}`;
        this.articuloForm.get('idAlfanumerico')?.setValue(this.idAlfanumerico);
      } else {
        console.error('Error fetching artículos to generate ID');
        this.idAlfanumerico = 'ART1';
        this.articuloForm.get('idAlfanumerico')?.setValue(this.idAlfanumerico);
      }
    }, error => {
      console.error('Error fetching artículos to generate ID', error);
      this.idAlfanumerico = 'ART1';
      this.articuloForm.get('idAlfanumerico')?.setValue(this.idAlfanumerico);
    }).add(() => {
      this.isLoading = true;//this.toggleLoader(false); // Detener loader al finalizar
    });
  }  

  onSave(){
    this.isLoading = true;//this.toggleLoader(true);
    let data = {
      nombrearticulo: this.articuloForm.get('nombrearticulo')?.value,
      descriparticulo: this.articuloForm.get('descriparticulo')?.value
    }

    if (this.data != null ){
      //update registry
      this.articuloService.updateArticulo(data, this.data.id)
          .subscribe( (data: any) =>{
            this.dialogRef.close(1);
          }, (error:any) =>{
            this.dialogRef.close(2);
          }).add(() => {
            this.isLoading = false;//this.toggleLoader(false);
          });
    } else {
      //create new registry
      this.articuloService.saveArticulo(data)
          .subscribe( (data : any) => {
            console.log(data);
            this.dialogRef.close(1);
          }, (error: any) => {
            this.dialogRef.close(2);
          }).add(() => {
            this.isLoading = false;//this.toggleLoader(false);
          });
    }
  }

  onCancel(){
    this.dialogRef.close(3);
  }
/*
  updateForm(data: any){
    this.articuloForm = this.fb.group( {
      nombrearticulo: [data.nombrearticulo, Validators.required],
      descriparticulo: [data.descriparticulo, Validators.required]
    });

  }*/
  updateForm(data: any) {
    this.idAlfanumerico = `ART${data.id}`;
    this.articuloForm.setValue({
      idAlfanumerico: this.idAlfanumerico,
      nombrearticulo: data.nombrearticulo,
      descriparticulo: data.descriparticulo
    });
  }
  
  convertirAMayusculas(event: any) {
    const input = event.target as HTMLInputElement;
    const valor = input.value.toUpperCase();
    input.value = valor;
  } 

}
