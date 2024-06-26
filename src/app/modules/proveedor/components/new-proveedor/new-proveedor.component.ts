import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProveedorService } from 'src/app/modules/shared/services/proveedor.service';

@Component({
  selector: 'app-new-proveedor',
  templateUrl: './new-proveedor.component.html',
  styleUrls: ['./new-proveedor.component.css']
})
export class NewProveedorComponent implements OnInit{

  public proveedorForm!: FormGroup;
  private fb = inject(FormBuilder);
  private proveedorService= inject(ProveedorService);
  private dialogRef= inject(MatDialogRef<NewProveedorComponent>);
  public data = inject(MAT_DIALOG_DATA);
  estadoFormulario: string = "";
  //idAlfanumerico: string = "";
  public isLoading = false;

  ngOnInit(): void {
    this.initializeForm();
    if (this.data != null ){
      this.updateForm(this.data);
      this.estadoFormulario = "Actualizar";
    } else {
      //this.generateNewIdAlfanumerico();
      this.estadoFormulario = "Agregar";
    }
  }

  initializeForm() {
    this.proveedorForm = this.fb.group({
      //idAlfanumerico: [{ value: '', disabled: true }],
      ruc: ['', [Validators.required, Validators.pattern(/^\d{1,11}$/)]],
      razonsocial: ['', Validators.required],
      contacto: ['', Validators.required]
    });
  }
/*
  async generateNewIdAlfanumerico() {
    this.isLoading = true;//this.toggleLoader(true);
    this.proveedorService.getProveedores().subscribe((response: any) => {
      if (response.metadata[0].code === "00") {
        const listGrupo = response.proveedorResponse.listaproveedores;
        const newId = listGrupo.length + 1;
        this.idAlfanumerico = `PROV${newId}`;
        this.proveedorForm.get('idAlfanumerico')?.setValue(this.idAlfanumerico);
      } else {
        console.error('Error fetching proveedores to generate ID');
        this.idAlfanumerico = 'PROV1';
        this.proveedorForm.get('idAlfanumerico')?.setValue(this.idAlfanumerico);
      }
    }, error => {
      console.error('Error fetching proveedores to generate ID', error);
      this.idAlfanumerico = 'PROV1';
      this.proveedorForm.get('idAlfanumerico')?.setValue(this.idAlfanumerico);
    }).add(() => {
      this.isLoading = false;//this.toggleLoader(false); // Detener loader al finalizar
    });
  }*/

  onSave(){
    this.isLoading = true;//this.toggleLoader(true);
    if (this.proveedorForm.invalid) return;

    let data = {
      ruc: this.proveedorForm.get('ruc')?.value,
      razonsocial: this.proveedorForm.get('razonsocial')?.value.toUpperCase(),
      contacto: this.proveedorForm.get('contacto')?.value.toUpperCase()
    }

    if (this.data != null ){
      //update registry
      this.proveedorService.updateProveedor(data, this.data.id)
              .subscribe( (data: any) =>{
                this.dialogRef.close(1);
              }, (error:any) =>{
                this.dialogRef.close(2);
                this.isLoading = false;//this.toggleLoader(false);
              }).add(() => {
                this.isLoading = false;//this.toggleLoader(false);
              });
    } else {
      //create new registry
      this.proveedorService.saveProveedor(data)
          .subscribe( (data : any) => {
            console.log(data);
            this.dialogRef.close(1);
          }, (error: any) => {
            this.dialogRef.close(2);
            this.isLoading = false;//this.toggleLoader(false);
          }).add(() => {
            this.isLoading = false;//this.toggleLoader(false);
          });
    }
  }

  onCancel(){
    this.dialogRef.close(3);
  }

/*  updateForm(data: any){
    this.proveedorForm = this.fb.group( {
      ruc: [data.ruc, Validators.required],
      razonsocial: [data.razonsocial, Validators.required]
    });

  }*/
  updateForm(data: any) {
    //this.idAlfanumerico = `PROV${data.id}`;
    this.proveedorForm.setValue({
      //idAlfanumerico: this.idAlfanumerico,
      ruc: data.ruc,
      razonsocial: data.razonsocial,
      contacto: data.contacto
    });
  }

  convertirAMayusculas(event: any) {
    const input = event.target as HTMLInputElement;
    const valor = input.value.toUpperCase();
    input.value = valor;
  }
}
