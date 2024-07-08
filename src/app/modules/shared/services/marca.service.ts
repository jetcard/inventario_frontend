import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

const base_url = "https://ud62hxv982.execute-api.ap-southeast-2.amazonaws.com/prod";

@Injectable({
  providedIn: 'root'
})
export class MarcaService {

  constructor(private http: HttpClient) { }
  
  /**
   * get all the marcas
   */
  getMarcas(){
    const endpoint = `${ base_url}/marcas`;
    return this.http.get(endpoint);
  }

  /**
   * save the marca
   */
  saveMarca(body: any){
    const endpoint = `${ base_url}/marcas`;
    return this.http.post(endpoint, body);
    /*const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    console.log(JSON.stringify(body));    
    return this.http.post(endpoint, body, httpOptions);*/
    //return this.http.post(endpoint, JSON.stringify(body), httpOptions);
  }

  /**
   * update marca
   */
  updateMarca (body: any, id: any){
    const endpoint = `${ base_url}/marcas/${id}`;
    body.id = id;
    return this.http.put(endpoint, body);
  }

  /**
   * delete marca
   */
  deleteMarca(body: any, id: any){
    const endpoint = `${ base_url}/marcas/${id}`;
    body.id = id;
    return this.http.delete(endpoint);
  }

  /**
   * search by descripcion
   */
  getMarcaByDescrip(descripcion: any){
    const endpoint = `${ base_url}/marcas/filter/${descripcion}`;
    return this.http.get(endpoint);
  }


  /**
   * export excel marcas
   */
  exportMarca(){
    const endpoint = `${base_url}/marcas/export/excel`;
    return this.http.get(endpoint, {
      responseType: 'blob'
    });
  }
}
