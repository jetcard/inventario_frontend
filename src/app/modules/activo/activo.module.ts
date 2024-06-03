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
import { MatTabsModule } from '@angular/material/tabs';

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
    MatTabsModule
  ],
 providers: [
    DecimalPipe,
    CurrencyPipe,
    DatePipe,
  ],
  //bootstrap: [AppComponent]
})
export class ActivoModule { }
