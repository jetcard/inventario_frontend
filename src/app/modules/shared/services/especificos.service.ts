import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

const base_url = "https://992n2tk846.execute-api.ap-southeast-2.amazonaws.com/prod";

@Injectable({
  providedIn: 'root'
})
export class EspecificosService {

  constructor(private http: HttpClient) { }
  
  /**
   * get all the especificoss
   */
  getEspecificoss(){
    const endpoint = `${ base_url}/especificoss`;
    return this.http.get(endpoint);
  }

  getAtributosEspecificos(responsableId: number, articuloId: number, tipoId: number, grupoId: number): Observable<any> {
    const url = `${base_url}/especificos`;
    const params = { responsableId, articuloId, tipoId, grupoId };
    return this.http.get<any>(url, { params });
  }   

  /**
   * save the especificos
   */
  /*saveEspecificos(body: any){
    const endpoint = `${ base_url}/especificos`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };    
    //return this.http.post(endpoint, body, httpOptions);
    return this.http.post(endpoint, JSON.stringify(body), httpOptions);
  }*/
  saveEspecificos(data: any): Observable<any> {
    const endpoint = `${base_url}/especificos`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<any>(endpoint, data, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }
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
  /*crearEspecificos(data: any): Observable<any> {
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
   * update especificos
   */
  updateEspecificos (body: any, id: any){
    const endpoint = `${ base_url}/especificos/${id}`;
    return this.http.put(endpoint, body);
  }

  /**
   * delete especificos
   */
  deleteEspecificos(id: any){
    const endpoint = `${ base_url}/especificos/${id}`;
    return this.http.delete(endpoint);
  }

  /**
   * search by modelo
   */
  getEspecificosByModelo(modelo: any){
    const endpoint = `${ base_url}/especificos/filter/${modelo}`;
    return this.http.get(endpoint);
  }


  /**
   * export excel especificoss
   */
  exportEspecificos(){
    const endpoint = `${base_url}/especificos/export/excel`;
    return this.http.get(endpoint, {
      responseType: 'blob'
    });
  }
}
