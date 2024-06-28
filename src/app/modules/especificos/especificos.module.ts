import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../shared/material.module';
import { EspecificosComponent } from './especificos/especificos.component';
import { NewEspecificosComponent } from './new-especificos/new-especificos.component';

@NgModule({
  declarations: [
    EspecificosComponent,
    NewEspecificosComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class EspecificosModule { }