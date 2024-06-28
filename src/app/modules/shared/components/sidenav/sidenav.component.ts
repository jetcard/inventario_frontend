import { MediaMatcher } from '@angular/cdk/layout';
import { Component, inject } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent {
  firstName: string;
  mobileQuery: MediaQueryList;
  private keycloakService = inject(KeycloakService);

  menuNav = [
    {name: "Home", route: "home", icon: "home"},
    {name: "Activos", route: "especifico", icon: "card_travel"},
    {name: "Maestro de tablas", route: "maestro", icon: "bookmark"},
  /*  {name: "Responsable", route: "responsable", icon: "moneda_box"},
    {name: "Tipo de Bien", route: "tipobien", icon: "desktop"},
    {name: "Articulos", route: "articulo", icon: "assessments"},
    {name: "Grupos", route: "grupo", icon: "tablet"},
    {name: "Activos", route: "activo", icon: "card_travel"},
    {name: "Proveedores", route: "proveedor", icon: "assignment"},
    {name: "Comunes", route: "comun", icon: "wallet"},
    {name: "Atributo", route: "atributo", icon: "bookmark"},
    {name: "Atributos", route: "atributos", icon: "bookmark"} */   
  ]

  constructor(media: MediaMatcher) {
    this.firstName = this.nombre();
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    //this.nombre = this.util.nombre();
    /*this.keycloakService.getUserRoles().filter(user => {
      this.agentProfile = user;
    })*/
  }

  nombre(){//this.nombre = this.util.nombre();
    return this.firstName = this.keycloakService.getUsername().substring(0,10);
  }
  /*nombre(){
    return this.keycloakService.getUsername();
  }*/

  getRoles(){
    return this.keycloakService.getUserRoles();
  }

  isAdmin(){
    let roles = this.keycloakService.getUserRoles().filter( role => role == "admin");

    if (roles.length > 0) 
      return true;
    else 
      return false;
  }
  foto(){
    return this.keycloakService.getKeycloakInstance().clientId;
  }
  logout(){
    this.keycloakService.logout();

  }

}
