import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './pages/dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { ResponsableModule } from '../responsable/responsable.module';
import { TipoBienModule } from '../tipobien/tipobien.module';
import { ArticuloModule } from '../articulo/articulo.module';
import { GrupoModule } from '../grupo/grupo.module';
import { ActivoModule } from '../activo/activo.module';
import { ProveedorModule } from '../proveedor/proveedor.module';
import { MaterialModule } from '../shared/material.module';
import { MaestroModule } from '../maestro/maestro.module';
import { AtributoModule } from '../atributo/atributo.module';
import { AtributosModule } from '../atributos/atributos.module';
import { ComunModule } from '../comun/comun.module';
import { ParametroModule } from '../parametro/parametro.module';
import { EspecificoModule } from '../especifico/especifico.module';
import { EspecificosModule } from '../especificos/especificos.module';

@NgModule({
  declarations: [
    DashboardComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ResponsableModule,
    TipoBienModule,
    ArticuloModule,
    GrupoModule,
    ActivoModule,
    MaterialModule,
    MaestroModule,
    ProveedorModule,
    EspecificoModule,
    EspecificosModule,
    AtributoModule,
    AtributosModule,
    ComunModule,
    ParametroModule
  ]
})
export class DashboardModule { }
