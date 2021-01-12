
import { ApiBaseService, Endpoint } from './ApiBaseService';
import axios, { AxiosRequestConfig, AxiosResponse, } from 'axios';

@Endpoint('campo')
export class PoligonoService extends ApiBaseService<any> {

  public async getPoligonosByCampo(campoId: number, params?): Promise<Poligono[]> {
    let options: AxiosRequestConfig = { params: params };
    let response: AxiosResponse<Poligono[]> = await axios.get<Poligono[]>(this.endpoint + '/' + campoId + '/poligono', options);
    return response.data as Poligono[];
  }
}