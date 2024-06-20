import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ResponsableService } from '../../shared/services/responsable.service';
import { ArticuloService } from '../../shared/services/articulo.service';
import { EspecificoService } from '../../shared/services/especifico.service';
import { EspecificosService } from '../../shared/services/especificos.service';
import { GrupoService } from '../../shared/services/grupo.service';
import { TipoBienService } from '../../shared/services/tipobien.service';
import { ProveedorService } from '../../shared/services/proveedor.service';

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

export interface Proveedor{
  id: number;
  ruc: string;
  razonsocial: string;
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
  private proveedorService    = inject(ProveedorService);
  public especificoForm!: FormGroup;
  estadoFormulario: string = "";
  responsables: Responsable[] = [];
  articulos: Articulo[] = [];
  tipos: TipoBien[]=[];
  grupos: Grupo[]=[];
  proveedores       : Proveedor   []=[];
  atributos: any[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<NewEspecificoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private especificoService: EspecificoService,
    private especificosService: EspecificosService
  ) {}

  ngOnInit(): void {
    //this.estadoFormulario = this.data ? "Actualización" : "Registro";
    this.muestraComboResponsables();
    this.muestraComboArticulos();
    this.muestraComboGrupos();
    this.muestraComboTipos();
    this.muestraComboProveedores();
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
    //this.estadoFormulario = this.data ? "Actualizar" : "Agregar";
    this.setupValueChanges();
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
      /*responsableid: [this.data?.responsable?.id, Validators.required],
      articuloid: [this.data?.articulo?.id, Validators.required],
      grupoid: [this.data?.grupo?.id, Validators.required],
      tipoid: [this.data?.tipo?.id, Validators.required],
    codinventario: [this.data?.codinventario, Validators.required],
  modelo: [this.data?.modelo, Validators.required],
marca: [this.data?.marca, Validators.required],
nroserie: [this.data?.nroserie, Validators.required],
fechaingreso: [this.data?.fechaingreso, Validators.required],
importe: [this.data?.importe, Validators.required],
moneda: [this.data?.moneda, Validators.required],      
proveedorid: [this.data?.proveedor?.id, Validators.required],
      especificos: this.fb.array([])*/
      responsableid: [this.data?.responsableid || '', Validators.required],
      articuloid: [this.data?.articuloid || '', Validators.required],
      grupoid: [this.data?.grupoid || '', Validators.required],
      tipoid: [this.data?.tipoid || '', Validators.required],
      codinventario: [this.data?.codinventario || '', Validators.required],
      modelo: [this.data?.modelo || '', Validators.required],
      marca: [this.data?.marca || '', Validators.required],
      nroserie: [this.data?.nroserie || '', Validators.required],
      fechaingreso: [this.data?.fechaingreso || '', Validators.required],      
      importe: [this.data?.importe || '', Validators.required],
      moneda: [this.data?.moneda || 'S/', Validators.required],
      proveedorid: [this.data?.proveedorid || '', Validators.required],
      descripcion: [this.data?.descripcion || '', Validators.required],
 ///     atributo: ['', Validators.required],  // Añade este campo para el atributo
      especificos: this.fb.array(this.data?.especificos?.map((especifico: any) => this.createEspecificoFormGroup(especifico)) || [])
    });
  }
/*
  initializeForm(): void {
    this.especificoForm = this.fb.group({
      //idAlfanumerico: [{ value: '', disabled: true }],
      responsable: ['', Validators.required],
      articulo: ['', Validators.required],
      tipo: ['', Validators.required],
      grupo: ['', Validators.required],
codinventario: ['', Validators.required],
modelo: ['', Validators.required],
marca: ['', Validators.required],
nroserie: ['', Validators.required],
fechaingreso: ['', Validators.required],
importe: ['', Validators.required],
moneda: ['', Validators.required],      
proveedor: ['', Validators.required],
      especificos: this.fb.array([
        this.fb.group({
          especificoid: '',
          nombreespecifico: '',
        }),
      ]),      
    });
  }
*/

