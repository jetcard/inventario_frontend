import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ResponsableService } from '../../shared/services/responsable.service';
import { ArticuloService } from '../../shared/services/articulo.service';
import { EspecificoService } from '../../shared/services/especifico.service';
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
  selector: 'app-new-especifico',
  templateUrl: './new-especifico.component.html',
  styleUrls: ['./new-especifico.component.css']
})
export class NewEspecificoComponent implements OnInit {

  private responsableService=inject(ResponsableService);
  private articuloService=inject(ArticuloService);
  private grupoService= inject(GrupoService);
  private tipoService=inject(TipoBienService);

  public especificoForm!: FormGroup;
  estadoFormulario: string = "";
  responsables: Responsable[] = [];
  articulos: Articulo[] = [];
  tipos: TipoBien[]=[];
  grupos: Grupo[]=[];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<NewEspecificoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private especificoService: EspecificoService
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
  initializeEspecificoForm() {
    this.especificoForm = this.fb.group({
      responsableid: ['', Validators.required],
      articuloid: ['', Validators.required],
      especificos: this.fb.array([
        this.fb.group({
          especificoid: '',
          nombreespecifico: '',
        }),
      ]),
      //especificos: this.fb.array([]) // Inicializa el FormArray vacío al inicio
    });
  }*/

  private initForm(): void {
    this.especificoForm = this.fb.group({
      id: [this.data?.id],
      ///articulo: [this.data.articulo.id, Validators.required],///
      responsableid: [this.data?.responsable?.id, Validators.required],
      articuloid: [this.data?.articulo?.id, Validators.required],
      grupoid: [this.data?.grupo?.id, Validators.required],
      tipoid: [this.data?.tipo?.id, Validators.required],
      especificos: this.fb.array([])
    });
  }

  initializeForm(): void {
    this.especificoForm = this.fb.group({
      //idAlfanumerico: [{ value: '', disabled: true }],
      responsable: ['', Validators.required],
      articulo: ['', Validators.required],
      tipo: ['', Validators.required],
      grupo: ['', Validators.required],
      especificos: this.fb.array([
        this.fb.group({
          especificoid: '',
          nombreespecifico: '',
        }),
      ]),      
    });
  }

  private initializeFormData(): void {
    if (this.data?.especificos) {
      this.data.especificos.forEach((especifico: any) => {
        this.especificosArray.push(this.fb.group({
          id: [especifico.id],
          especificoid: [especifico.especificoid],
          nombreespecifico: [especifico.nombreespecifico]
        }));
      });
    } else {
      this.addEspecifico(); // Agrega un campo de especifico por defecto al iniciar
    }

    // Inicializar responsableid y articuloid si están disponibles en los datos
    if (this.data?.responsable) {
      this.especificoForm.patchValue({
        responsableid: this.data.responsable.id
      });
    }

    if (this.data?.articulo) {
      this.especificoForm.patchValue({
        //articulo: [this.data.articulo.id, Validators.required],
        articuloid: this.data.articulo.id
      });
    }

    if (this.data?.tipo) {
      this.especificoForm.patchValue({
        tipoid: this.data.tipo.id
      });
    }

    if (this.data?.grupo) {
      this.especificoForm.patchValue({
        grupoid: this.data.grupo.id
      });
    }
  }

  get especificosArray(): FormArray {
    return this.especificoForm.get('especificos') as FormArray;
  }

  addEspecifico(): void {
    ///
    const especificoGroup = this.fb.group({
      nombreespecifico: ['', Validators.required]
    });////
    this.especificosArray.push(this.createEspecifico());
    this.especificoForm.markAsTouched();
  }

  removeEspecifico(index: number): void {
    this.especificosArray.removeAt(index);
    this.especificoForm.markAsTouched();
  }

  onSave(): void {
    if (this.especificoForm.valid) {
      const formData = this.especificoForm.value;

      let data = {
        //Conflicto responsableid vs responsable, graba bien
        responsableId : this.especificoForm.get('responsableid')?.value,
        articuloId    : this.especificoForm.get('articuloid')?.value,
        tipoId    : this.especificoForm.get('tipoid')?.value,  
        grupoId    : this.especificoForm.get('grupoid')?.value,
        ///responsableId: formData.responsableid,
        ///articuloId: formData.articuloid,
        especificos: formData.especificos,
      };

      if (formData.id) {
        // Actualizar especifico existente
        this.updateEspecifico(data, formData.id);
      } else {
        // Crear nuevo especifico
        this.saveEspecifico(data);
      }
    } else {
      this.markFormGroupTouched(this.especificoForm);
    }
  }

  saveEspecifico(data: any): void {
    this.especificoService.saveEspecifico(data)
      .subscribe(
        () => this.dialogRef.close(1), // Éxito
        () => this.dialogRef.close(2) // Error
      );
  }

  updateEspecifico(data: any, id: number): void {
    this.especificoService.updateEspecifico(data, data.id)
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


  createEspecifico(): FormGroup {
    return this.fb.group({
      ///especificoid: ['', Validators.required],
      nombreespecifico: ['', Validators.required],
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
    this.especificoForm = this.fb.group( {
      responsable: [data.responsable.id, Validators.required],
      articulo: [data.articulo.id, Validators.required],
      tipo: [data.tipo.id, Validators.required],
      grupo: [data.grupo.id, Validators.required],
      especificos: [data.especificos, Validators.required]
    })
  }

}
