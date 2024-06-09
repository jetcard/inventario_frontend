import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ResponsableService } from '../../shared/services/responsable.service';
import { ArticuloService } from '../../shared/services/articulo.service';
import { AtributoService } from '../../shared/services/atributo.service';
import { GrupoService } from '../../shared/services/grupo.service';
import { TipoBienService } from '../../shared/services/tipobien.service';

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

@Component({
  selector: 'app-new-atributo',
  templateUrl: './new-atributo.component.html',
  styleUrls: ['./new-atributo.component.css']
})
export class NewAtributoComponent implements OnInit {

  private responsableService=inject(ResponsableService);
  private articuloService=inject(ArticuloService);
  private grupoService= inject(GrupoService);
  private tipoService=inject(TipoBienService);

  public atributoForm!: FormGroup;
  estadoFormulario: string = "";
  responsables: Responsable[] = [];
  articulos: Articulo[] = [];
  tipos: TipoBien[]=[];
  grupos: Grupo[]=[];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<NewAtributoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private atributoService: AtributoService
  ) {}

  ngOnInit(): void {
    //this.estadoFormulario = this.data ? "Actualización" : "Registro";
    this.muestraComboResponsables();
    this.muestraComboArticulos();
    this.muestraComboGrupos();
    this.muestraComboTipos();
    this.initForm();
    this.initializeFormData();
    //this.initializeForm();//
    if (this.data != null) {
      //this.updateForm(this.data);
      this.estadoFormulario = "Actualizar";
    } else {
      //this.generateNewIdAlfanumerico();
      this.estadoFormulario = "Agregar";
    }   
  }
/*
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
  }*/

  private initForm(): void {
    this.atributoForm = this.fb.group({
      id: [this.data?.id],
      ///articulo: [this.data.articulo.id, Validators.required],///
      responsableid: [this.data?.responsable?.id, Validators.required],
      articuloid: [this.data?.articulo?.id, Validators.required],
      grupoid: [this.data?.grupo?.id, Validators.required],
      tipoid: [this.data?.tipo?.id, Validators.required],
      atributos: this.fb.array([])
    });
  }

  initializeForm(): void {
    this.atributoForm = this.fb.group({
      //idAlfanumerico: [{ value: '', disabled: true }],
      responsable: ['', Validators.required],
      articulo: ['', Validators.required],
      tipo: ['', Validators.required],
      grupo: ['', Validators.required],
      atributos: this.fb.array([
        this.fb.group({
          atributoid: '',
          nombreatributo: '',
        }),
      ]),      
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

    if (this.data?.tipo) {
      this.atributoForm.patchValue({
        tipoid: this.data.tipo.id
      });
    }

    if (this.data?.grupo) {
      this.atributoForm.patchValue({
        grupoid: this.data.grupo.id
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
        //Conflicto responsableid vs responsable, graba bien
        responsableId : this.atributoForm.get('responsableid')?.value,
        articuloId    : this.atributoForm.get('articuloid')?.value,
        tipoId    : this.atributoForm.get('tipoid')?.value,  
        grupoId    : this.atributoForm.get('grupoid')?.value,
        ///responsableId: formData.responsableid,
        ///articuloId: formData.articuloid,
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
      ///atributoid: ['', Validators.required],
      nombreatributo: ['', Validators.required],
    });
  }


  muestraComboResponsables(): void {
    this.responsableService.getResponsables()
      .subscribe(
        (data: any) => this.responsables = data.responsableResponse.listaresponsables,
        (error: any) => console.error("Error al consultar responsables", error)
      );
  }

  muestraComboArticulos(): void {
    this.articuloService.getArticulos()
      .subscribe(
        (data: any) => this.articulos = data.articuloResponse.listaarticulos,
        (error: any) => console.error("Error al consultar artículos", error)
      );
  }

  muestraComboGrupos(): void {
    this.grupoService.getGrupos().subscribe(
      (data: any) => {
        this.grupos = data.grupoResponse.listagrupos;
      },
      (error: any) => {
        console.error('Error fetching grupos', error);
      }
    );
  }

  muestraComboTipos(): void {
    this.tipoService.getTipoBienes().subscribe(
      (data: any) => {
        this.tipos = data.tipoResponse.listatipos;
      },
      (error: any) => {
        console.error('Error fetching tipos', error);
      }
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
      tipo: [data.tipo.id, Validators.required],
      grupo: [data.grupo.id, Validators.required],
      atributos: [data.atributos, Validators.required]
    })
  }

}
