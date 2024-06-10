import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../shared/material.module';
import { EspecificoComponent } from './especifico/especifico.component';
import { NewEspecificoComponent } from './new-especifico/new-especifico.component';

@NgModule({
  declarations: [
    EspecificoComponent,
    NewEspecificoComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class EspecificoModule { }
