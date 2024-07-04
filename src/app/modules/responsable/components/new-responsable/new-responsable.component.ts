import { Component, Inject, inject, OnInit } from '@angular/core';
import { CustodioService } from 'src/app/modules/shared/services/custodio.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-new-responsable',
  templateUrl: './new-responsable.component.html',
  styleUrls: ['./new-responsable.component.css']
})
export class NewResponsableComponent implements OnInit{

  public responsableForm!: FormGroup;
  private fb = inject(FormBuilder);
  private custodioService= inject(CustodioService);
  private dialogRef= inject(MatDialogRef);
  public data = inject(MAT_DIALOG_DATA);
  estadoFormulario: string = "";
  public isLoading = false;

  ngOnInit(): void {
    this.initializeForm();
    if (this.data != null ){
      this.updateForm(this.data);
      this.estadoFormulario = "Actualizar";
    } else {
      this.estadoFormulario = "Agregar";
    }
  }

  initializeForm() {
    this.responsableForm = this.fb.group({
      arearesponsable: ['', Validators.required],
      nombresyapellidos: ['', Validators.required]
    });
  }

  onSave(){
    this.isLoading = true;//this.toggleLoader(true);
    let data = {
      arearesponsable: this.responsableForm.get('arearesponsable')?.value,
      nombresyapellidos: this.responsableForm.get('nombresyapellidos')?.value
    }

    if (this.data != null ){
      //update registry
      this.custodioService.updateResponsable(data, this.data.id)
              .subscribe( (data: any) =>{
                this.dialogRef.close(1);
              }, (error:any) =>{
                this.dialogRef.close(2);
              }).add(() => {
                this.isLoading = false;//this.toggleLoader(false);
              });
    } else {
      //create new registry
      this.custodioService.saveResponsable(data)
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


  updateForm(data: any){
    this.responsableForm = this.fb.group( {
      arearesponsable: [data.arearesponsable, Validators.required],
      nombresyapellidos: [data.nombresyapellidos, Validators.required]
    });
  }

  convertirAMayusculas(event: any) {
    const input = event.target as HTMLInputElement;
    const valor = input.value.toUpperCase();
    input.value = valor;
  }    

}