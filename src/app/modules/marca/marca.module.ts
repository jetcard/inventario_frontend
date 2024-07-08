import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MarcaComponent } from './components/marca/marca.component';
import { NewMarcaComponent } from './components/new-marca/new-marca.component';

@NgModule({
  declarations: [
    MarcaComponent,
    NewMarcaComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class MarcaModule { }