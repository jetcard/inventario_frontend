import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

const base_url = "https://gpoek4dam4.execute-api.ap-southeast-2.amazonaws.com/prod";

@Injectable({
  providedIn: 'root'
})
export class ActivoService {

  constructor(private http: HttpClient) { }
  
  getActivos(){
    const endpoint = `${ base_url}/activos`;
    return this.http.get(endpoint);
  }

  getAtributos(responsableId: number, articuloId: number, tipoId: number, grupoId: number): Observable<any> {
    const url = `${base_url}/getAtributos`;
    const params = { responsableId, articuloId, tipoId, grupoId };
    return this.http.get<any>(url, { params });
  }    

  saveActivo(body: any){
    const endpoint = `${ base_url}/activos`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };    
    //return this.http.post(endpoint, body, httpOptions);
    return this.http.post(endpoint, JSON.stringify(body), httpOptions);
  }
  
  /*saveEspecifico(data: any): Observable<any> {
    const endpoint = `${base_url}/especifico`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<any>(endpoint, data, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }*/
  private handleError(error: HttpErrorResponse): Observable<any> {
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      console.error('Ocurrió un error:', error.error.message);
    } else {
      // El servidor devolvió un código de estado fallido.
      console.error(
        `El servidor devolvió el código de estado ${error.status}, ` +
        `con el mensaje de error: ${error.error}`);
    }
    // Devuelve un observable con un mensaje de error adecuado para el usuario
    return throwError('Algo malo ocurrió; por favor, inténtalo de nuevo más tarde.');
  }
  /*crearEspecifico(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    console.error('Error en la solicitud:', error);
    throw error;
  }  */

  /**
   * update especifico
   */
  updateActivo (body: any, id: any){
    const endpoint = `${ base_url}/activos/${id}`;
    return this.http.put(endpoint, body);
  }

  deleteActivo(id: any){
    const endpoint = `${ base_url}/activos/${id}`;
    return this.http.delete(endpoint);
  }

  getActivoByModelo(modelo: any){
    const endpoint = `${ base_url}/activo/filter/${modelo}`;
    return this.http.get(endpoint);
  }

  exportActivo(){
    const endpoint = `${base_url}/activo/export/excel`;
    return this.http.get(endpoint, {
      responseType: 'blob'
    });
  }
}