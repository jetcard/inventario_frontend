import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

const base_url = "https://hoifc29thg.execute-api.ap-southeast-2.amazonaws.com/prod";

@Injectable({
  providedIn: 'root'
})
export class EspecificoService {

  constructor(private http: HttpClient) { }
  
  getEspecificos(){
    const endpoint = `${ base_url}/especifico`;
    return this.http.get(endpoint);
  }

  saveEspecifico(body: any){
    const endpoint = `${ base_url}/especifico`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    console.log('específico json: ',JSON.stringify(body)); 
    return this.http.post(endpoint, JSON.stringify(body), httpOptions);
  }

  private handleError(error: HttpErrorResponse): Observable<any> {
    if (error.error instanceof ErrorEvent) {
      console.error('Ocurrió un error del cliente:', error.error.message);
    } else {
      console.error(
        `El servidor devolvió el código de estado ${error.status}, ` +
        `con el mensaje de error: ${error.error}`);
    }
    // Devuelve un observable con un mensaje de error adecuado para el usuario
    return throwError('Algo malo ocurrió; por favor, inténtalo de nuevo más tarde.');
  }

  updateEspecifico (body: any, id: any){
    const endpoint = `${ base_url}/especifico/${id}`;
    return this.http.put(endpoint, body);
  }

  deleteEspecifico(id: any){
    const endpoint = `${ base_url}/especifico/${id}`;
    return this.http.delete(endpoint);
  }

  getEspecificoByModelo(modelo: any){
    const endpoint = `${ base_url}/especifico/${modelo}`;
    return this.http.get(endpoint);
  }

  exportEspecifico(){
    const endpoint = `${base_url}/especifico/export/excel`;
    return this.http.get(endpoint, {
      responseType: 'blob'
    });
  }
}
