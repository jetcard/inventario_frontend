import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../shared/material.module';
import { ActivoComponent } from './activo/activo.component';
import { NewActivoComponent } from './new-activo/new-activo.component';
import { DatePipe } from '@angular/common';
import { CurrencyPipe } from '@angular/common';
import { CurrencyFormatDirective } from './currency-format.directive'; // Ajusta la ruta según tu estructura de archivos
import { DecimalPipe } from '@angular/common';
//import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    ActivoComponent,
    NewActivoComponent,
    CurrencyFormatDirective
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
 providers: [
    DecimalPipe,
    CurrencyPipe,
    DatePipe, // Agrega DatePipe a la lista de proveedores
    ///ActivoService // Si no lo has hecho ya
  ],
  //bootstrap: [AppComponent]
})
export class ActivoModule { }