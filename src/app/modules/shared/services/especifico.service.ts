import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

const base_url = "https://v3cs3ugdgh.execute-api.ap-southeast-2.amazonaws.com/prod";

@Injectable({
  providedIn: 'root'
})
export class EspecificoService {

  constructor(private http: HttpClient) { }
  
  /**
   * get all the especificos
   */
  getEspecificos(){
    const endpoint = `${ base_url}/especifico`;
    return this.http.get(endpoint);
  }

  /**
   * save the especifico
   */
  saveEspecifico(body: any){
    const endpoint = `${ base_url}/especifico`;
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
  updateEspecifico (body: any, id: any){
    const endpoint = `${ base_url}/especifico/${id}`;
    return this.http.put(endpoint, body);
  }

  /**
   * delete especifico
   */
  deleteEspecifico(id: any){
    const endpoint = `${ base_url}/especifico/${id}`;
    return this.http.delete(endpoint);
  }

  /**
   * search by modelo
   */
  getEspecificoByModelo(modelo: any){
    const endpoint = `${ base_url}/especifico/filter/${modelo}`;
    return this.http.get(endpoint);
  }


  /**
   * export excel especificos
   */
  exportEspecifico(){
    const endpoint = `${base_url}/especifico/export/excel`;
    return this.http.get(endpoint, {
      responseType: 'blob'
    });
  }
}
