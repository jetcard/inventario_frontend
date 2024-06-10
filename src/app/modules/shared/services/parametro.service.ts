import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

const base_url = "https://wgb5n0wymg.execute-api.ap-southeast-2.amazonaws.com/prod";

@Injectable({
  providedIn: 'root'
})
export class ParametroService {

  constructor(private http: HttpClient) { }
  
  /**
   * get all the parametros
   */
  getParametros(){
    const endpoint = `${ base_url}/parametros`;
    return this.http.get(endpoint);
  }

  /**
   * save the parametro
   */
  saveParametro(body: any){
    const endpoint = `${ base_url}/parametros`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };    
    return this.http.post(endpoint, body, httpOptions);
    //return this.http.post(endpoint, JSON.stringify(body), httpOptions);
  }

  /**
   * update parametro
   */
  updateParametro (body: any, id: any){
    const endpoint = `${ base_url}/parametros/${id}`;
    return this.http.put(endpoint, body);
  }

  /**
   * delete parametro
   */
  deleteParametro(id: any){
    const endpoint = `${ base_url}/parametros/${id}`;
    return this.http.delete(endpoint);
  }

  /**
   * search by descripparametro
   */
  getParametroByDescrip(descripparametro: any){
    const endpoint = `${ base_url}/parametros/filter/${descripparametro}`;
    return this.http.get(endpoint);
  }


  /**
   * export excel parametros
   */
  exportParametro(){
    const endpoint = `${base_url}/parametros/export/excel`;
    return this.http.get(endpoint, {
      responseType: 'blob'
    });
  }
}
