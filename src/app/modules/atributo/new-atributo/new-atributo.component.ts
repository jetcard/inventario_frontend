import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ResponsableService } from '../../shared/services/responsable.service';
import { ArticuloService } from '../../shared/services/articulo.service';
import { AtributoService } from '../../shared/services/atributo.service';

export interface Responsable{
  nombresyapellidos: string;
  id: number;
  arearesponsable: string;
}

export interface Articulo{
  descriparticulo: string;
  id: number;
  nombrearticulo: string;
}

@Component({
  selector: 'app-new-atributo',
  templateUrl: './new-atributo.component.html',
  styleUrls: ['./new-atributo.component.css']
})
export class NewAtributoComponent implements OnInit {

  private responsableService=inject(ResponsableService);
  private articuloService=inject(ArticuloService);

  public atributoForm!: FormGroup;
  estadoFormulario: string = "";
  responsables: Responsable[] = [];
  articulos: Articulo[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<NewAtributoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private atributoService: AtributoService
  ) {}

  ngOnInit(): void {
    this.estadoFormulario = this.data ? "Actualización" : "Registro";
    /*if (this.data != null) {
      this.updateForm(this.data);
      this.estadoFormulario = "Actualizar";
    } else {
      //this.generateNewIdAlfanumerico();
      this.estadoFormulario = "Agregar";
    } */
    this.initForm();
    this.getResponsables();
    this.getArticulos();
    this.initializeFormData();
    //this.initializeForm();//
  }

  initializeForm(): void {
    this.atributoForm = this.fb.group({
      //idAlfanumerico: [{ value: '', disabled: true }],
      responsable: ['', Validators.required],
      articulo: ['', Validators.required],
      atributos: this.fb.array([
        this.fb.group({
          atributoid: '',
          nombreatributo: '',
        }),
      ]),      
    });
  }
  initializeAtributoForm() {
    this.atributoForm = this.fb.group({
      responsableid: ['', Validators.required],
      articuloid: ['', Validators.required],
      atributos: this.fb.array([
        this.fb.group({
          atributoid: '',
          nombreatributo: '',
        }),
      ]),
      //atributos: this.fb.array([]) // Inicializa el FormArray vacío al inicio
    });
  }

  private initForm(): void {
    this.atributoForm = this.fb.group({
      id: [this.data?.id],
      ///articulo: [this.data.articulo.id, Validators.required],///
      responsableid: [this.data?.responsable?.id, Validators.required],
      articuloid: [this.data?.articulo?.id, Validators.required],
      atributos: this.fb.array([])
    });
  }

  private initializeFormData(): void {
    if (this.data?.atributos) {
      this.data.atributos.forEach((atributo: any) => {
        this.atributosArray.push(this.fb.group({
          id: [atributo.id],
          atributoid: [atributo.atributoid],
          nombreatributo: [atributo.nombreatributo]
        }));
      });
    } else {
      this.addAtributo(); // Agrega un campo de atributo por defecto al iniciar
    }

    // Inicializar responsableid y articuloid si están disponibles en los datos
    if (this.data?.responsable) {
      this.atributoForm.patchValue({
        responsableid: this.data.responsable.id
      });
    }

    if (this.data?.articulo) {
      this.atributoForm.patchValue({
        //articulo: [this.data.articulo.id, Validators.required],
        articuloid: this.data.articulo.id
      });
    }
  }

  get atributosArray(): FormArray {
    return this.atributoForm.get('atributos') as FormArray;
  }

  addAtributo(): void {
    ///
    const atributoGroup = this.fb.group({
      nombreatributo: ['', Validators.required]
    });////
    this.atributosArray.push(this.createAtributo());
    this.atributoForm.markAsTouched();
  }

  removeAtributo(index: number): void {
    this.atributosArray.removeAt(index);
    this.atributoForm.markAsTouched();
  }

  onSave(): void {
    if (this.atributoForm.valid) {
      const formData = this.atributoForm.value;

      let data = {
        responsableId: formData.responsableid,
        articuloId: formData.articuloid,
        atributos: formData.atributos,
      };

      if (formData.id) {
        // Actualizar atributo existente
        this.updateAtributo(data, formData.id);
      } else {
        // Crear nuevo atributo
        this.saveAtributo(data);
      }
    } else {
      this.markFormGroupTouched(this.atributoForm);
    }
  }

  saveAtributo(data: any): void {
    this.atributoService.saveAtributo(data)
      .subscribe(
        () => this.dialogRef.close(1), // Éxito
        () => this.dialogRef.close(2) // Error
      );
  }

  updateAtributo(data: any, id: number): void {
    this.atributoService.updateAtributo(data, data.id)
      .subscribe(
        () => this.dialogRef.close(1), // Éxito
        () => this.dialogRef.close(2) // Error
      );
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }


  createAtributo(): FormGroup {
    return this.fb.group({
      atributoid: ['', Validators.required],
      nombreatributo: ['', Validators.required],
    });
  }


  getResponsables(): void {
    this.responsableService.getResponsables()
      .subscribe(
        (data: any) => this.responsables = data.responsableResponse.listaresponsables,
        (error: any) => console.error("Error al consultar responsables", error)
      );
  }

  getArticulos(): void {
    this.articuloService.getArticulos()
      .subscribe(
        (data: any) => this.articulos = data.articuloResponse.listaarticulos,
        (error: any) => console.error("Error al consultar artículos", error)
      );
  }

  convertirAMayusculas(event: any) {
    const input = event.target as HTMLInputElement;
    const valor = input.value.toUpperCase();
    input.value = valor;
  }

  onCancel(): void {
    this.dialogRef.close(3);
  }

  updateForm(data: any){
    this.atributoForm = this.fb.group( {
      responsable: [data.responsable.id, Validators.required],
      articulo: [data.articulo.id, Validators.required],
      atributos: [data.atributos, Validators.required]
    })
  }

}