private initializeFormData(): void {
  if (this.data) {
    this.especificoForm.patchValue(this.data);
  }
}

  private initializeFormDatOK(): void {
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

    if (this.data?.proveedor) {
      this.especificoForm.patchValue({
        proveedorid: this.data.proveedor.id
      });
    }    
  }


  createEspecificoFormGroup(especifico: any = {}): FormGroup {
    return this.fb.group({
      atributo: [especifico.atributo || '', Validators.required],
      nombreespecifico: [especifico.nombreespecifico || '', Validators.required]
    });
  }

  get especificosArray(): FormArray {
    return this.especificoForm.get('especificos') as FormArray;
  }

  addEspecifico(): void {
    const especificoGroup = this.fb.group({
      nombreespecifico: ['', Validators.required]
    });    
    this.especificosArray.push(this.createEspecificoFormGroup());
    this.especificoForm.markAsTouched();
  }

  removeEspecifico(index: number): void {
    this.especificosArray.removeAt(index);
    this.especificoForm.markAsTouched();
  }

  addEspecificoOK(): void {
    ///
    const especificoGroup = this.fb.group({
      nombreespecifico: ['', Validators.required]
    });////
    this.especificosArray.push(this.createEspecifico());
    this.especificoForm.markAsTouched();
  }

  private setupValueChanges(): void {
    this.especificoForm.get('responsableid')?.valueChanges.subscribe(() => this.updateAtributos());
    this.especificoForm.get('articuloid')?.valueChanges.subscribe(() => this.updateAtributos());
    this.especificoForm.get('tipoid')?.valueChanges.subscribe(() => this.updateAtributos());
    this.especificoForm.get('grupoid')?.valueChanges.subscribe(() => this.updateAtributos());
  }

  updateAtributos(): void {
    const responsableId = this.especificoForm.get('responsableid')?.value;
    const articuloId = this.especificoForm.get('articuloid')?.value;
    const tipoId = this.especificoForm.get('tipoid')?.value;
    const grupoId = this.especificoForm.get('grupoid')?.value;

    // Verificar que todos los campos tengan valores antes de llamar al servicio
    if (responsableId !== null && articuloId !== null && tipoId !== null && grupoId !== null) {
      this.especificosService.getAtributosEspecificos(responsableId, articuloId, tipoId, grupoId).subscribe(
        (data: any) => {
          if (data && data.atributosResponse && data.atributosResponse.listaatributoss) {
            this.atributos = data.atributosResponse.listaatributoss; // Asignar los atributos obtenidos del servicio
          } else {
            this.atributos = []; // Si no hay atributos devueltos, asignar un array vacío
          }
        },
        (error: any) => {
          console.error('Error fetching atributos', error);
          this.atributos = []; // Manejar el error asignando un array vacío
        }
      );
    } else {
      this.atributos = []; // Si alguno de los campos es null, asignar un array vacío (opcional, depende de tu lógica)
    }

    // Resetear el campo 'atributo' después de cada actualización de atributos
    this.especificoForm.get('atributo')?.setValue('');
  }


    /*if (responsableId && articuloId && tipoId && grupoId) {
      this.especificosService.getAtributosEspecificos(responsableId, articuloId, tipoId, grupoId).subscribe(
        (data: any) => {
          this.atributos = data;
        },
        (error: any) => {
          console.error('Error fetching atributos', error);
        }
      );
    }*/
    /*if (responsableId === 1 && articuloId === 1 && tipoId === 1 && grupoId === 1) {
      this.atributos = [
        { value: '1', viewValue: 'ALTO' },
        { value: '2', viewValue: 'ANCHO' },
        { value: '3', viewValue: 'LARGO' }
      ];
    } else {
      this.atributos = [
        { value: '1', viewValue: '1' },
        { value: '2', viewValue: '2' }
      ];
    }*/


  onSave(): void {
    if (this.especificoForm.valid) {
      const formData = this.especificoForm.value;
      let fechaingreso = this.especificoForm.get('fechaingreso')?.value;
      if (fechaingreso) {
        fechaingreso = fechaingreso.toISOString().substring(0, 10);
      } else {
        fechaingreso = null;
      }
      let data = {
        //Conflicto responsableid vs responsable, graba bien
        responsableId : this.especificoForm.get('responsableid')?.value,
        articuloId    : this.especificoForm.get('articuloid')?.value,
        tipoId    : this.especificoForm.get('tipoid')?.value,  
        grupoId    : this.especificoForm.get('grupoid')?.value,
        codinventario : this.especificoForm.get('codinventario')?.value,
        modelo        : this.especificoForm.get('modelo')?.value,
        marca         : this.especificoForm.get('marca')?.value,
        nroserie      : this.especificoForm.get('nroserie')?.value,
        fechaingreso  : fechaingreso,
        fechaingresostr  : fechaingreso,
        //fechaingreso  : this.especificoForm.get('fechaingreso')?.value,
        importe       : this.especificoForm.get('importe')?.value,//numericValue,
        moneda        : this.especificoForm.get('moneda')?.value, 
        descripcion        : this.especificoForm.get('descripcion')?.value,        
        ///responsableId: formData.responsableid,
        ///articuloId: formData.articuloid,
        proveedorId   : this.especificoForm.get('proveedorid')?.value,
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

  muestraComboProveedores(): void {
    this.proveedorService.getProveedores().subscribe(
      (data: any) => {
        this.proveedores = data.proveedorResponse.listaproveedores;
      },
      (error: any) => {
        console.error('Error fetching proveedores', error);
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
