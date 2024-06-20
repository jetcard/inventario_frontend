import { Component, Inject, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TipoBienService } from 'src/app/modules/shared/services/tipobien.service';

@Component({
  selector: 'app-new-tipobien',
  templateUrl: './new-tipobien.component.html',
  styleUrls: ['./new-tipobien.component.css']
})
export class NewTipoBienComponent implements OnInit{

  public tipoBienForm!: FormGroup;
  private fb = inject(FormBuilder);
  private tipoBienService= inject(TipoBienService);
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
    this.tipoBienForm = this.fb.group({
      idAlfanumerico: [{ value: '', disabled: true }],
      nombretipo: ['', Validators.required],
      descriptipo: ['', Validators.required]
    });
  }

  async generateNewIdAlfanumerico() {
    this.isLoading = true;//this.toggleLoader(true);
    this.tipoBienService.getTipoBienes().subscribe((response: any) => {
      if (response.metadata[0].code === "00") {
        const listTipoBien = response.tipoResponse.listatipos;
        const newId = listTipoBien.length + 1;
        this.idAlfanumerico = `TIP${newId}`;
        this.tipoBienForm.get('idAlfanumerico')?.setValue(this.idAlfanumerico);
      } else {
        console.error('Error fetching tipos to generate ID');
        this.idAlfanumerico = 'TIP1';
        this.tipoBienForm.get('idAlfanumerico')?.setValue(this.idAlfanumerico);
      }
    }, error => {
      console.error('Error fetching tipos to generate ID', error);
      this.idAlfanumerico = 'TIP1';
      this.tipoBienForm.get('idAlfanumerico')?.setValue(this.idAlfanumerico);
    }).add(() => {
      this.isLoading = true;//this.toggleLoader(false);
    });
  }   

  onSave(){
    this.isLoading = true;//this.toggleLoader(true);
    let data = {
      nombretipo: this.tipoBienForm.get('nombretipo')?.value,
      descriptipo: this.tipoBienForm.get('descriptipo')?.value
    }

    if (this.data != null ){
      //update registry
      this.tipoBienService.updateTipoBien(data, this.data.id)
              .subscribe( (data: any) =>{
                this.dialogRef.close(1);
              }, (error:any) =>{
                this.dialogRef.close(2);
              }).add(() => {
                this.isLoading = true;//this.toggleLoader(false); // Detener loader al finalizar
              });
    } else {
      //create new registry
      this.tipoBienService.saveTipoBien(data)
          .subscribe( (data : any) => {
            console.log(data);
            this.dialogRef.close(1);
          }, (error: any) => {
            this.dialogRef.close(2);
          }).add(() => {
            this.isLoading = true;//this.toggleLoader(false); // Detener loader al finalizar
          });
    }
  }

  onCancel(){
    this.dialogRef.close(3);
  }

/*  updateForm(data: any){
    this.tipoBienForm = this.fb.group( {
      nombretipo: [data.nombretipo, Validators.required],
      descriptipo: [data.descriptipo, Validators.required]
    });
  }*/
  updateForm(data: any) {
    this.idAlfanumerico = `TIP${data.id}`;
    this.tipoBienForm.setValue({
      idAlfanumerico: this.idAlfanumerico,
      nombretipo: data.nombretipo,
      descriptipo: data.descriptipo
    });
  }

  convertirAMayusculas(event: any) {
    const input = event.target as HTMLInputElement;
    const valor = input.value.toUpperCase();
    input.value = valor;
  }

}
